import { useEffect, useState } from 'react'
import { createInitialFactoryData, getNextFactoryData } from '../mock/mockFactoryData'

// 목업 데이터를 몇 ms마다 갱신할지.
const UPDATE_INTERVAL_MS = 1500

// ───────────────────────────────────────────────────────────────────────
// useFactoryData
//
// 이 훅이 하는 일은 딱 하나: "공장 데이터를 어디서/어떻게 가져오는지"를
// 이 파일 안에 완전히 가둬두는 것입니다.
//
// App.jsx나 KpiCards, InspectionHistoryTable 같은 화면 컴포넌트들은
//   const { line, metrics, records } = useFactoryData()
// 라고만 쓰면 되고, 이 데이터가 setInterval로 흉내낸 목업인지 실제 서버에서
// WebSocket으로 오는 데이터인지 전혀 몰라도 됩니다.
//
// 나중에 백엔드가 준비되면 아래 useEffect 안의 내용물만
//   setInterval(...) / clearInterval(...)
// 에서
//   new WebSocket(url) + socket.onmessage / socket.close()
// 로 바꾸면 끝입니다. 반환값의 모양( { line, metrics, records } )만 그대로
// 유지하면 다른 파일은 한 줄도 건드릴 필요가 없습니다.
// ───────────────────────────────────────────────────────────────────────
export function useFactoryData() {
  // useState: 이 훅이 "기억"하는 현재 데이터 한 덩어리.
  // line/metrics/records를 따로따로 관리하지 않고 하나로 묶어서 관리하는 이유는
  // 반환값의 모양을 요구된 형태 그대로 유지하기 위해서입니다.
  //
  // useState(() => ...)처럼 함수를 넘기면(지연 초기화) 이 초기값 계산은
  // 컴포넌트가 맨 처음 렌더링될 때 딱 한 번만 실행됩니다.
  const [data, setData] = useState(() => createInitialFactoryData())

  // useEffect: "화면이 그려진 뒤에 한 번 시작하고, 화면에서 사라질 때 정리"가
  // 필요한 작업(타이머 시작/해제, 소켓 연결/해제 등)을 넣는 자리입니다.
  // 두 번째 인자로 넘긴 빈 배열 []은 "이 효과는 처음 렌더링될 때 딱 한 번만
  // 실행하라"는 뜻입니다.
  useEffect(() => {
    // ── 지금은 목업: 1.5초마다 다음 데이터를 계산해서 반영합니다.
    // ── 나중에 WebSocket으로 바꿀 때는 이 블록만 아래처럼 교체하면 됩니다
    //    (setData에 넘기는 데이터 모양은 그대로 유지):
    //
    //      const socket = new WebSocket(SOME_URL)
    //      socket.onmessage = (event) => setData(JSON.parse(event.data))
    //      return () => socket.close()
    //
    const intervalId = setInterval(() => {
      setData((previousData) => getNextFactoryData(previousData))
    }, UPDATE_INTERVAL_MS)

    // 정리(cleanup) 함수: 컴포넌트가 화면에서 사라지거나 이 효과가 다시 실행되기
    // 직전에 호출됩니다. 빼먹으면 타이머가 계속 쌓여 데이터가 점점 더 빨리
    // 갱신되는 버그가 생깁니다 (WebSocket이었다면 연결이 계속 쌓이는 셈).
    return () => clearInterval(intervalId)
  }, [])

  // 이 훅을 쓰는 쪽은 이 세 값만 받습니다 — 목업인지 실제 서버인지는 이
  // 반환값만 봐서는 절대 알 수 없습니다. 그게 이 훅이 존재하는 이유입니다.
  return data
}
