# 1단계: 빌드 스테이지

FROM node:16 AS build

WORKDIR /app

# package.json, package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 2단계: nginx 서버로 빌드 결과를 서빙
FROM nginx:stable-alpine

# 빌드 결과물을 nginx 기본 경로로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 기본 포트 80 사용 (nginx가 80포트로 서빙)
EXPOSE 3030

CMD ["nginx", "-g", "daemon off;"]
