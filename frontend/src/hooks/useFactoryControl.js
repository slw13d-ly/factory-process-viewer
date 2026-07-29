import { useCallback, useEffect, useRef, useState } from 'react'
import { factoryControlApi } from '../api/factoryControlApi'

// ───────────────────────────────────────────────────────────────────────
// useFactoryControl
//
// 공장 시작/멈춤/다시시작 "의도"를 백엔드로 보내고, 백엔드가 Modbus write에
// 성공한 뒤 돌려준 status로만 화면을 확정하는 훅. useFactoryData(KPI/이력 목업
// 스트림)와는 관심사가 달라 일부러 별도 훅으로 분리했다.
// ───────────────────────────────────────────────────────────────────────
export function useFactoryControl() {
  const [status, setStatus] = useState('stopped')
  const [pending, setPending] = useState(false)
  const [isMockMode, setIsMockMode] = useState(false)
  const activeRef = useRef(true)

  useEffect(() => {
    activeRef.current = true

    factoryControlApi
      .getStatus()
      .then((response) => {
        if (!activeRef.current) return
        setStatus(response.status)
        setIsMockMode(false)
      })
      .catch(() => {
        // GET /api/factory/status가 아직 없거나(백엔드 미구현) 실패하면
        // 명세대로 'stopped'에서 시작하고, 실제 상태가 아니라는 걸 화면에 드러낸다.
        if (!activeRef.current) return
        setStatus('stopped')
        setIsMockMode(true)
      })

    return () => {
      activeRef.current = false
    }
  }, [])

  // start/stop/restart 세 액션 모두 "요청 보내고 → 서버가 확정한 status로만 반영"하는
  // 뼈대가 같아서 한 곳에 모아둔다. mockStatus는 서버가 없을 때만 쓰는 대체값이며,
  // 실제 응답이 오면 그 값이 무엇이든 항상 우선한다.
  const runAction = useCallback((apiCall, mockStatus) => {
    setPending(true)
    return apiCall()
      .then((response) => {
        if (!activeRef.current) return
        // 낙관적 업데이트 금지: 버튼을 눌렀다고 바로 상태를 바꾸지 않고,
        // 서버가 실제로 돌려준 status가 도착했을 때만 반영한다.
        setStatus(response.status)
        setIsMockMode(false)
      })
      .catch(() => {
        if (!activeRef.current) return
        // 백엔드 미연결이어도 데모가 계속 굴러가도록 로컬로만 상태를 토글하되,
        // isMockMode 플래그로 "이건 실제 설비 상태가 아니다"를 화면에서 구분되게 한다.
        setStatus(mockStatus)
        setIsMockMode(true)
      })
      .finally(() => {
        if (!activeRef.current) return
        setPending(false)
      })
  }, [])

  const start = useCallback(
    () => runAction(factoryControlApi.start, 'running'),
    [runAction],
  )
  const stop = useCallback(
    () => runAction(factoryControlApi.stop, 'stopped'),
    [runAction],
  )
  // 다시 시작 = 정지 후 재가동이므로, 목 모드 폴백에서도 최종 상태는 running으로 둔다.
  const restart = useCallback(
    () => runAction(factoryControlApi.restart, 'running'),
    [runAction],
  )

  return { status, pending, isMockMode, start, stop, restart }
}
