import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostList from './PostList'
import './BoardPreviewPanel.css'

const CATEGORY_CONFIG = {
  board: {
    label: '게시글',
    path: '/board',
    writeLabel: '게시글 작성',
    emptyLabel: '게시글이 없습니다.',
  },
  report: {
    label: '보고서',
    path: '/report-board',
    writeLabel: '보고서 작성',
    emptyLabel: '보고서가 없습니다.',
  },
}

function BoardPreviewPanel({ board, report }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('board')
  const config = CATEGORY_CONFIG[activeCategory]
  const activeData = activeCategory === 'board' ? board : report

  const openActiveBoardFromBackground = (event) => {
    if (event.target.closest('a, button, .post-list')) return
    navigate(config.path)
  }

  const handlePanelKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    navigate(config.path)
  }

  return (
    <section
      className="panel board-preview-panel"
      onClick={openActiveBoardFromBackground}
      onKeyDown={handlePanelKeyDown}
      tabIndex={0}
      aria-label={`${config.label} 전체 보기`}
    >
      <div className="board-preview-panel__heading">
        <div className="board-preview-panel__title-group">
          <h2 className="panel__title">게시판</h2>
          <div className="board-preview-panel__tabs" role="tablist" aria-label="게시판 종류">
            {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeCategory === key}
                className={`board-preview-panel__tab ${
                  activeCategory === key ? 'board-preview-panel__tab--active' : ''
                }`}
                onClick={() => setActiveCategory(key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="board-preview-panel__actions">
          <Link
            to={`${config.path}?compose=1`}
            className="board-preview-panel__write"
          >
            {config.writeLabel}
          </Link>
        </div>
      </div>

      {activeData.isLoading ? (
        <p className="board-preview-panel__status">불러오는 중...</p>
      ) : activeData.error ? (
        <p className="board-preview-panel__error">{activeData.error}</p>
      ) : (
        <PostList
          posts={activeData.items}
          linkToPost
          basePath={config.path}
          emptyLabel={config.emptyLabel}
        />
      )}
    </section>
  )
}

export default BoardPreviewPanel
