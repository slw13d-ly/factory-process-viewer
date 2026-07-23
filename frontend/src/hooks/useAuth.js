import { createContext, createElement, useContext, useState } from "react";

// 로그인한 사용자 정보를 localStorage에 저장해두는 키.
// 새로고침해도 로그인 상태가 풀리지 않도록, 여기 저장된 값으로 초기 상태를 채운다.
const STORAGE_KEY = "auth_user";

function loadUserFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // 저장된 값이 깨져 있으면 그냥 로그아웃 상태로 취급한다.
    return null;
  }
}

// AuthContext는 "지금 누가 로그인했는지"를 컴포넌트 트리 전체에 공유하기 위한 통로다.
// useState만 쓰면 그 상태는 그 컴포넌트 안에 갇혀서 다른 컴포넌트(헤더, 라우트 보호 등)가
// 알 수 없다. Context + Provider를 쓰면, Provider로 감싼 트리 안 어디서든
// useAuth()를 호출해서 같은 user 값을 읽고 같은 login/logout 함수를 쓸 수 있다.
const AuthContext = createContext(null);

// 이 컴포넌트로 앱을 감싸야(main.jsx) 그 안의 모든 컴포넌트가 useAuth()를 쓸 수 있다.
export function AuthProvider({ children }) {
  // 초기값을 함수로 넘기면(lazy initializer) localStorage 읽기가 첫 렌더링 때 딱 한 번만 실행된다.
  const [user, setUser] = useState(loadUserFromStorage);

  // 지금은 백엔드가 없어서 아이디만 받아 바로 로그인 처리한다 (비밀번호 검증 없음).
  // ---
  // 나중에 실제 로그인 API가 생기면 이 함수 "안쪽만" 아래처럼 바꾸면 된다:
  //   const login = async (id, password) => {
  //     const res = await fetch("/api/login", { method: "POST", body: JSON.stringify({ id, password }) });
  //     const loggedInUser = await res.json();
  //     setUser(loggedInUser);
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
  //   };
  // login을 호출하는 쪽(LoginForm 등)은 함수 시그니처만 안 바뀌면 코드를 고칠 필요가 없다.
  const login = (id) => {
    const loggedInUser = { id };
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 이 파일은 .js 확장자라 JSX(<태그> 문법)를 못 쓰기 때문에, 같은 뜻인
  // createElement(컴포넌트, props, children)로 대신 썼다.
  return createElement(AuthContext.Provider, { value: { user, login, logout } }, children);
}

// 컴포넌트에서는 이 훅 하나만 부르면 { user, login, logout }을 바로 쓸 수 있다.
// 예: const { user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    // AuthProvider로 감싸지 않은 곳에서 useAuth()를 부르면 원인을 바로 알 수 있도록 에러를 던진다.
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
