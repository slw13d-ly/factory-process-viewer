import { useState } from 'react'
import {
  createTableBlock,
  createTextBlock,
  getReportContentTextLength,
  isReportContentEmpty,
  parseReportContent,
  serializeReportContent,
} from '../../utils/reportContent.js'
import './BoardForm.css'
import './ReportForm.css'

const MAX_VISIBLE_CONTENT_LENGTH = 10000

function todayValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function BlockActions({ index, count, onMove, onRemove, disabled }) {
  return (
    <div className="report-block__actions">
      <button
        type="button"
        onClick={() => onMove(index, -1)}
        disabled={disabled || index === 0}
      >
        위로
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 1)}
        disabled={disabled || index === count - 1}
      >
        아래로
      </button>
      <button
        type="button"
        className="report-block__remove"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        삭제
      </button>
    </div>
  )
}

function ReportForm({
  mode,
  authorName,
  initialPost,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}) {
  const [form, setForm] = useState(() => ({
    reportDate:
      mode === 'edit' && initialPost?.reportDate
        ? initialPost.reportDate
        : todayValue(),
    title: mode === 'edit' && initialPost ? initialPost.title : '',
    blocks:
      mode === 'edit' && initialPost
        ? parseReportContent(initialPost.content)
        : [createTextBlock()],
  }))
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [validationError, setValidationError] = useState('')

  const contentLength = getReportContentTextLength(form.blocks)
  const isEdit = mode === 'edit'

  const updateBlock = (index, updater) => {
    setForm((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) =>
        blockIndex === index ? updater(block) : block,
      ),
    }))
  }

  const moveBlock = (index, direction) => {
    setForm((current) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= current.blocks.length) return current

      const blocks = [...current.blocks]
      const [block] = blocks.splice(index, 1)
      blocks.splice(targetIndex, 0, block)
      return { ...current, blocks }
    })
  }

  const removeBlock = (index) => {
    setForm((current) => {
      const blocks = current.blocks.filter((_, blockIndex) => blockIndex !== index)
      return {
        ...current,
        blocks: blocks.length > 0 ? blocks : [createTextBlock()],
      }
    })
  }

  const addTextBlock = () => {
    setForm((current) => ({
      ...current,
      blocks: [...current.blocks, createTextBlock()],
    }))
  }

  const addTableBlock = () => {
    setForm((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        createTableBlock(tableRows, tableColumns),
      ],
    }))
  }

  const updateTableCell = (blockIndex, rowIndex, columnIndex, value) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      rows: block.rows.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentColumnIndex) =>
              currentColumnIndex === columnIndex ? value : cell,
            )
          : row,
      ),
    }))
  }

  const addTableRow = (blockIndex) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      rows: [
        ...block.rows,
        Array.from({ length: block.rows[0]?.length ?? 1 }, () => ''),
      ].slice(0, 20),
    }))
  }

  const removeTableRow = (blockIndex) => {
    updateBlock(blockIndex, (block) => ({
      ...block,
      rows: block.rows.length > 1 ? block.rows.slice(0, -1) : block.rows,
    }))
  }

  const addTableColumn = (blockIndex) => {
    updateBlock(blockIndex, (block) => {
      if ((block.rows[0]?.length ?? 0) >= 10) return block
      return {
        ...block,
        rows: block.rows.map((row) => [...row, '']),
      }
    })
  }

  const removeTableColumn = (blockIndex) => {
    updateBlock(blockIndex, (block) => {
      if ((block.rows[0]?.length ?? 0) <= 1) return block
      return {
        ...block,
        rows: block.rows.map((row) => row.slice(0, -1)),
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = form.title.trim()

    if (!form.reportDate) {
      setValidationError('보고 기준일을 선택해 주세요.')
      return
    }
    if (!title) {
      setValidationError('제목을 입력해 주세요.')
      return
    }
    if (isReportContentEmpty(form.blocks)) {
      setValidationError('내용 또는 표 데이터를 입력해 주세요.')
      return
    }
    if (contentLength > MAX_VISIBLE_CONTENT_LENGTH) {
      setValidationError('보고서 내용은 10,000자 이하로 입력해 주세요.')
      return
    }

    setValidationError('')
    await onSubmit({
      reportDate: form.reportDate,
      title,
      content: serializeReportContent(form.blocks),
    })
  }

  return (
    <form className="board-form report-form" onSubmit={handleSubmit}>
      <div className="board-form__heading">
        <div>
          <p className="board-form__eyebrow">
            {isEdit ? '보고서 수정' : '새 보고서'}
          </p>
          <h2>{isEdit ? '보고서를 수정합니다' : '보고서를 작성합니다'}</h2>
        </div>
        <button
          type="button"
          className="board-button board-button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
      </div>

      {(validationError || serverError) && (
        <p className="board-form__error" role="alert">
          {validationError || serverError}
        </p>
      )}

      <label className="board-field">
        <span>작성자</span>
        <input value={authorName} readOnly aria-readonly="true" />
        <small>작성자명 변경 불가합니다.</small>
      </label>

      <div className="report-form__title-grid">
        <label className="board-field report-form__date-field">
          <span>보고 기준일 <strong>*</strong></span>
          <input
            type="date"
            value={form.reportDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                reportDate: event.target.value,
              }))
            }
            required
          />
          <small>어느 시기의 보고서인지 선택하세요.</small>
        </label>

        <label className="board-field">
          <span>제목 <strong>*</strong></span>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            maxLength={200}
            placeholder="제목을 입력하세요"
            required
          />
          <small>{form.title.length}/200</small>
        </label>
      </div>

      <section className="report-editor" aria-labelledby="report-content-label">
        <div className="report-editor__heading">
          <div>
            <span id="report-content-label">내용 <strong>*</strong></span>
            <small>문단과 표를 원하는 순서로 추가할 수 있습니다.</small>
          </div>
          <span className="report-editor__counter">
            {contentLength.toLocaleString('ko-KR')}/10,000
          </span>
        </div>

        <div className="report-editor__toolbar">
          <button
            type="button"
            className="board-button board-button--secondary"
            onClick={addTextBlock}
            disabled={isSubmitting}
          >
            문단 추가
          </button>
          <div className="report-editor__table-tool">
            <label>
              행
              <input
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(event) => setTableRows(event.target.value)}
              />
            </label>
            <label>
              열
              <input
                type="number"
                min="1"
                max="10"
                value={tableColumns}
                onChange={(event) => setTableColumns(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="board-button board-button--secondary"
              onClick={addTableBlock}
              disabled={isSubmitting}
            >
              표 추가
            </button>
          </div>
        </div>

        <div className="report-editor__blocks">
          {form.blocks.map((block, blockIndex) => (
            <section className="report-block" key={block.id}>
              <div className="report-block__heading">
                <strong>
                  {block.type === 'table'
                    ? `표 ${blockIndex + 1}`
                    : `문단 ${blockIndex + 1}`}
                </strong>
                <BlockActions
                  index={blockIndex}
                  count={form.blocks.length}
                  onMove={moveBlock}
                  onRemove={removeBlock}
                  disabled={isSubmitting}
                />
              </div>

              {block.type === 'table' ? (
                <>
                  <div className="report-table-editor__tools">
                    <button
                      type="button"
                      onClick={() => addTableRow(blockIndex)}
                      disabled={isSubmitting || block.rows.length >= 20}
                    >
                      행 추가
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTableRow(blockIndex)}
                      disabled={isSubmitting || block.rows.length <= 1}
                    >
                      마지막 행 삭제
                    </button>
                    <button
                      type="button"
                      onClick={() => addTableColumn(blockIndex)}
                      disabled={
                        isSubmitting || (block.rows[0]?.length ?? 0) >= 10
                      }
                    >
                      열 추가
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTableColumn(blockIndex)}
                      disabled={
                        isSubmitting || (block.rows[0]?.length ?? 0) <= 1
                      }
                    >
                      마지막 열 삭제
                    </button>
                  </div>
                  <div className="report-table-editor__scroll">
                    <table className="report-table-editor">
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={`${block.id}-row-${rowIndex}`}>
                            {row.map((cell, columnIndex) => (
                              <td key={`${block.id}-${rowIndex}-${columnIndex}`}>
                                <input
                                  value={cell}
                                  onChange={(event) =>
                                    updateTableCell(
                                      blockIndex,
                                      rowIndex,
                                      columnIndex,
                                      event.target.value,
                                    )
                                  }
                                  maxLength={500}
                                  placeholder={
                                    rowIndex === 0
                                      ? `항목 ${columnIndex + 1}`
                                      : '내용'
                                  }
                                  aria-label={`표 ${blockIndex + 1}, ${rowIndex + 1}행 ${columnIndex + 1}열`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <small className="report-table-editor__hint">
                    첫 번째 행은 상세 화면에서 표 머리글로 표시됩니다.
                  </small>
                </>
              ) : (
                <textarea
                  value={block.text}
                  onChange={(event) =>
                    updateBlock(blockIndex, (current) => ({
                      ...current,
                      text: event.target.value,
                    }))
                  }
                  placeholder="내용을 입력하세요"
                  rows={7}
                />
              )}
            </section>
          ))}
        </div>
      </section>

      <div className="board-form__actions">
        <button
          type="submit"
          className="board-button board-button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : isEdit ? '수정 완료' : '보고서 등록'}
        </button>
      </div>
    </form>
  )
}

export default ReportForm
