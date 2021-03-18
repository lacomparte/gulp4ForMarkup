# 개요

UI개발 형상관리 Repository

# 설치
`npm install`

# 개발

- `npm run start`
  - PC 마크업 개발
    - 아래 PC 빌드설정에서 선택된 파일에 대해 build 및 로컬 서버 실행
  - MOBILE 마크업 개발
    - 아래 MOBILE 빌드설정에서 선택된 파일에 대해 build 및 로컬 서버 실행
  - PC 빌드설정
    - PC 디렉토리 하위에 있는 build 할 파일 선택
    - 다중 선택 가능
    - 선택하면 .workconfig.json 파일에 설정값이 write 됨
  - MOBILE 빌드설정
    - m 디렉토리 하위에 있는 build 할 파일 선택
    - 다중 선택 가능
    - 선택하면 .workconfig.json 파일에 설정값이 write 됨
- `npm run dev-pc`
  - .workconfig.json 파일에서 pc object에 선택된 파일에 대해 build 및 로컬 서버 실행
- `npm run dev-m`
  - .workconfig.json 파일에서 m object에 선택된 파일에 대해 build 및 로컬 서버 실행
- `npm run configure-pc`
  - build 대상 파일 선택
  - 선택된 값은 .workconfig.json 파일에서 pc object에 저장됨
- `npm run configure-m`
  - build 대상 파일 선택
  - 선택된 값은 .workconfig.json 파일에서 m object에 저장됨
- `npm run build-pc`
  - build 실행
  - build된 결과 report를 `/dist/reports/pc` 에서 html로 저장되며 브라우저에서 열어 확인 할 수 있음
- `npm run build-m`
  - build 실행
  - build된 결과 report를 `/dist/reports/m` 에서 html로 저장되며 브라우저에서 열어 확인 할 수 있음

## 운영
- 운영 젠킨스
  - 개발 젠킨스 설정 확정 후 생성 예정
