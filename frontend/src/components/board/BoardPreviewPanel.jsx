import { Link } from 'react-router-dom'
import PostList from './PostList'
import './BoardPreviewPanel.css'

// 미리보기에 보여줄 최근 게시글 개수.
const PREVIEW_COUNT = 5

// posts: usePosts()가 내려주는 배열을 DashboardPage로부터 props로 받습니다.
// Mimic/InspectionHistoryTable과 마찬가지로 이 컴포넌트는 usePosts()를
// 직접 호출하지 않습니다.
//
// 패널 전체를 <Link>로 감싸서, 클릭하면 게시판 전체 화면(/board)으로
// 이동합니다.
function BoardPreviewPanel({ posts }) {
  return (
    <Link to="/board" className="board-preview-panel-link">
      <section className="panel board-preview-panel">
        <h2 className="panel__title">게시판</h2>
        <PostList posts={posts.slice(0, PREVIEW_COUNT)} />
      </section>
    </Link>
  )
}

export default BoardPreviewPanel
