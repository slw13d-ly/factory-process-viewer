# 게시판 CRUD 설치 및 실행

## 1. Oracle 스키마 생성

DBeaver에서 Spring Boot가 사용하는 `FACTORYVIEW` 계정으로 접속합니다.

```sql
SELECT USER FROM DUAL;
```

결과가 `FACTORYVIEW`인지 확인한 뒤 다음 파일을 실행합니다.

```text
database/oracle/02_create_board.sql
```

`APP_USERS` 테이블이 먼저 있어야 하므로 신규 DB에서는 다음 순서로 실행합니다.

```text
1. database/oracle/01_create_app_users.sql
2. database/oracle/02_create_board.sql
```

DBeaver 전체 스크립트 실행 단축키:

```text
macOS: Option + X
Windows: Alt + X
```

## 2. 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

## 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

접속 주소:

```text
대시보드: http://localhost:5173/dashboard
게시판:   http://localhost:5173/board
글쓰기:   http://localhost:5173/board?compose=1
```

## 4. API

| 메서드 | 주소 | 기능 |
|---|---|---|
| GET | `/api/boards?page=0&size=10` | 공지 우선 게시글 목록과 페이징 |
| GET | `/api/boards/{boardId}` | 게시글 상세 조회 |
| POST | `/api/boards` | 게시글 작성 |
| PUT | `/api/boards/{boardId}` | 작성자 게시글 수정 |
| DELETE | `/api/boards/{boardId}` | 작성자 게시글 삭제 |

작성 요청 예시:

```json
{
  "title": "설비 점검 공지",
  "content": "오늘 18시에 설비 점검을 진행합니다.",
  "notice": true
}
```

작성자 정보는 요청 본문에서 받지 않습니다. 로그인 세션의 사용자를 조회하고 `APP_USERS.DISPLAY_NAME`을 화면에 표시합니다. 따라서 다른 사용자 이름을 임의로 넣을 수 없습니다.

## 5. 주요 규칙

- 제목과 내용은 필수입니다.
- 공지 체크 시 `IS_NOTICE=1`로 저장됩니다.
- 목록은 공지 우선, 작성일 최신순으로 정렬됩니다.
- 수정과 삭제는 작성자 본인만 가능합니다.
- 페이지당 기본 10개, API 최대 50개입니다.
- 작성자 이름 입력란은 읽기 전용입니다.
