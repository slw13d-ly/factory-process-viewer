import { useTheme } from '../../hooks/useTheme.js'
import './ThemeToggle.css'

// 이 버튼은 useTheme()을 직접 호출합니다 — Header가 값을 내려줄 필요 없이
// 이 컴포넌트가 유일한 소비자라서 props로 전달할 이유가 없습니다.
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <span aria-hidden="true">{isDark ? '☾' : '☀'}</span>
      {isDark ? '라이트 모드' : '다크 모드'}
    </button>
  )
}

export default ThemeToggle
