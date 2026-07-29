// 이 파일은 mockFactoryData.js와 같은 자리(mock/)에 두는 "가짜 게시글 데이터"
// 순수 함수 모음입니다. React를 전혀 모르고, 나중에 실제 게시판 API가
// 생기면 이 파일 전체를 지우고 usePosts.js 안쪽만 fetch로 바꾸면 됩니다.
//
// mockFactoryData.js와 달리 getNext*(틱) 함수가 없습니다 — 공장 센서 데이터는
// "지금 이 순간에도 계속 바뀐다"는 걸 보여줘야 하지만, 게시글 목록은 그렇게
// 실시간으로 흔들릴 이유가 없어서 처음 한 번 만든 시드 목록을 그대로 씁니다.

const AUTHORS = ['김현장', '이설비', '박품질', '관리자']

const SEED_POSTS = [
  { title: '[공지] 7월 정기 설비 점검 안내', pinned: true },
  { title: '[공지] 안전 수칙 재교육 일정', pinned: true },
  { title: '2라인 컨베이어 소음 관련 문의', pinned: false },
  { title: '불량률 급증 원인 공유드립니다', pinned: false },
  { title: '금주 생산 목표 달성률 공유', pinned: false },
  { title: '검사 센서 교체 완료 보고', pinned: false },
  { title: '야간조 인수인계 사항', pinned: false },
]

function pad2(n) {
  return String(n).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`
}

// count건의 시드 게시글을 만듭니다. 화면이 처음부터 텅 비어 보이지 않도록
// 앱이 켜질 때 미리 몇 건 채워두는 용도입니다 (최근 며칠에 걸쳐 올라온 것처럼
// 날짜를 살짝 과거로 흩어놓습니다).
export function createInitialPosts() {
  return SEED_POSTS.map((seed, index) => ({
    id: `POST-${String(SEED_POSTS.length - index).padStart(4, '0')}`,
    title: seed.title,
    author: AUTHORS[index % AUTHORS.length],
    createdAt: formatDate(new Date(Date.now() - index * 86_400_000)),
    pinned: seed.pinned,
  }))
}
