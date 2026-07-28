import { usePosts } from "../hooks/usePosts";
import PostList from "../components/board/PostList";
import "../App.css";

function BoardPage() {
  const { posts } = usePosts();

  return (
    <div className="app">
      <h1>게시판</h1>
      <section className="panel">
        <h2 className="panel__title">전체 게시글</h2>
        <PostList posts={posts} />
      </section>
    </div>
  );
}

export default BoardPage;
