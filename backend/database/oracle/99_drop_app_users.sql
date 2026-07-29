-- 개발 중 테이블을 초기화해야 할 때만 실행하세요. 저장된 회원 정보가 모두 삭제됩니다.
DROP TABLE APP_USERS CASCADE CONSTRAINTS PURGE;
DROP SEQUENCE APP_USERS_SEQ;
