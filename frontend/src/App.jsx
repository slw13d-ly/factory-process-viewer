import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";

// App은 라우팅 설정만 담당합니다. 실제 화면 내용은 각 page 컴포넌트 안에 있습니다.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/board" element={<BoardPage />} />
    </Routes>
  );
}

export default App;
