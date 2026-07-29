import { Link } from 'react-router-dom'

const CATEGORIES = [
  { key: 'board', label: '게시글', path: '/board' },
  { key: 'report', label: '보고서', path: '/report-board' },
]

function BoardCategoryTabs({ active }) {
  return (
    <nav className="board-category-tabs" aria-label="게시판 카테고리">
      {CATEGORIES.map((category) =>
        category.key === active ? (
          <span
            key={category.key}
            className="board-category-tabs__item board-category-tabs__item--active"
            aria-current="page"
          >
            {category.label}
          </span>
        ) : (
          <Link
            key={category.key}
            className="board-category-tabs__item"
            to={category.path}
          >
            {category.label}
          </Link>
        ),
      )}
    </nav>
  )
}

export default BoardCategoryTabs
