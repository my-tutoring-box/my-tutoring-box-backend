# 빌드 단계
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# 프로덕션 단계
FROM node:22-alpine AS production

WORKDIR /app

# 빌드 단계에서 생성된 빌드 결과물을 복사
COPY --from=build /app/dist /app/dist

# 필요한 파일 및 디렉토리 복사
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/

# 개발 의존성(빌드 과정에만 필요) 제외하고 의존성 설치
RUN npm install --omit-dev

# 애플리케이션이 사용할 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령어 설정
CMD [ "npm", "run", "start:prod" ]