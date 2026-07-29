import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        로그인 상태를 확인하는 중입니다.
      </main>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
