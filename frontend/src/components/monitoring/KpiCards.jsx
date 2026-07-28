import './KpiCards.css'

// 카드 5개에 표시할 내용을 배열로 정의해둡니다.
// 이렇게 데이터로 정의해두면, 카드를 추가/순서 변경할 때 아래 JSX(return문)를
// 건드리지 않고 이 배열만 고치면 됩니다.
function buildCards(metrics) {
  return [
    { key: 'total', label: '총생산', value: metrics.total.toLocaleString('ko-KR'), unit: '개' },
    { key: 'good', label: '양품', value: metrics.good.toLocaleString('ko-KR'), unit: '개' },
    { key: 'defect', label: '불량', value: metrics.defect.toLocaleString('ko-KR'), unit: '개' },
    { key: 'defectRate', label: '불량률', value: metrics.defectRate.toFixed(1), unit: '%' },
    { key: 'uph', label: '시간당 처리량', value: metrics.uph.toLocaleString('ko-KR'), unit: 'UPH' },
  ]
}

// metrics: useFactoryData가 준 { total, good, defect, defectRate, uph }
// isDefectRateHigh: 불량률이 기준치(8%)를 넘었는지 여부 (App.jsx에서 계산해서 내려줌)
//   → 이 컴포넌트는 "8%"라는 숫자 자체는 모르고, true/false만 받아서 스타일만 바꿉니다.
//     기준값을 바꾸고 싶으면 App.jsx 한 곳만 고치면 됩니다.
function KpiCards({ metrics, isDefectRateHigh }) {
  const cards = buildCards(metrics)

  return (
    <div className="kpi-cards">
      {cards.map((card) => {
        const isDanger = card.key === 'defectRate' && isDefectRateHigh
        return (
          <div key={card.key} className={`kpi-card${isDanger ? ' kpi-card--danger' : ''}`}>
            <span className="kpi-card__label">
              {isDanger && (
                <span className="kpi-card__icon" aria-hidden="true">
                  ⚠
                </span>
              )}
              {card.label}
            </span>
            <span className="kpi-card__value">
              {card.value}
              <span className="kpi-card__unit">{card.unit}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default KpiCards
