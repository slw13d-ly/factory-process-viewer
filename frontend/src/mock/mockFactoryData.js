// 이 파일은 "가짜 공장 데이터를 어떻게 만들지"만 알고 있는 순수 함수 모음입니다.
// React(useState/useEffect)를 전혀 모르는 일반 자바스크립트 함수라서
// 나중에 백엔드를 WebSocket으로 연결하면 이 파일은 더 이상 필요 없어집니다.
// 그래서 이 로직을 hooks/ 가 아니라 mock/ 폴더에 따로 분리해뒀습니다 —
// WebSocket으로 바꿀 때 이 폴더만 통째로 지우면 됩니다.

const DEFECT_REASONS = [
  '치수 불량',
  '외관 불량',
  '조립 불량',
  '색상 불량',
  '기능 불량',
  '표면 스크래치',
  '부품 누락',
]

// 양품은 어느 정상 공정 단계에서 걸렸는지가 다양하고, 불량은 검사 후
// 항상 같은 곳(불량배출)으로 빠지므로 둘을 분리해서 관리합니다.
const GOOD_STAGES = ['적재완료', '가공완료', '조립완료', '검사완료', '포장완료']
const DEFECT_STAGE = '불량배출'

// 검사 1건이 불량으로 판정될 확률(기본 6%).
// 나중에 "불량률 8% 경고"를 테스트할 때 이 값을 0.2 정도로 잠깐 올리면
// 불량률이 금방 8%를 넘는 걸 눈으로 확인할 수 있습니다.
const DEFECT_PROBABILITY = 0.06

// records 배열이 끝없이 늘어나면 브라우저 메모리를 계속 잡아먹으므로,
// 화면에 보여줄 최근 이력만 이 개수까지만 유지합니다.
// (total/good/defect 누적 숫자는 이 캡과 무관하게 계속 늘어납니다.)
const MAX_RECORDS = 200

const INITIAL_TOTAL = 1240
const INITIAL_DEFECT = 84

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

// value를 ±delta 범위 안에서 무작위로 흔들고 [min, max] 범위를 벗어나지 않게 고정합니다.
// (컨베이어 속도, UPH처럼 "조금씩 오르내리는" 값을 흉내낼 때 사용)
function nudge(value, delta, min, max) {
  const next = value + (Math.random() * 2 - 1) * delta
  return Math.min(max, Math.max(min, next))
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function formatDateForId(date) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`
}

function formatTime(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

// 불량률(%)은 항상 defect/total로부터 다시 계산해서 만듭니다.
// 이 값을 따로 무작위로 굴리면 KPI 카드 숫자와 실제 양품/불량 개수가 서로 어긋나 버립니다.
function calcDefectRate(total, defect) {
  if (total === 0) return 0
  return Math.round((defect / total) * 1000) / 10
}

function createRecord({ date, sequence, isDefect }) {
  return {
    id: `P-${formatDateForId(date)}-${String(sequence).padStart(4, '0')}`,
    time: formatTime(date),
    status: isDefect ? '불량' : '양품',
    reason: isDefect ? pickRandom(DEFECT_REASONS) : null,
    stage: isDefect ? DEFECT_STAGE : pickRandom(GOOD_STAGES),
  }
}

// count건의 초기 이력을 만듭니다. 화면이 처음부터 텅 비어 보이지 않도록
// 앱이 켜질 때 미리 몇 건 채워두는 용도입니다 (최근 몇 건이 몇 초 간격으로
// 있었던 것처럼 시간을 살짝 과거로 흩어놓습니다).
function createSeedRecords(count, seedTotal) {
  const records = []
  for (let i = 0; i < count; i++) {
    records.push(
      createRecord({
        date: new Date(Date.now() - i * 45_000),
        sequence: seedTotal - i,
        isDefect: Math.random() < DEFECT_PROBABILITY,
      }),
    )
  }
  return records
}

// 앱이 처음 렌더링될 때 사용하는 초기 데이터.
// (useFactoryData 훅이 useState의 초기값으로 이 함수를 딱 한 번 호출합니다.)
export function createInitialFactoryData() {
  const good = INITIAL_TOTAL - INITIAL_DEFECT

  return {
    line: {
      status: 'running',
      conveyorSpeed: 50,
    },
    metrics: {
      total: INITIAL_TOTAL,
      good,
      defect: INITIAL_DEFECT,
      defectRate: calcDefectRate(INITIAL_TOTAL, INITIAL_DEFECT),
      uph: 320,
    },
    records: createSeedRecords(8, INITIAL_TOTAL),
  }
}

// 1.5초마다 한 번씩 호출되는 "한 틱"의 데이터 변화.
// previous(이전 상태)를 받아서 next(다음 상태)를 반환하기만 하는 순수 함수라
// React 없이도 콘솔에서 바로 테스트해볼 수 있습니다.
export function getNextFactoryData(previous) {
  const now = new Date()
  const isDefect = Math.random() < DEFECT_PROBABILITY

  const total = previous.metrics.total + 1
  const good = previous.metrics.good + (isDefect ? 0 : 1)
  const defect = previous.metrics.defect + (isDefect ? 1 : 0)

  const newRecord = createRecord({ date: now, sequence: total, isDefect })

  return {
    line: {
      status: previous.line.status,
      conveyorSpeed: Math.round(nudge(previous.line.conveyorSpeed, 3, 40, 60)),
    },
    metrics: {
      total,
      good,
      defect,
      defectRate: calcDefectRate(total, defect),
      uph: Math.round(nudge(previous.metrics.uph, 8, 280, 360)),
    },
    // 새 기록을 맨 앞에 추가(최신순 유지)하고, MAX_RECORDS를 넘는 오래된 기록은 잘라냅니다.
    records: [newRecord, ...previous.records].slice(0, MAX_RECORDS),
  }
}
