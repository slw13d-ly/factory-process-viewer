import { Link } from 'react-router-dom'
import './PostList.css'

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatReportDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${year}. ${month}. ${day}.`
}

function PostContent({ post }) {
  return (
    <>
      <span className="post-list__title">
        {post.notice && <span className="post-list__pin">공지</span>}
        {post.reportDate && (
          <span className="post-list__report-date">
            {formatReportDate(post.reportDate)}
          </span>
        )}
        {post.title}
      </span>
      <span className="post-list__meta">
        {post.authorDisplayName} · {formatDate(post.createdAt)}
      </span>
    </>
  )
}

function PostList({
  posts,
  onSelect,
  selectedPostId,
  linkToPost = false,
  basePath = '/board',
  emptyLabel = '게시글이 없습니다.',
}) {
  if (posts.length === 0) {
    return <p className="post-list__empty">{emptyLabel}</p>
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li
          key={post.id}
          className={`post-list__item ${
            selectedPostId === post.id ? 'post-list__item--selected' : ''
          }`}
        >
          {linkToPost ? (
            <Link to={`${basePath}?post=${post.id}`} className="post-list__link">
              <PostContent post={post} />
            </Link>
          ) : (
            <button
              type="button"
              className="post-list__button"
              onClick={() => onSelect?.(post)}
            >
              <PostContent post={post} />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default PostList
