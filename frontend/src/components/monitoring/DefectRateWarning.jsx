import './DefectRateWarning.css'

// isDefectRateHigh: App.jsx가 "불량률 > 8%"를 계산해서 내려주는 boolean.
// 이 컴포넌트는 기준값(8%)이 몇 %인지 몰라도 되고, 그냥 켜졌는지/꺼졌는지만 압니다.
//
// 조건이 false면 아예 아무것도 렌더링하지 않습니다 — React 컴포넌트가 null을
// 반환하면 화면에는 그냥 아무 것도 나타나지 않습니다 (빈 배너를 숨기는 게 아니라
// 처음부터 DOM에 만들어지지 않는 것).
function DefectRateWarning({ isDefectRateHigh, defectRate }) {
  if (!isDefectRateHigh) return null

  return (
    <div className="defect-warning" role="alert">
      <span className="defect-warning__icon" aria-hidden="true">
        ⚠
      </span>
      <span>
        불량률이 <strong>{defectRate.toFixed(1)}%</strong>로 기준치(8%)를 초과했습니다. 라인 점검이
        필요합니다.
      </span>
    </div>
  )
}

export default DefectRateWarning
