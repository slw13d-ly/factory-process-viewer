import { useEffect, useRef, useState } from 'react'
import './UserMenu.css'

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const displayName = user.displayName?.trim() || user.username

  useEffect(() => {
    if (!isOpen) return undefined

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  async function handleLogoutClick() {
    setIsOpen(false)
    await onLogout()
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${displayName} 사용자 메뉴`}
      >
        <span className="user-menu__greeting">{displayName}님</span>
        <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <section className="user-menu__profile" aria-label="로그인 회원정보">
            <strong>{displayName}님</strong>
            <span>아이디: {user.username}</span>
            <span>이메일: {user.email}</span>
          </section>

          <button
            type="button"
            role="menuitem"
            className="user-menu__item"
            onClick={handleLogoutClick}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
