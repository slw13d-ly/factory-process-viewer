import { useEffect, useRef, useState } from 'react'
import './Mimic.css'

// ───────────────────────────────────────────────────────────────────────
// 이 컴포넌트는 useFactoryData를 직접 호출하지 않습니다. App.jsx가 내려주는
// records 배열만 props로 받아서, "새 기록이 하나 생겼다"는 신호로 삼아
// 애니메이션 상자를 하나 트랙에 올릴 뿐입니다.
//
// 즉 여기서 쓰는 setInterval(아래 FRAME_MS)은 데이터를 가져오는 타이머가
// 아니라, 이미 받은 데이터를 화면에서 "부드럽게 움직여 보이게" 만드는
// 연출용 타이머입니다. useFactoryData의 1.5초 주기와는 완전히 별개라서,
// 나중에 진짜 WebSocket으로 바뀌어도(=records가 오는 방식이 바뀌어도) 이
// 파일은 한 글자도 바꿀 필요가 없습니다.
// ───────────────────────────────────────────────────────────────────────

// ── SVG 좌표계 (viewBox="0 0 720 210" 기준) ──────────────────────────────
// 트랙 위의 주요 지점 x좌표들입니다. 이 5개 숫자만 바꾸면 트랙 모양 전체가
// 같이 움직입니다 (아래 trackPosition이 전부 이 값들로 계산되기 때문).
const INPUT_X = 70 // 투입 지점
const SENSOR_X = 300 // 검사 센서 위치 (이 x를 지날 때 양품/불량 색이 드러남)
const BRANCH_X = 470 // 분기점 — 여기서부터 양품/불량 경로가 갈라짐
const DOCK_X = 650 // 양품이 도착하는 적재 위치
const BELT_Y = 95 // 벨트 위 제품의 y좌표
const CHUTE_Y = 175 // 불량이 떨어지는 배출 슈트 아래쪽 y좌표

// 제품의 진행률 p(0=투입, 1=도착) 중에서 "투입 → 분기" 구간이 차지하는 비율.
// 나머지 (1 - BELT_PORTION)이 "분기 → 도착(적재 또는 배출)" 구간입니다.
const BELT_PORTION = 0.62

// 센서(SENSOR_X)는 항상 "투입 → 분기" 구간 위에 있으므로, 그 구간 안에서
// SENSOR_X가 차지하는 위치 비율(0~1)에 BELT_PORTION을 곱하면 "센서를 지나는
// 순간의 진행률"을 역산할 수 있습니다. 이렇게 좌표에서 계산해두면 SENSOR_X를
// 나중에 옮기더라도 색이 드러나는 시점/센서 램프가 항상 같이 맞아떨어집니다.
const SENSOR_P = ((SENSOR_X - INPUT_X) / (BRANCH_X - INPUT_X)) * BELT_PORTION

// 상자 하나가 트랙을 통과하는 데 걸리는 시간(연출용 값 — 실제 검사 주기와 무관)
const FLIGHT_DURATION_MS = 2400
// 애니메이션을 몇 ms마다 한 프레임씩 갱신할지
const FRAME_MS = 50

// 진행률 p(0~1)와 불량 여부를 받아서 실제 SVG (x, y) 좌표를 계산합니다.
function trackPosition(p, isDefect) {
  if (p <= BELT_PORTION) {
    // 구간 1: 투입 → 분기.
    // segmentP는 "이 구간 안에서만" 다시 0~1로 정규화한 진행률입니다.
    const segmentP = p / BELT_PORTION
    return { x: INPUT_X + (BRANCH_X - INPUT_X) * segmentP, y: BELT_Y }
  }

  // 구간 2: 분기 → 도착. 여기서도 이 구간만의 진행률로 다시 정규화합니다.
  const segmentP = (p - BELT_PORTION) / (1 - BELT_PORTION)
  if (isDefect) {
    // 불량: x는 분기점 그대로, y만 아래(배출 슈트)로 이동
    return { x: BRANCH_X, y: BELT_Y + (CHUTE_Y - BELT_Y) * segmentP }
  }
  // 양품: y는 벨트 높이 그대로, x만 오른쪽(적재)으로 이동
  return { x: BRANCH_X + (DOCK_X - BRANCH_X) * segmentP, y: BELT_Y }
}

function Mimic({ records }) {
  // 지금 트랙 위를 날아가고 있는 상자들의 목록.
  const [flying, setFlying] = useState([])
  // 마지막으로 트랙에 올린 record.id를 기억해서, records가 바뀔 때마다
  // "정말 새 기록이 생겼는지"를 판단하는 데 씁니다.
  const lastSeenIdRef = useRef(null)

  // records[0](가장 최신 기록)이 바뀔 때 = useFactoryData에 새 틱이 반영될 때
  // 상자를 하나 새로 만들어 트랙에 올립니다.
  useEffect(() => {
    const newest = records[0]
    if (!newest || newest.id === lastSeenIdRef.current) return
    lastSeenIdRef.current = newest.id

    setFlying((prev) => [...prev, { key: newest.id, isDefect: newest.status === '불량', p: 0 }])
  }, [records])

  // 순수 연출용 타이머: FRAME_MS마다 모든 상자의 진행률을 조금씩 올리고,
  // 도착(p>=1)한 상자는 목록에서 지웁니다.
  useEffect(() => {
    const id = setInterval(() => {
      setFlying((prev) =>
        prev
          .map((box) => ({ ...box, p: box.p + FRAME_MS / FLIGHT_DURATION_MS }))
          .filter((box) => box.p < 1),
      )
    }, FRAME_MS)
    return () => clearInterval(id)
  }, [])

  // 센서 램프: 지금 막 SENSOR_P 근처를 지나는 상자가 있으면 켜짐
  const sensorOn = flying.some((box) => Math.abs(box.p - SENSOR_P) < 0.03)

  return (
    <svg viewBox="0 0 720 210" className="mimic" role="img" aria-label="공정 흐름도">
      {/* 컨베이어 벨트 */}
      <rect className="mimic__belt" x="60" y="104" width="600" height="14" rx="3" />

      {/* 불량 배출 슈트 */}
      <rect className="mimic__chute-pipe" x="463" y="118" width="14" height="60" />
      <rect className="mimic__chute-box" x="430" y="176" width="90" height="26" rx="4" />
      <text className="mimic__chute-label" x="475" y="193" textAnchor="middle">
        불량 배출
      </text>

      {/* 양품 적재부 */}
      <rect className="mimic__dock-box" x="628" y="80" width="60" height="30" rx="4" />
      <text className="mimic__dock-label" x="658" y="99" textAnchor="middle">
        적재
      </text>

      {/* 스테이션 라벨 */}
      <text className="mimic__station-label" x={INPUT_X} y="145">
        투입
      </text>
      <text className="mimic__station-label" x={SENSOR_X} y="145" textAnchor="middle">
        검사
      </text>
      <text className="mimic__station-label" x={BRANCH_X} y="145" textAnchor="middle">
        분기
      </text>

      {/* 검사 센서 램프 */}
      <line
        className="mimic__sensor-wire"
        x1={SENSOR_X}
        y1="79"
        x2={SENSOR_X}
        y2="102"
      />
      <circle
        className={`mimic__sensor-lamp${sensorOn ? ' mimic__sensor-lamp--on' : ''}`}
        cx={SENSOR_X}
        cy="70"
        r="9"
      />

      {/* 트랙 위를 지나는 상자들 */}
      {flying.map((box) => {
        const { x, y } = trackPosition(box.p, box.isDefect)
        // SENSOR_P를 지나기 전까지는 아직 판정 전이라 회색, 지난 뒤에야
        // 양품(초록)/불량(빨강) 색이 "드러납니다".
        const revealed = box.p >= SENSOR_P
        let className = 'mimic__box'
        if (revealed) className += box.isDefect ? ' mimic__box--defect' : ' mimic__box--good'
        return <rect key={box.key} className={className} x={x - 8} y={y - 8} width="16" height="16" rx="3" />
      })}
    </svg>
  )
}

export default Mimic
