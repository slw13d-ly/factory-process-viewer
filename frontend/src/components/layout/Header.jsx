import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import AuthStatus from '../auth/AuthStatus'
import './Header.css'

// App.jsx가 <Routes> 위에 한 번만 렌더링하는 공통 헤더입니다.
// 이 컴포넌트 자체는 로그인/테마 상태를 모르고, 하위 컴포넌트들이 각자
// useAuth()/useTheme()을 호출합니다.
//
// 타이틀을 홈(대시보드)으로 가는 링크로 써서, 로그인/게시판 등 다른 화면에
// 있을 때도 클릭 한 번으로 홈으로 돌아올 수 있게 합니다.
function Header() {
  return (
    <header className="header">
      <Link to="/dashboard" className="header__title">
        🏭 MES 생산 모니터링
      </Link>
      <div className="header__actions">
        <ThemeToggle />
        <AuthStatus />
      </div>
    </header>
  )
}

export default Header
