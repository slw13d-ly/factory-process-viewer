import { useState } from 'react'
import { createInitialPosts } from '../mock/mockPosts'

// ───────────────────────────────────────────────────────────────────────
// useFactoryData.js와 같은 이유로 존재하는 훅입니다: 게시글을 "어디서/어떻게
// 가져오는지"를 이 파일 안에 가둬둬서, DashboardPage/BoardPage는
//   const { posts } = usePosts()
// 라고만 쓰면 되고 이게 목업인지 실제 /api/posts 응답인지 몰라도 됩니다.
//
// 나중에 백엔드가 준비되면 아래 useState 초기값을 useEffect + fetch로
// 바꾸면 됩니다. 반환값의 모양( { posts } )만 유지하면 다른 파일은
// 건드릴 필요가 없습니다.
// ───────────────────────────────────────────────────────────────────────
export function usePosts() {
  const [posts] = useState(() => createInitialPosts())
  return { posts }
}
