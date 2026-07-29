# 로그인/회원가입 백엔드 설정

## 1. Oracle 테이블 생성

factoryview 계정으로 Oracle에 접속한 다음 아래 파일을 실행합니다.

```sql
@database/oracle/01_create_app_users.sql
```

SQL Developer를 사용한다면 파일 내용을 워크시트에서 실행해도 됩니다.
Oracle의 `USER`는 예약된 식별자이므로 실제 테이블 이름은 `APP_USERS`입니다.

## 2. 백엔드 실행

```bash
./gradlew bootRun
```

## 3. 프론트엔드 실행

```bash
cd ../frontend
npm install
npm run dev
```

Vite의 `/api` 프록시가 `http://localhost:8080`으로 요청을 전달합니다.

## API

- `POST /api/auth/signup`: 회원가입
- `POST /api/auth/login`: 로그인 및 세션 생성
- `GET /api/auth/me`: 현재 로그인 사용자 조회
- `POST /api/auth/logout`: 세션 로그아웃

`/api/auth/signup`, `/api/auth/login`, `/api/connection`을 제외한 백엔드 API는 로그인해야 접근할 수 있습니다.

## 사용자 이름 표시 흐름

회원가입 요청의 `displayName`이 `APP_USERS.DISPLAY_NAME`에 저장됩니다.
로그인 성공 응답과 `GET /api/auth/me` 응답에도 `displayName`이 포함되며, 프론트 헤더에서는 `사용자 이름님`으로 표시합니다.
사용자 메뉴를 열면 아이디와 이메일도 확인할 수 있습니다.
