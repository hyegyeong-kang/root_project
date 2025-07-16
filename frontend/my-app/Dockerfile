# Node.js 16 LTS 사용 (원하는 버전으로 변경 가능)
FROM node:22

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json, package-lock.json 복사
#COPY package*.json ./
COPY ./my-app/package*.json ./my-app/

# 의존성 설치
RUN npm install --prefix my-app
RUN npm install react-router-dom 
RUN npm install oidc-client-ts react-oidc-context --save
RUN npm install react-bootstrap

# 소스 복사
COPY ./my-app ./my-app

# 빌드
RUN npm run --prefix my-app build

# 빌드 결과물은 my-app/build 폴더에 생성됨

# serve 패키지로 정적파일 서빙(필요 시)
RUN npm install -g serve@latest

# 3000 포트 오픈
EXPOSE 5173

# 정적 서버 실행
CMD ["serve", "-s", "my-app/build", "--listen", "5173"]