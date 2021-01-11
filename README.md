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

# 배포
## 개발
- 젠킨스에서 배포
  - [개발 젠킨스](https://jenkins-frontend.dev.musinsa.io/job/devel-ui/)
- build parameters
  - branchName
    - build 하고자 하는 브랜치 선택
  - target
    - pc 또는 m 선택
  - project
    - build 하고자 하는 프로젝트 선택
    - 다중 선택할 수 없음
    - 하드 코딩 되어있어서 수동으로 업데이트 해야함
    - pc와 m의 설정값을 다르게 할 수 없음
  - purge
    - CDN purge 선택
    - 사용하는 곳에서 모두 영향을 받을 수 있기 때문에 영향도를 파악하고 선택해야함
    - CSS만 purge 시킴
- build 가 완료되면 build 된 파일을 S3에 업로드 함
  - 경로
    `musinsa.devel/ui_test/` // TODO 경로명 확정 후 수정 필요

## 운영
- 운영 젠킨스
  - 개발 젠킨스 설정 확정 후 생성 예정
