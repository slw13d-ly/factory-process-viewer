import { useEffect, useRef, useState } from 'react'
import './UserMenu.css'

// user/onLogout은 props로 받습니다 — 이미 AuthStatus가 useAuth()를 호출해서
// "로그인된 상태"임을 확인한 뒤에만 이 컴포넌트를 렌더링하기 때문에, 여기서
// 다시 useAuth()를 부를 필요가 없습니다.
function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // 드롭다운이 열려있는 동안에만 "바깥 클릭 감지" 리스너를 등록합니다.
  // 닫혀있을 때까지 계속 등록해두면 클릭할 때마다 불필요하게 검사하게 됩니다.
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event) {
      if (!containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleLogoutClick() {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {user.id}님 <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <ul className="user-menu__dropdown" role="menu">
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="user-menu__item"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          </li>
          {/* 마이페이지는 아직 실제 화면이 없는 자리표시자입니다.
              가짜 링크로 만들지 않고, 클릭 핸들러 자체가 없는 비활성 항목으로 둡니다. */}
          <li className="user-menu__item user-menu__item--disabled" aria-disabled="true">
            마이페이지 (준비중)
          </li>
        </ul>
      )}
    </div>
  )
}

export default UserMenu
