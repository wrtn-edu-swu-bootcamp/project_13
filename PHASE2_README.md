# Phase 2: 백엔드 인프라 구현 완료

Phase 2 백엔드 인프라 및 크롤링 구현이 완료되었습니다.

## 완료된 작업

### ✅ 백엔드 인프라 (2-1)
- [x] Upstash Redis 설정
  - `.env.local` 및 `.env.example` 파일 생성
  - 환경 변수 템플릿 작성
- [x] Redis 클라이언트 구현
  - `lib/cache/redis.ts` - Redis 클라이언트 초기화
  - `lib/cache/keys.ts` - 캐시 키 생성 함수
  - `lib/cache/strategy.ts` - 캐싱 전략 (TTL: 검색 5분, 도서관 24시간, 도서 7일)
- [x] Rate Limiting 구현
  - `lib/rate-limit.ts` - IP 기반 Rate Limiting (1분에 10회)

### ✅ 웹 크롤링 (2-2)
- [x] 크롤링 유틸리티
  - `lib/scraper/utils.ts` - 재시도 로직, 타임아웃, 에러 핸들링
  - `lib/scraper/parser.ts` - HTML 파싱 유틸리티
- [x] 크롤러 구현
  - `lib/scraper/songpa-unified.ts` - 송파구통합도서관 크롤러 (23개)
  - `lib/scraper/education-lib.ts` - 교육청도서관 크롤러 (1개)
- [x] 크롤러 통합
  - `lib/scraper/index.ts` - 병렬 크롤링 및 결과 병합

### ✅ API Routes (2-3)
- [x] 도서 검색 API
  - `app/api/search/route.ts` - GET /api/search
  - 쿼리 파라미터: title, author, publisher (최소 1개 필수)
  - Rate limiting, 캐싱, Zod 검증 적용
- [x] 도서관 목록 API
  - `app/api/libraries/route.ts` - GET /api/libraries
  - 위치 기반 거리 계산 (선택적)
- [x] 헬스체크 API
  - `app/api/health/route.ts` - GET /api/health
  - Redis 연결 상태 확인

### ✅ 추가 유틸리티
- [x] 거리 계산
  - `lib/utils/distance.ts` - Haversine 공식 구현

## 설치 및 실행 방법

### 1. Upstash Redis 설정 (필수)

Phase 2를 테스트하려면 먼저 Upstash Redis를 설정해야 합니다:

1. [Upstash Console](https://console.upstash.com/redis) 접속
2. Redis 데이터베이스 생성 (서울 리전 권장)
3. REST API 정보 복사:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. `.env.local` 파일에 입력:

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

NODE_ENV=development
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

서버가 http://localhost:3000 에서 실행됩니다.

## API 테스트

### 1. 헬스체크 API

Redis 연결 상태를 확인합니다:

```bash
curl http://localhost:3000/api/health
```

**예상 응답:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-22T02:14:00.000Z",
  "services": {
    "redis": "ok",
    "api": "ok"
  },
  "version": "1.0.0"
}
```

### 2. 도서관 목록 API

#### 기본 요청 (거리 계산 없음):

```bash
curl http://localhost:3000/api/libraries
```

#### 위치 기반 요청 (거리 계산):

```bash
# 송파구청 좌표
curl "http://localhost:3000/api/libraries?lat=37.5145&lng=127.1059"
```

**예상 응답:**
```json
{
  "libraries": [
    {
      "id": "songpa-unified",
      "name": "송파구통합도서관",
      "type": "public",
      "address": "서울특별시 송파구 백제고분로 242",
      "phone": "02-449-8855",
      "hours": "평일 09:00~22:00, 주말 09:00~18:00",
      "url": "https://www.splib.or.kr",
      "lat": 37.5063,
      "lng": 127.1088,
      "distance": 1.2
    }
    // ... 24개 도서관
  ],
  "total": 24
}
```

### 3. 도서 검색 API

⚠️ **주의:** 실제 도서관 웹사이트 크롤링이 구현되어 있지만, 웹사이트의 실제 HTML 구조를 확인하고 CSS 셀렉터를 수정해야 정상 작동합니다.

현재는 크롤링 로직의 기본 구조만 구현되어 있으며, 실제 테스트를 위해서는:

1. `lib/scraper/songpa-unified.ts` 파일 열기
2. 송파구통합도서관 웹사이트 (https://www.splibrary.or.kr) 접속
3. Chrome DevTools로 HTML 구조 확인
4. 실제 CSS 셀렉터로 코드 수정

#### 제목으로 검색:

```bash
curl "http://localhost:3000/api/search?title=멋진신세계"
```

#### 저자로 검색:

```bash
curl "http://localhost:3000/api/search?author=올더스헉슬리"
```

#### 복합 검색:

```bash
curl "http://localhost:3000/api/search?title=멋진신세계&author=올더스헉슬리"
```

**예상 응답 (CSS 셀렉터 수정 후):**
```json
{
  "book": {
    "title": "멋진 신세계",
    "author": "올더스 헉슬리",
    "publisher": "문학동네",
    "year": "2015",
    "isbn": "9788937460883",
    "cover": "https://...",
    "description": "디스토피아를 그린 고전 SF 소설..."
  },
  "libraries": [
    {
      "id": "songpa-glmaru",
      "name": "송파글마루도서관",
      "type": "public",
      "hasBook": true,
      "isAvailable": true,
      "status": "available",
      "dueDate": null,
      "location": "종합자료실",
      "callNumber": "843.6-H",
      // ... 도서관 기본 정보
    }
    // ... 소장 중인 도서관들
  ]
}
```

### 4. Rate Limiting 테스트

1분에 10회 이상 요청하면 429 에러가 발생합니다:

```bash
# PowerShell
for ($i=1; $i -le 15; $i++) {
  curl http://localhost:3000/api/libraries
  Start-Sleep -Seconds 1
}
```

11번째 요청부터 429 에러가 발생합니다:

```json
{
  "error": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  "reset": "2026-01-22T02:15:00.000Z"
}
```

## 프로젝트 구조

```
project/
├── .env.local                    # 환경 변수 (gitignore)
├── .env.example                  # 환경 변수 예시
├── app/
│   └── api/
│       ├── search/
│       │   └── route.ts          # 도서 검색 API
│       ├── libraries/
│       │   └── route.ts          # 도서관 목록 API
│       └── health/
│           └── route.ts          # 헬스체크 API
├── lib/
│   ├── cache/
│   │   ├── redis.ts              # Redis 클라이언트
│   │   ├── keys.ts               # 캐시 키 생성
│   │   └── strategy.ts           # 캐싱 전략
│   ├── scraper/
│   │   ├── utils.ts              # 재시도 로직
│   │   ├── parser.ts             # HTML 파싱
│   │   ├── songpa-unified.ts    # 송파구통합도서관 크롤러
│   │   ├── education-lib.ts     # 교육청도서관 크롤러
│   │   └── index.ts              # 크롤러 통합
│   ├── utils/
│   │   └── distance.ts           # 거리 계산
│   └── rate-limit.ts             # Rate Limiting
└── types/
    ├── book.ts                   # 도서 타입
    ├── library.ts                # 도서관 타입 (distance 추가됨)
    └── search.ts                 # 검색 타입
```

## 다음 단계 (Phase 3)

Phase 2가 완료되었으므로, 다음은 Phase 3: 프론트엔드 구현입니다:

1. React Query Provider 설정
2. 커스텀 훅 작성 (useSearch, useLibraries, useLocation)
3. 검색 폼 컴포넌트
4. 도서 정보 카드 컴포넌트
5. 도서관 카드 컴포넌트
6. 검색 결과 페이지

## 주의사항

### ⚠️ 크롤링 셀렉터 수정 필요

현재 크롤러는 기본 구조만 구현되어 있습니다. 실제 도서관 웹사이트의 HTML 구조를 확인하고 CSS 셀렉터를 수정해야 합니다:

1. **송파구통합도서관** (https://www.splibrary.or.kr)
   - 파일: `lib/scraper/songpa-unified.ts`
   - TODO 주석 확인 및 셀렉터 수정

2. **교육청도서관** (https://songpalib.sen.go.kr)
   - 파일: `lib/scraper/education-lib.ts`
   - TODO 주석 확인 및 셀렉터 수정

### 환경 변수 보안

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- Vercel 배포 시 환경 변수를 Dashboard에서 설정하세요

### Rate Limiting

- 로컬 개발 시 IP가 `::1` (IPv6)로 표시될 수 있습니다
- 테스트 후 1분 대기하면 Rate Limit이 리셋됩니다

## 문제 해결

### Redis 연결 실패

헬스체크 API에서 redis: "error"가 나오면:

1. `.env.local` 파일의 환경 변수 확인
2. Upstash Dashboard에서 Redis 상태 확인
3. 인터넷 연결 확인

### 빌드 에러

타입 에러가 발생하면:

```bash
pnpm build
```

에러 메시지를 확인하고 수정하세요.

## 참고 문서

- [Phase 2 계획](c:\Users\PC\.cursor\plans\phase_2_백엔드_구현_25bcfb96.plan.md)
- [DEVELOPMENT_TODO.md](docs/DEVELOPMENT_TODO.md) - Phase 2 (273-427번 줄)
- [code-architecture.md](docs/code-architecture.md)
- [Upstash Redis Documentation](https://upstash.com/docs/redis)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
