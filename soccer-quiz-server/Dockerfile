# 1. Node.js 환경 선택
FROM node:18-alpine

# 2. 컨테이너 내부 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 종속성 설치를 위해 package.json 복사
COPY package*.json ./
RUN npm install

# 4. 소스 코드 전체 복사
COPY . .

# 5. 서버 포트 개방
EXPOSE 4000

# 6. 서버 실행 명령어
CMD ["node", "server.js"]