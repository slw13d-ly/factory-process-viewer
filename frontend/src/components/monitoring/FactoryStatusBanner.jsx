import './FactoryStatusBanner.css'

// FactoryControls(버튼)와 분리한 이유: 버튼은 "공정 흐름" 제목 옆에, 상태는 제목 아래에
// 있어야 해서 화면 위치가 서로 다르다 — 같은 useFactoryControl 상태를 쓰는 두 컴포넌트로
// 나눠 각자 원하는 자리에 배치할 수 있게 했다.
function FactoryStatusBanner({ status, isMockMode }) {
  return (
    <div className="factory-status">
      <span className="factory-status__line">
        현재 상태: <strong>{status === 'running' ? '가동 중' : '정지됨'}</strong>
      </span>

      {isMockMode && (
        // 실제 설비 제어라 "표시되는 상태 = 실제 설비 상태"라는 착각이 위험하다.
        // 그래서 목 모드일 땐 눈에 띄는 인라인 배너로 구분해둔다.
        <p className="factory-status__mock-banner" role="status">
          백엔드 미연결 (목 모드) — 표시되는 상태는 실제 설비 상태가 아닙니다.
        </p>
      )}
    </div>
  )
}

export default FactoryStatusBanner
