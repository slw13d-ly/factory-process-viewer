import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [message, setMessage] = useState("Spring Boot 연결 확인 중...");
  const [serverTime, setServerTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackendConnection() {
      try {
        const response = await fetch("/api/connection", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }

        const data = await response.json();

        setMessage(data.message);
        setServerTime(data.serverTime);
        setError("");
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setMessage("Spring Boot 연결 실패");
        setError(err.message);
      }
    }

    checkBackendConnection();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="page">
      <h1>Factory Process Viewer</h1>

      <section className="connection-card">
        <h2>백엔드 연결 상태</h2>

        <p>{message}</p>

        {serverTime && (
          <p>
            <strong>서버 시간:</strong> {serverTime}
          </p>
        )}

        {error && (
          <p className="error">
            <strong>오류:</strong> {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
