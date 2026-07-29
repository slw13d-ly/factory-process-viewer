import './Pagination.css'

function getPageNumbers(currentPage, totalPages) {
  const maxVisible = 7
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(currentPage - half, 0)
  let end = start + maxVisible

  if (end > totalPages) {
    end = totalPages
    start = end - maxVisible
  }

  return Array.from({ length: end - start }, (_, index) => start + index)
}

function Pagination({ pageInfo, onPageChange }) {
  if (pageInfo.totalPages <= 1) return null

  const pages = getPageNumbers(pageInfo.page, pageInfo.totalPages)

  return (
    <nav className="pagination" aria-label="게시판 페이지 이동">
      <button
        type="button"
        onClick={() => onPageChange(pageInfo.page - 1)}
        disabled={pageInfo.first}
      >
        이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={page === pageInfo.page ? 'pagination__active' : ''}
          onClick={() => onPageChange(page)}
          aria-current={page === pageInfo.page ? 'page' : undefined}
        >
          {page + 1}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(pageInfo.page + 1)}
        disabled={pageInfo.last}
      >
        다음
      </button>
    </nav>
  )
}

export default Pagination
