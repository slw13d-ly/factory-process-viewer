# REPORT_BOARD 설치 및 변경 안내

## 현재 프로젝트에서 날짜·표 기능으로 업그레이드

기존 `REPORT_BOARD`가 이미 있다면 DBeaver에서 `FACTORYVIEW` 계정으로 접속하고 다음 파일을 한 문장씩 실행합니다.

```text
backend/database/oracle/04_migrate_report_board_date_table.sql
```

적용 결과:

- `REPORT_DATE DATE NOT NULL` 추가
- 기존 보고서는 작성일 날짜를 보고 기준일로 자동 지정
- 공지 컬럼과 공지 인덱스 제거
- 보고 기준일 최신순 인덱스 생성
- 기존 일반 텍스트 내용은 그대로 호환

## 새 Oracle 환경

새 환경에서는 `APP_USERS`를 먼저 만든 다음 아래 파일을 실행합니다.

```text
backend/database/oracle/03_create_report_board.sql
```

생성 객체:

- `REPORT_BOARD`
- `REPORT_BOARD_SEQ`
- `IDX_REPORT_DATE_CREATED`
- `IDX_REPORT_AUTHOR`

## 재실행

```bash
cd backend
./gradlew --stop
./gradlew clean bootRun --no-daemon
```

```bash
cd frontend
npm install
npm run dev
```

새 내용 편집기는 문단과 표를 JSON 구조로 `CONTENT CLOB`에 저장합니다. HTML을 저장하거나 `dangerouslySetInnerHTML`을 사용하지 않습니다.
