import './BoardNavigation.css'

function formatReportDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${year}. ${month}. ${day}.`
}

function NavigationRow({ label, item, onSelect, emptyLabel, isReport }) {
  return (
    <div className="board-navigation__row">
      <span className="board-navigation__label">{label}</span>
      {item ? (
        <button
          type="button"
          className="board-navigation__link"
          onClick={() => onSelect(item)}
        >
          {item.notice && <span className="board-navigation__notice">공지</span>}
          {isReport && item.reportDate && (
            <span className="board-navigation__date">
              {formatReportDate(item.reportDate)}
            </span>
          )}
          <span>{item.title}</span>
        </button>
      ) : (
        <span className="board-navigation__empty">{emptyLabel}</span>
      )}
    </div>
  )
}

function BoardNavigation({
  navigation,
  isLoading,
  error,
  onSelect,
  resourceName = '게시글',
}) {
  const isReport = resourceName === '보고서'
  const previousLabel = isReport ? '이전 보고서' : '이전글'
  const nextLabel = isReport ? '다음 보고서' : '다음글'
  const emptyLabel = isReport ? '보고서가 없습니다.' : '게시글이 없습니다.'
  const loadingLabel = isReport
    ? '이전 보고서와 다음 보고서를 불러오는 중입니다.'
    : '이전글과 다음글을 불러오는 중입니다.'

  if (isLoading) {
    return (
      <section className="panel board-navigation">
        <p className="board-navigation__status">{loadingLabel}</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="panel board-navigation">
        <p className="board-navigation__error" role="alert">
          {error}
        </p>
      </section>
    )
  }

  return (
    <section
      className="panel board-navigation"
      aria-label={`${previousLabel} 및 ${nextLabel}`}
    >
      <NavigationRow
        label={previousLabel}
        item={navigation.previous}
        onSelect={onSelect}
        emptyLabel={emptyLabel}
        isReport={isReport}
      />
      <NavigationRow
        label={nextLabel}
        item={navigation.next}
        onSelect={onSelect}
        emptyLabel={emptyLabel}
        isReport={isReport}
      />
    </section>
  )
}

export default BoardNavigation
