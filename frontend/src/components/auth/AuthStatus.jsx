import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import UserMenu from './UserMenu'
import './AuthStatus.css'

// 로그인 여부에 따라 "로그인" 링크 또는 사용자메뉴(UserMenu)를 보여줍니다.
// 로그인 폼 자체(LoginPage)는 아직 placeholder입니다 — 여기서는 그 화면으로
// 이동시키는 버튼까지만 담당합니다.
function AuthStatus() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <Link to="/login" className="auth-status__login-link">
        로그인
      </Link>
    )
  }

  return <UserMenu user={user} onLogout={logout} />
}

export default AuthStatus
