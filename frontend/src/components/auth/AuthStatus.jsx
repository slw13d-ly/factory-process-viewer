import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import UserMenu from './UserMenu'
import './AuthStatus.css'

function AuthStatus() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <span className="auth-status__loading">확인 중...</span>
  }

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
