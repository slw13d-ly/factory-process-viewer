import { createContext, createElement, useContext, useEffect, useState } from "react";

// 사용자가 고른 테마를 localStorage에 저장해두는 키.
// 새로고침해도 직접 고른 테마가 풀리지 않도록, 여기 저장된 값으로 초기 상태를 채운다.
const STORAGE_KEY = "theme";

// 저장된 값이 없으면 시스템(OS/브라우저) 설정을 따라간다.
function loadInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// ThemeContext는 "지금 라이트/다크 중 뭘 쓰고 있는지"를 컴포넌트 트리 전체에
// 공유하기 위한 통로다. useAuth.js와 같은 이유로 Context + Provider를 쓴다.
const ThemeContext = createContext(null);

// 이 컴포넌트로 앱을 감싸야(main.jsx) 그 안의 모든 컴포넌트가 useTheme()을 쓸 수 있다.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadInitialTheme);

  // theme이 바뀔 때마다 실제 화면(문서 root)에 반영하고 localStorage에 기억해둔다.
  // index.css는 :root[data-theme="dark"|"light"] 선택자로 이 속성을 읽어 색을 바꾼다.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // 이 파일은 .js 확장자라 JSX를 못 쓰기 때문에, 같은 뜻인
  // createElement(컴포넌트, props, children)로 대신 썼다 (useAuth.js와 동일).
  return createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children);
}

// 컴포넌트에서는 이 훅 하나만 부르면 { theme, toggleTheme }을 바로 쓸 수 있다.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme는 ThemeProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
