# 1. 빌드를 위한 환경
FROM node:18-alpine

# 2. 작업 디렉토리
WORKDIR /usr/src/app

# 3. 설치
COPY package*.json ./
RUN npm install

# 4. 소스 복사
COPY . .

# 5. 리액트 빌드 (배포용 파일 생성)
RUN npm run build

# 6. 실행 (실제 배포시는 Nginx를 쓰지만 일단 실행 확인용으로 작성)
EXPOSE 3000
CMD ["npm", "start"]