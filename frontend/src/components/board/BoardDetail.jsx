import './BoardDetail.css'

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function BoardDetail({ post, onEdit, onDelete, isDeleting }) {
  return (
    <article className="board-detail">
      <header className="board-detail__header">
        <div className="board-detail__title-row">
          {post.notice && <span className="board-detail__notice">공지</span>}
          <h2>{post.title}</h2>
        </div>
        <dl className="board-detail__meta">
          <div>
            <dt>작성자</dt>
            <dd>{post.authorDisplayName}</dd>
          </div>
          <div>
            <dt>작성일</dt>
            <dd>{formatDate(post.createdAt)}</dd>
          </div>
          {post.updatedAt !== post.createdAt && (
            <div>
              <dt>수정일</dt>
              <dd>{formatDate(post.updatedAt)}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="board-detail__content">{post.content}</div>

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

export default BoardDetail
