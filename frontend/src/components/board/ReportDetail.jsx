import { parseReportContent } from '../../utils/reportContent.js'
import './BoardDetail.css'
import './ReportDetail.css'

function formatDateTime(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatReportDate(value) {
  if (!value) return '-'
  const [year, month, day] = value.split('-')
  return `${year}. ${month}. ${day}.`
}

function ReportContent({ content }) {
  const blocks = parseReportContent(content)

  return (
    <div className="report-detail__blocks">
      {blocks.map((block) =>
        block.type === 'table' ? (
          <div className="report-detail__table-scroll" key={block.id}>
            <table className="report-detail__table">
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${block.id}-row-${rowIndex}`}>
                    {row.map((cell, columnIndex) => {
                      const Cell = rowIndex === 0 ? 'th' : 'td'
                      return (
                        <Cell key={`${block.id}-${rowIndex}-${columnIndex}`}>
                          {cell || '\u00a0'}
                        </Cell>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="report-detail__paragraph" key={block.id}>
            {block.text || '\u00a0'}
          </p>
        ),
      )}
    </div>
  )
}

function ReportDetail({ post, onEdit, onDelete, isDeleting }) {
  return (
    <article className="board-detail report-detail">
      <header className="board-detail__header">
        <div className="report-detail__date">보고 기준일 {formatReportDate(post.reportDate)}</div>
        <div className="board-detail__title-row">
          <h2>{post.title}</h2>
        </div>
        <dl className="board-detail__meta">
          <div>
            <dt>작성자</dt>
            <dd>{post.authorDisplayName}</dd>
          </div>
          <div>
            <dt>작성일</dt>
            <dd>{formatDateTime(post.createdAt)}</dd>
          </div>
          {post.updatedAt !== post.createdAt && (
            <div>
              <dt>수정일</dt>
              <dd>{formatDateTime(post.updatedAt)}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="board-detail__content report-detail__content">
        <ReportContent content={post.content} />
      </div>

      {post.ownedByMe && (
        <footer className="board-detail__actions">
          <button
            type="button"
            className="board-button board-button--secondary"
            onClick={onEdit}
            disabled={isDeleting}
          >
            수정
          </button>
          <button
            type="button"
            className="board-button board-button--danger"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </footer>
      )}
    </article>
  )
}

export default ReportDetail
