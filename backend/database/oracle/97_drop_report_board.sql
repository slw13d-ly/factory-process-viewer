-- 개발 초기화용입니다. 기존 보고서 데이터가 모두 삭제됩니다.
-- 각 문장을 한 문장씩 실행하세요.

DROP TABLE REPORT_BOARD CASCADE CONSTRAINTS PURGE;

DROP SEQUENCE REPORT_BOARD_SEQ;
