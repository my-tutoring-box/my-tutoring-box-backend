# my-tutoring-box-backend

과외 관리 플랫폼 백엔드 서버

## 기술 스택

- **Framework**: NestJS 11
- **Database**: MongoDB (Mongoose ODM)
- **Cache**: Redis (cache-manager)
- **Language**: TypeScript

## Project setup

```bash
$ npm install
```

### Redis 설정

캐시 기능을 사용하려면 Redis 서버가 필요합니다.

```bash
# Redis 설치 (Ubuntu/WSL2)
$ sudo apt update && sudo apt install redis-server

# Redis 서버 시작
$ sudo service redis-server start

# 연결 확인
$ redis-cli ping
# PONG 이 출력되면 정상
```

`.env.development` 파일에 Redis 연결 정보를 설정합니다:

```
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Redis 캐시 구조

### 왜 캐시를 도입했는가?

`findCurrentLesson`은 학생이 수업 페이지에 들어올 때마다 호출되는 API입니다.
이 API는 내부적으로 **DB 쿼리를 3번** 실행합니다:

1. `studentModel.findById()` - 학생 정보 조회
2. `calendarModel.findOne()` - 현재 수업 일정 조회
3. `lessonModel.findOne().populate()` - 수업 데이터 + 캘린더 join

수업 데이터는 자주 변경되지 않지만, 조회는 빈번하게 발생합니다.
Redis 캐시를 도입하여 **첫 번째 요청에서만 DB를 조회**하고, 이후 요청은 Redis에서 바로 응답합니다.

### 동작 방식

```
[클라이언트 요청] → findCurrentLesson(studentId)
         │
         ▼
  Redis에 캐시가 있는가? ──── Yes ──→ Redis 데이터 반환 (DB 조회 없음)
         │
         No
         │
         ▼
  MongoDB에서 3번 쿼리 실행
         │
         ▼
  결과를 Redis에 저장 (TTL: 3일)
         │
         ▼
  클라이언트에 응답
```

### 캐시 무효화 (Invalidation)

캐시된 데이터가 실제 DB와 달라지는 것을 방지하기 위해,
**데이터를 변경하는 API가 호출되면 해당 캐시를 삭제**합니다.

| API | 동작 | 캐시 처리 |
|-----|------|----------|
| `GET /:studentId/lessons` | 현재 수업 조회 | 캐시 조회 / 없으면 DB 조회 후 캐시 저장 |
| `PATCH /:studentId/lessons/:lessonId` | 수업 내용 수정 | DB 수정 후 해당 학생 캐시 삭제 |
| `PATCH .../homeworks/:homeworkId` | 숙제 완료 토글 | DB 수정 후 해당 학생 캐시 삭제 |

캐시 키 형식: `lesson:current:{studentId}`

### 설정 (RedisCacheModule)

```typescript
// src/redis-cache.module.ts
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CACHE_MANAGER',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return caching(redisStore, {
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          ttl: 259200 * 1000, // 3일 (밀리초 단위)
        });
      },
    },
  ],
  exports: ['CACHE_MANAGER'],
})
export class RedisCacheModule {}
```

- `provide: 'CACHE_MANAGER'` → `CacheModule` 대신 'CACHE_MANAGER' 토큰으로 주입하여 사용
- `ttl: 259200 * 1000` → 캐시 만료 시간 3일 (밀리초). 무효화가 없더라도 3일 후 자동 삭제됨

### 사용된 패키지

| 패키지 | 버전 | 역할 |
|--------|------|------|
| `@nestjs/cache-manager` | ^3.1.0 | NestJS 캐시 모듈 |
| `cache-manager` | ^5.7.6 | 캐시 추상화 라이브러리 |
| `cache-manager-redis-yet` | ^5.1.5 | Redis 연결 어댑터 |



## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
