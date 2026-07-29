const DOCUMENT_TYPE = 'mes-report-content'
const DOCUMENT_VERSION = 1

function createBlockId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createTextBlock(text = '') {
  return {
    id: createBlockId(),
    type: 'text',
    text: String(text),
  }
}

export function createTableBlock(rowCount = 3, columnCount = 3) {
  const safeRows = Math.min(Math.max(Number(rowCount) || 3, 1), 20)
  const safeColumns = Math.min(Math.max(Number(columnCount) || 3, 1), 10)

  return {
    id: createBlockId(),
    type: 'table',
    rows: Array.from({ length: safeRows }, () =>
      Array.from({ length: safeColumns }, () => ''),
    ),
  }
}

function normalizeTableRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return createTableBlock().rows
  }

  const columnCount = Math.min(
    Math.max(
      ...rows.map((row) => (Array.isArray(row) ? row.length : 0)),
      1,
    ),
    10,
  )

  return rows.slice(0, 20).map((row) => {
    const cells = Array.isArray(row) ? row : []
    return Array.from({ length: columnCount }, (_, index) =>
      String(cells[index] ?? ''),
    )
  })
}

function normalizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block) => {
      if (block?.type === 'text') {
        return createTextBlock(block.text ?? '')
      }
      if (block?.type === 'table') {
        return {
          id: createBlockId(),
          type: 'table',
          rows: normalizeTableRows(block.rows),
        }
      }
      return null
    })
    .filter(Boolean)
}

export function parseReportContent(content) {
  if (!content) return [createTextBlock()]

  try {
    const parsed = JSON.parse(content)
    if (
      parsed?.type === DOCUMENT_TYPE &&
      parsed?.version === DOCUMENT_VERSION
    ) {
      const blocks = normalizeBlocks(parsed.blocks)
      return blocks.length > 0 ? blocks : [createTextBlock()]
    }
  } catch {
    // 기존 보고서는 일반 문자열이므로 텍스트 블록으로 표시합니다.
  }

  return [createTextBlock(content)]
}

export function serializeReportContent(blocks) {
  return JSON.stringify({
    type: DOCUMENT_TYPE,
    version: DOCUMENT_VERSION,
    blocks: blocks.map((block) => {
      if (block.type === 'table') {
        return {
          type: 'table',
          rows: normalizeTableRows(block.rows),
        }
      }
      return {
        type: 'text',
        text: String(block.text ?? ''),
      }
    }),
  })
}

export function getReportContentTextLength(blocks) {
  return blocks.reduce((total, block) => {
    if (block.type === 'table') {
      return (
        total +
        block.rows.reduce(
          (rowTotal, row) =>
            rowTotal + row.reduce((cellTotal, cell) => cellTotal + cell.length, 0),
          0,
        )
      )
    }
    return total + String(block.text ?? '').length
  }, 0)
}

export function isReportContentEmpty(blocks) {
  return blocks.every((block) => {
    if (block.type === 'table') {
      return block.rows.every((row) => row.every((cell) => !cell.trim()))
    }
    return !String(block.text ?? '').trim()
  })
}
