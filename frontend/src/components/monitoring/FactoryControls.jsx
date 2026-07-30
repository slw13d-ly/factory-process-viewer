import './FactoryControls.css'

// status/pending 조합에 따른 버튼 활성화 규칙을 한 곳에 모아 return문을 읽기 쉽게 유지한다.
function buildButtonStates({ status, pending }) {
  return {
    start: !pending && status === 'stopped',
    stop: !pending && status === 'running',
    // 다시 시작 = 리셋 후 재가동이라 현재 status와 무관하게 pending만 아니면 항상 활성.
    restart: !pending,
  }
}

// status: 'running' | 'stopped' (useFactoryControl이 서버 응답 또는 목 폴백으로 확정한 값)
// pending: 요청 진행 중 여부 — true면 세 버튼 모두 비활성 + 로딩 라벨로 바뀐다.
// 현재 상태 텍스트/목 모드 배너는 FactoryStatusBanner가 따로 그린다(화면 위치가 달라서 분리).
function FactoryControls({ status, pending, onStart, onStop, onRestart }) {
  const enabled = buildButtonStates({ status, pending })

  return (
    <div className="factory-controls">
      <button
        type="button"
        className="factory-control-button factory-control-button--start"
        disabled={!enabled.start}
        onClick={onStart}
      >
        {pending ? (
          '처리 중…'
        ) : (
          <>
            <span aria-hidden="true">▶</span> 시작
          </>
        )}
      </button>
      <button
        type="button"
        className="factory-control-button factory-control-button--stop"
        disabled={!enabled.stop}
        onClick={onStop}
      >
        {pending ? (
          '처리 중…'
        ) : (
          <>
            {/* "일시정지"가 아니라 "멈춤"으로 표기 — 이 버튼은 재개 가능한 pause가 아니라
                실제 설비를 정지시키는 동작이라 "재개"가 있는 것처럼 오해되지 않게 한다. */}
            <span aria-hidden="true">⏸</span> 멈춤
          </>
        )}
      </button>
      <button
        type="button"
        className="factory-control-button factory-control-button--restart"
        disabled={!enabled.restart}
        onClick={onRestart}
      >
        {pending ? (
          '처리 중…'
        ) : (
          <>
            <span aria-hidden="true">🔄</span> 다시시작
          </>
        )}
      </button>
    </div>
  )
}

export default FactoryControls
