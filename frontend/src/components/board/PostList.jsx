import './PostList.css'

// posts: usePosts()가 내려주는 배열을 그대로 받습니다. 미리보기 패널
// (BoardPreviewPanel)에서는 앞 몇 개만 slice해서 넘기고, 게시판 전체
// 페이지(BoardPage)에서는 전체를 그대로 넘겨서 같은 마크업/스타일을
// 재사용합니다.
function PostList({ posts }) {
  if (posts.length === 0) {
    return <p className="post-list__empty">게시글이 없습니다.</p>
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list__item">
          <span className="post-list__title">
            {post.pinned && <span className="post-list__pin">공지</span>}
            {post.title}
          </span>
          <span className="post-list__meta">
            {post.author} · {post.createdAt}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default PostList
