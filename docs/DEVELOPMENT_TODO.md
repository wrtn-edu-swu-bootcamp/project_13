# 책크 (Cheok) 개발 Todo List

## 📋 MVP 개발 개요

송파구 내 24개 도서관의 도서 소장 및 대출 가능 여부를 한 번에 검색하는 통합 서비스를 5단계(Phase)로 개발합니다.

### 핵심 기능

- 통합 도서 검색 (제목/저자/출판사)
- 실시간 대출 가능 여부 확인
- 위치 기반 도서관 정렬
- 모든 연령대 접근 가능한 UI
- 소나무 모티브의 친근한 디자인

### Phase 구조

```
Phase 1: 환경 구축 및 기초 설정 (1-2주)
   → 개발 환경, 디자인 시스템, TypeScript 타입

Phase 2: 백엔드 인프라 및 크롤링 (2-3주)
   → Redis, 웹 크롤러, API Routes

Phase 3: 프론트엔드 구현 (2-3주)
   → React 컴포넌트, 페이지, 위치 기능

Phase 4: 최적화 및 배포 준비 (1-2주)
   → 성능, 접근성, 보안, Vercel 설정

Phase 5: 테스트 및 배포 (1주)
   → QA, 프로덕션 배포, 모니터링
```

**총 예상 기간**: 7-11주 (약 2-3개월)

---

## Phase 1: 환경 구축 및 기초 설정 🔧

**소요 시간**: 1-2주  
**목표**: 프로젝트 기본 구조와 디자인 시스템 구축

### 1-1. 개발 환경 구축 (개발 시작 전 필수)

**목적**: 프로젝트를 시작하기 위한 기본 환경을 설정합니다.

#### 1-1-1. Node.js 및 패키지 매니저 설치

- **설명**: 프로젝트를 실행하기 위한 기반 소프트웨어를 설치합니다
- **작업 내용**:
  - Node.js 20.x 버전 설치 ([https://nodejs.org](https://nodejs.org))
  - pnpm 패키지 매니저 설치 (`npm install -g pnpm`)
- **참고 문서**: `docs/code-architecture.md` → "개발 환경 설정" 섹션 (2004번 줄)
- **검증 방법**: 터미널에서 `node -v`와 `pnpm -v` 명령어 실행 시 버전이 출력되는지 확인

#### 1-1-2. Git 저장소 초기화

- **설명**: 코드 버전 관리를 위한 Git 저장소를 만듭니다
- **작업 내용**:
  - `git init` 명령어로 저장소 초기화
  - GitHub에 원격 저장소 생성 ([https://github.com/new](https://github.com/new))
  - 원격 저장소 연결: `git remote add origin [저장소 URL]`
- **참고 문서**: `.cursorrules` → "Git Commit 컨벤션" 섹션 (784번 줄)

#### 1-1-3. Next.js 프로젝트 생성

- **설명**: Next.js 15.5.9 버전으로 프로젝트의 기본 구조를 만듭니다
- **작업 내용**:
  - `pnpm create next-app@15.5.9 cheok` 명령어 실행
  - TypeScript, Tailwind CSS, App Router 옵션 선택
  - ESLint 활성화
- **참고 문서**: `docs/code-architecture.md` → "기술 스택 상세" 섹션 (63번 줄)
- **설정 옵션**:
  ```
  ✔ Would you like to use TypeScript? Yes
  ✔ Would you like to use ESLint? Yes
  ✔ Would you like to use Tailwind CSS? Yes
  ✔ Would you like to use App Router? Yes
  ```

#### 1-1-4. 필수 의존성 패키지 설치

- **설명**: 프로젝트에 필요한 라이브러리들을 설치합니다
- **작업 내용**:
  - `package.json`에 명시된 패키지들을 설치
  - 보안 패치가 적용된 최신 버전 사용 (CVE-2025-55182 대응)
- **참고 문서**: 
  - `docs/code-architecture.md` → "package.json" 섹션 (2007번 줄)
  - `.cursorrules` → "기술 스택" 섹션 (18번 줄)
- **설치 명령어**:
  ```bash
  pnpm add next@15.5.9 react@19.2.2 react-dom@19.2.2
  pnpm add @tanstack/react-query@^5.80.2
  pnpm add @upstash/redis@^1.38.0 @upstash/ratelimit@^2.0.6
  pnpm add cheerio@^1.1.2
  pnpm add zod@^3.23.8 clsx@^2.1.1 tailwind-merge@^2.7.0

  # 개발 의존성
  pnpm add -D typescript@5.7.2 @types/node @types/react
  pnpm add -D tailwindcss@4.1.18 postcss autoprefixer
  pnpm add -D eslint prettier
  ```

#### 1-1-5. TypeScript 설정

- **설명**: TypeScript의 엄격한 타입 체크를 활성화합니다
- **작업 내용**:
  - `tsconfig.json` 파일 생성 및 설정
  - ES2024 타겟으로 설정
  - 경로 별칭 `@/*` 설정
- **참고 문서**: 
  - `docs/code-architecture.md` → "TypeScript 설정" 섹션 (2054번 줄)
  - `.cursorrules` → "TypeScript 규칙" 섹션 (84번 줄)

#### 1-1-6. 폴더 구조 생성

- **설명**: 프로젝트의 기본 폴더 구조를 만듭니다
- **작업 내용**:
  - `app/`, `components/`, `lib/`, `types/`, `public/` 폴더 생성
  - 각 폴더에 하위 구조 생성 (ui, search, library 등)
- **참고 문서**: 
  - `docs/code-architecture.md` → "프로젝트 구조" 섹션 (527번 줄)
  - `.cursorrules` → "프로젝트 구조" 섹션 (42번 줄)
- **폴더 구조**:
  ```
  cheok/
  ├── app/
  │   ├── (main)/
  │   ├── api/
  │   ├── layout.tsx
  │   ├── globals.css
  │   └── providers.tsx
  ├── components/
  │   ├── ui/
  │   ├── search/
  │   ├── library/
  │   ├── book/
  │   └── filter/
  ├── lib/
  │   ├── api/
  │   ├── scraper/
  │   ├── cache/
  │   ├── hooks/
  │   └── utils/
  ├── types/
  └── public/images/
  ```

---

### 1-2. 디자인 시스템 구축

**목적**: 일관된 UI/UX를 위한 디자인 토큰과 기본 컴포넌트를 만듭니다.

#### 1-2-1. Tailwind CSS 설정

- **설명**: 디자인 가이드의 색상, 폰트, 스페이싱을 Tailwind에 적용합니다
- **작업 내용**:
  - `tailwind.config.ts` 파일에 커스텀 테마 설정
  - 소나무 초록색(#2D7A4E)을 primary 색상으로 설정
  - Pretendard 폰트를 기본 폰트로 설정
  - 8px 기반 스페이싱 시스템 적용
- **참고 문서**:
  - `docs/design-guide.md` → "컬러 시스템" 섹션 (111번 줄)
  - `docs/design-guide.md` → "타이포그래피" 섹션 (236번 줄)
  - `docs/code-architecture.md` → "Tailwind CSS 설정" 섹션 (1242번 줄)
- **설정 예시**: 초록색 primary, 상태별 색상(대출가능, 대출중 등), 도서관 유형별 색상 정의

#### 1-2-2. 전역 스타일 작성

- **설명**: 모든 페이지에 공통으로 적용되는 스타일을 정의합니다
- **작업 내용**:
  - `app/globals.css`에 Tailwind 레이어 정의
  - CSS 변수로 디자인 토큰 정의
  - 재사용 가능한 컴포넌트 클래스 작성 (btn-primary, input-field 등)
- **참고 문서**:
  - `docs/design-guide.md` → "CSS 변수 전체 정의" 섹션 (1926번 줄)
  - `docs/code-architecture.md` → "전역 스타일" 섹션 (1329번 줄)
  - `.cursorrules` → "스타일링" 섹션 (263번 줄)

#### 1-2-3. Pretendard 폰트 통합

- **설명**: 한글/영문이 균형잡힌 Pretendard 폰트를 적용합니다
- **작업 내용**:
  - `app/layout.tsx`의 `<head>`에 CDN 링크 추가
  - Variable Font 사용으로 9가지 굵기 지원
  - 폰트 로딩 최적화 (preload, crossorigin)
- **참고 문서**:
  - `docs/code-architecture.md` → "Pretendard Font" 섹션 (156번 줄)
  - `docs/design-guide.md` → "타이포그래피" 섹션 (236번 줄)
- **CDN 링크**: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`

#### 1-2-4. 기본 UI 컴포넌트 작성

- **설명**: 재사용 가능한 기본 UI 컴포넌트들을 만듭니다
- **작업 내용**:
  - `components/ui/button.tsx`: Primary, Secondary 버튼
  - `components/ui/input.tsx`: 텍스트 입력 필드
  - `components/ui/badge.tsx`: 상태 표시 배지 (대출가능, 대출중 등)
  - `components/ui/card.tsx`: 카드 컴포넌트
  - `components/ui/loading.tsx`: 로딩 스피너
- **참고 문서**:
  - `docs/design-guide.md` → "컴포넌트 라이브러리" 섹션 (464번 줄)
  - `docs/code-architecture.md` → "컴포넌트 스타일 예시" 섹션 (1427번 줄)
  - `.cursorrules` → "컴포넌트 스타일링 규칙" 섹션 (299번 줄)
- **주의사항**:
  - 모든 버튼은 최소 44x44px (터치 타겟)
  - 색상 대비 WCAG AA 기준 준수 (4.5:1)
  - 호버, 포커스, 비활성 상태 모두 구현

#### 1-2-5. 배지 컴포넌트 작성

- **설명**: 도서 대출 상태와 도서관 유형을 표시하는 배지를 만듭니다
- **작업 내용**:
  - 상태 배지: 대출가능(녹색), 대출중(빨강), 관내열람만(노랑), 소장함(회색), 미소장(회색)
  - 도서관 유형 배지: 공공도서관(파랑), 스마트도서관(보라), 교육청(청록)
  - 아이콘 + 텍스트 조합으로 접근성 확보
- **참고 문서**:
  - `docs/design-guide.md` → "배지" 섹션 (686번 줄)
  - `docs/wireframes.md` → "도서관 카드" 섹션 (241번 줄)
- **색상 참고**: 대출가능 bg: #DCFCE7, text: #15803D

---

### 1-3. TypeScript 타입 정의

**목적**: 타입 안정성을 확보하기 위해 모든 데이터 구조를 정의합니다.

#### 1-3-1. 도서관 관련 타입 정의

- **설명**: 도서관 정보와 소장 상태를 표현하는 타입을 만듭니다
- **작업 내용**:
  - `types/library.ts` 파일 생성
  - `LibraryType`: 'public' | 'smart' | 'education'
  - `Library`: 도서관 기본 정보 (id, name, type, address, phone 등)
  - `LibraryStatus`: 소장 및 대출 상태 포함
- **참고 문서**:
  - `docs/code-architecture.md` → "도메인 타입 정의" 섹션 (628번 줄)
  - `.cursorrules` → "도메인 타입 정의" 섹션 (628번 줄)
- **타입 예시**:
  ```typescript
  export interface LibraryStatus {
    libraryId: string
    libraryName: string
    libraryType: 'public' | 'smart' | 'education'
    hasBook: boolean
    isAvailable: boolean
    status: string
    dueDate: string | null
    distance?: number
  }
  ```

#### 1-3-2. 도서 관련 타입 정의

- **설명**: 도서 정보를 표현하는 타입을 만듭니다
- **작업 내용**:
  - `types/book.ts` 파일 생성
  - `BookInfo`: 제목, 저자, 출판사, ISBN, 표지, 설명
- **참고 문서**: `docs/code-architecture.md` → "도메인 타입 정의" 섹션 (659번 줄)

#### 1-3-3. 검색 관련 타입 정의

- **설명**: 검색 파라미터와 응답을 표현하는 타입을 만듭니다
- **작업 내용**:
  - `types/search.ts` 파일 생성
  - `SearchParams`: 제목, 저자, 출판사 (모두 optional)
  - `SearchResponse`: 도서 정보 + 도서관 목록
- **참고 문서**: `docs/code-architecture.md` → "도메인 타입 정의" 섹션 (670번 줄)

---

## Phase 2: 백엔드 인프라 및 크롤링 구현 ⚙️

**소요 시간**: 2-3주  
**목표**: 데이터 수집을 위한 백엔드 시스템과 API 구축

### 2-1. 백엔드 인프라 구축

**목적**: 데이터 수집 및 캐싱을 위한 백엔드 시스템을 구축합니다.

#### 2-1-1. Upstash Redis 계정 생성 및 연동

- **설명**: 검색 결과를 캐싱할 Redis 데이터베이스를 생성합니다
- **작업 내용**:
  1. Upstash 계정 생성 ([https://upstash.com](https://upstash.com))
  2. Redis 데이터베이스 생성 (서울 리전 선택)
  3. REST API URL과 토큰 복사
  4. Vercel과 통합 설정 (자동 환경 변수 주입)
- **참고 문서**:
  - `docs/code-architecture.md` → "Upstash Redis" 섹션 (291번 줄)
  - 웹 리서치 결과: Upstash-Vercel 통합 V2 사용
- **환경 변수**:
  ```
  UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
  UPSTASH_REDIS_REST_TOKEN=your_token_here
  ```

#### 2-1-2. Redis 클라이언트 설정

- **설명**: Redis에 접속하는 클라이언트 코드를 작성합니다
- **작업 내용**:
  - `lib/cache/redis.ts` 파일 생성
  - `@upstash/redis` 패키지로 클라이언트 초기화
  - 환경 변수에서 자동으로 설정 읽기 (`Redis.fromEnv()`)
- **참고 문서**:
  - `docs/code-architecture.md` → "Upstash Redis" 섹션 (310번 줄)
  - `.cursorrules` → "캐싱 전략" 섹션 (456번 줄)

#### 2-1-3. 캐싱 전략 구현

- **설명**: 데이터의 종류에 따라 다른 캐시 TTL을 적용합니다
- **작업 내용**:
  - `lib/cache/strategy.ts` 파일 생성
  - TTL 정의: 검색 결과 5분, 도서관 목록 24시간, 도서 정보 7일
  - `getCached()`, `setCached()` 함수 구현
- **참고 문서**: `docs/code-architecture.md` → "캐싱 전략" 섹션 (1046번 줄)
- **캐시 키 패턴**: `search:제목:저자:출판사`

#### 2-1-4. Rate Limiting 구현

- **설명**: API 남용을 방지하기 위한 속도 제한을 구현합니다
- **작업 내용**:
  - `lib/rate-limit.ts` 파일 생성
  - `@upstash/ratelimit` 패키지 사용
  - IP 기반 제한: 1분에 10회
  - Sliding Window 알고리즘 사용
- **참고 문서**:
  - `docs/code-architecture.md` → "Rate Limiting" 섹션 (1000번 줄)
  - `.cursorrules` → "Rate Limiting" 섹션 (598번 줄)
  - 웹 리서치 결과: 서버리스 환경에서 공유 상태로 rate limit 관리

---

### 2-2. 웹 크롤링 구현

**목적**: 도서관 웹사이트에서 실시간 데이터를 수집합니다.

#### 2-2-1. 크롤링 유틸리티 함수 작성

- **설명**: 안정적인 크롤링을 위한 재시도 로직과 에러 핸들링을 구현합니다
- **작업 내용**:
  - `lib/scraper/utils.ts` 파일 생성
  - `fetchWithRetry()`: 최대 3회 재시도, 10초 타임아웃
  - 429 에러 시 지수 백오프 (1초, 2초, 4초)
  - User-Agent 헤더 설정
- **참고 문서**:
  - `docs/code-architecture.md` → "에러 처리 및 재시도" 섹션 (962번 줄)
  - `.cursorrules` → "웹 크롤링" 섹션 (492번 줄)
  - 웹 리서치 결과: Rate limiting 전략 (지연, 재시도, 백오프)

#### 2-2-2. 송파구통합도서관 크롤러 작성

- **설명**: 23개 도서관(공공14개 + 스마트9개)의 데이터를 수집합니다
- **작업 내용**:
  - `lib/scraper/songpa-unified.ts` 파일 생성
  - URL: [https://www.splibrary.or.kr](https://www.splibrary.or.kr)
  - Cheerio로 HTML 파싱
  - 도서 정보 + 도서관별 소장 상태 추출
- **참고 문서**:
  - `docs/service-proposal.md` → "데이터 수집 방식" 섹션 (583번 줄)
  - `docs/code-architecture.md` → "송파구통합도서관 크롤러" 섹션 (892번 줄)
- **주의사항**: 실제 웹사이트 구조를 확인하고 셀렉터를 정확히 작성해야 함

#### 2-2-3. 교육청도서관 크롤러 작성

- **설명**: 서울시교육청 송파도서관의 데이터를 수집합니다
- **작업 내용**:
  - `lib/scraper/education-lib.ts` 파일 생성
  - URL: [https://songpalib.sen.go.kr](https://songpalib.sen.go.kr)
  - 별도 시스템이므로 독립적인 크롤링 로직 구현
- **참고 문서**: `docs/service-proposal.md` → "데이터 수집 방식" 섹션 (597번 줄)

#### 2-2-4. 크롤러 통합 및 병렬 처리

- **설명**: 2개 크롤러를 병렬로 실행하여 속도를 향상시킵니다
- **작업 내용**:
  - `lib/scraper/index.ts` 파일 생성
  - `Promise.all()`로 병렬 크롤링
  - 결과 병합 및 정규화
- **참고 문서**: `docs/code-architecture.md` → "웹 크롤링 실행" 섹션 (832번 줄)
- **예상 소요 시간**: 3-5초

---

### 2-3. API Routes 구현

**목적**: 프론트엔드에서 호출할 API 엔드포인트를 만듭니다.

#### 2-3-1. 도서 검색 API 작성

- **설명**: 제목/저자/출판사로 도서를 검색하는 API를 만듭니다
- **작업 내용**:
  - `app/api/search/route.ts` 파일 생성
  - GET 메서드 구현
  - 쿼리 파라미터 검증 (Zod 스키마)
  - Rate limiting 적용
  - 캐시 확인 → 없으면 크롤링 → 캐시 저장
  - 최대 실행 시간 60초 설정
- **참고 문서**:
  - `docs/code-architecture.md` → "API Route 처리" 섹션 (787번 줄)
  - `docs/code-architecture.md` → "도서 검색 API" 섹션 (1088번 줄)
  - `.cursorrules` → "Server Actions" 섹션 (181번 줄)
- **요청 예시**: `GET /api/search?title=멋진+신세계&author=올더스+헉슬리`

#### 2-3-2. 도서관 목록 API 작성

- **설명**: 송파구 24개 도서관의 기본 정보를 제공하는 API를 만듭니다
- **작업 내용**:
  - `app/api/libraries/route.ts` 파일 생성
  - GET 메서드 구현
  - 사용자 위치(위도/경도) 받아서 거리 계산
  - 도서관 상수 데이터 사용
- **참고 문서**:
  - `docs/code-architecture.md` → "도서관 목록 API" 섹션 (1190번 줄)
  - `lib/constants/libraries.ts`에 도서관 데이터 정의

#### 2-3-3. 헬스체크 API 작성

- **설명**: 서비스 상태를 확인하는 API를 만듭니다
- **작업 내용**:
  - `app/api/health/route.ts` 파일 생성
  - Redis 연결 상태 확인
  - 크롤러 정상 작동 여부 확인
- **참고 문서**: `docs/code-architecture.md` → "헬스체크 API" 섹션 (1222번 줄)

---

## Phase 3: 프론트엔드 구현 🎨

**소요 시간**: 2-3주  
**목표**: 사용자 인터페이스와 인터랙션 구현

### 3-1. 프론트엔드 컴포넌트 구현

**목적**: 사용자가 보고 상호작용하는 화면을 만듭니다.

#### 3-1-1. React Query Provider 설정

- **설명**: 서버 상태 관리를 위한 TanStack Query를 설정합니다
- **작업 내용**:
  - `app/providers.tsx` 파일 생성
  - QueryClient 생성 및 설정 (staleTime: 5분, gcTime: 10분)
  - QueryClientProvider로 앱 감싸기
  - DevTools 추가 (개발 환경)
- **참고 문서**:
  - `docs/code-architecture.md` → "React Query Provider" 섹션 (687번 줄)
  - `docs/code-architecture.md` → "TanStack Query 설정" 섹션 (1476번 줄)

#### 3-1-2. 커스텀 훅 작성

- **설명**: 재사용 가능한 데이터 페칭 로직을 만듭니다
- **작업 내용**:
  - `lib/hooks/use-search.ts`: 검색 훅
  - `lib/hooks/use-libraries.ts`: 도서관 목록 훅
  - `lib/hooks/use-location.ts`: 위치 정보 훅
  - `lib/hooks/use-recent-searches.ts`: 최근 검색어 훅
- **참고 문서**:
  - `docs/code-architecture.md` → "커스텀 훅" 섹션 (1476번 줄)
  - `.cursorrules` → "커스텀 훅 패턴" 섹션 (684번 줄)

#### 3-1-3. 검색 폼 컴포넌트 작성

- **설명**: 사용자가 검색어를 입력하는 폼을 만듭니다
- **작업 내용**:
  - `components/search/search-form.tsx` 파일 생성
  - 제목, 저자, 출판사 입력 필드 3개
  - 최소 1개 이상 입력 검증
  - 검색 버튼 (로딩 상태 표시)
  - 엔터키로 검색 실행
- **참고 문서**:
  - `docs/wireframes.md` → "검색 화면" 섹션 (29번 줄)
  - `docs/design-guide.md` → "입력 필드" 섹션 (559번 줄)
- **접근성**: 레이블 명확, 포커스 표시, 16px 이상 폰트

#### 3-1-4. 최근 검색어 컴포넌트 작성

- **설명**: 사용자의 최근 검색어 5개를 표시합니다
- **작업 내용**:
  - `components/search/recent-searches.tsx` 파일 생성
  - Local Storage에서 검색어 불러오기
  - 클릭 시 해당 검색어로 재검색
  - 삭제 버튼 추가
- **참고 문서**:
  - `docs/wireframes.md` → "최근 검색어 영역" 섹션 (114번 줄)
  - `docs/code-architecture.md` → "최근 검색어" 섹션 (1543번 줄)

#### 3-1-5. 도서 정보 카드 컴포넌트 작성

- **설명**: 검색된 도서의 기본 정보를 표시합니다
- **작업 내용**:
  - `components/book/book-info-card.tsx` 파일 생성
  - 표지 이미지 (next/image 사용)
  - 제목, 저자, 출판사, 출판년도, ISBN
  - 책 소개 (2-3줄)
- **참고 문서**:
  - `docs/wireframes.md` → "도서 정보 카드" 섹션 (427번 줄)
  - `docs/design-guide.md` → "도서 정보 카드" 섹션 (849번 줄)

#### 3-1-6. 도서관 카드 컴포넌트 작성

- **설명**: 각 도서관의 소장 및 대출 정보를 표시합니다
- **작업 내용**:
  - `components/library/library-card.tsx` 파일 생성
  - 도서관명, 유형 배지, 거리 정보
  - 소장 여부 배지, 대출 상태 배지
  - 운영 시간, 연락처, 주소
  - 상세보기, 예약하기 버튼
- **참고 문서**:
  - `docs/wireframes.md` → "도서관 카드" 섹션 (241번 줄)
  - `docs/design-guide.md` → "도서관 카드" 섹션 (616번 줄)
- **접근성**: 색상 + 아이콘 + 텍스트 조합, 터치 타겟 44px

#### 3-1-7. 필터 및 정렬 컴포넌트 작성

- **설명**: 검색 결과를 정렬하고 필터링하는 UI를 만듭니다
- **작업 내용**:
  - `components/filter/sort-options.tsx`: 거리순/대출가능 우선 라디오 버튼
  - `components/filter/filter-checkbox.tsx`: 대출 가능만 보기 체크박스
  - 클라이언트 컴포넌트로 구현 (상태 관리)
- **참고 문서**:
  - `docs/wireframes.md` → "필터 및 정렬 영역" 섹션 (226번 줄)
  - `docs/design-guide.md` → "필터 및 정렬 영역" 섹션 (904번 줄)

---

### 3-2. 페이지 구현

**목적**: 실제 사용자가 방문하는 화면을 만듭니다.

#### 3-2-1. 루트 레이아웃 작성

- **설명**: 모든 페이지에 공통으로 적용되는 레이아웃을 만듭니다
- **작업 내용**:
  - `app/layout.tsx` 파일 수정
  - 메타데이터 설정 (제목, 설명, 키워드)
  - Pretendard 폰트 로드
  - React Query Provider 적용
  - Vercel Analytics, Speed Insights 추가
- **참고 문서**:
  - `docs/code-architecture.md` → "루트 레이아웃" 섹션 (651번 줄)
  - `docs/code-architecture.md` → "모니터링" 섹션 (1966번 줄)

#### 3-2-2. 검색 화면 (메인) 작성

- **설명**: 사용자가 처음 보는 검색 화면을 만듭니다
- **작업 내용**:
  - `app/(main)/page.tsx` 파일 작성
  - 헤더 (로고, 위치 정보)
  - 검색 폼
  - 최근 검색어
  - 안내 메시지
  - 소나무 배경 일러스트 (선택사항)
- **참고 문서**:
  - `docs/wireframes.md` → "검색 화면" 섹션 (29번 줄)
  - `docs/design-guide.md` → "화면별 디자인 예시" 섹션 (1729번 줄)
- **반응형**: 모바일(p-4), 태블릿(p-6), 데스크톱(p-8)

#### 3-2-3. 검색 결과 화면 작성

- **설명**: 검색 결과를 표시하는 화면을 만듭니다
- **작업 내용**:
  - `app/(main)/results/page.tsx` 파일 작성
  - URL 쿼리 파라미터에서 검색어 읽기
  - 도서 정보 카드
  - 필터 및 정렬 영역
  - 도서관 카드 목록
  - 다른 책 검색하기 버튼
- **참고 문서**:
  - `docs/wireframes.md` → "검색 결과 화면" 섹션 (134번 줄)
  - `docs/design-guide.md` → "화면별 디자인 예시" 섹션 (1791번 줄)
  - `docs/code-architecture.md` → "결과 페이지 렌더링" 섹션 (853번 줄)

#### 3-2-4. 로딩 화면 작성

- **설명**: 데이터를 불러오는 동안 보여줄 로딩 UI를 만듭니다
- **작업 내용**:
  - `app/(main)/loading.tsx` 파일 작성
  - `app/(main)/results/loading.tsx` 파일 작성
  - 소나무 아이콘 회전 애니메이션
  - 프로그레스 바
  - 안내 메시지 ("도서관 정보를 불러오는 중...")
  - 스켈레톤 UI (선택사항)
- **참고 문서**:
  - `docs/wireframes.md` → "로딩 화면" 섹션 (316번 줄)
  - `docs/design-guide.md` → "로딩 애니메이션" 섹션 (1564번 줄)
  - `docs/code-architecture.md` → "Streaming SSR" 섹션 (1679번 줄)

#### 3-2-5. 에러 화면 작성

- **설명**: 오류가 발생했을 때 보여줄 화면을 만듭니다
- **작업 내용**:
  - `app/error.tsx` 파일 작성 (전역 에러)
  - 검색 결과 없음 화면
  - 네트워크 오류 화면
  - 위치 권한 거부 화면
  - 각 상황에 맞는 안내 메시지와 재시도 버튼
- **참고 문서**:
  - `docs/wireframes.md` → "에러/빈 결과 화면" 섹션 (370번 줄)
  - `docs/design-guide.md` → "화면별 디자인 예시" 섹션 (1890번 줄)
  - `.cursorrules` → "에러 처리" 섹션 (712번 줄)

---

### 3-3. 위치 기반 기능 구현

**목적**: 사용자의 현재 위치에서 가까운 도서관을 우선 표시합니다.

#### 3-3-1. Geolocation API 통합

- **설명**: 브라우저의 위치 정보 API를 사용합니다
- **작업 내용**:
  - `lib/hooks/use-location.ts` 파일 작성
  - 위치 권한 요청
  - 위치 정보 가져오기 (위도, 경도)
  - 에러 핸들링 (권한 거부, 타임아웃 등)
- **참고 문서**: `docs/service-proposal.md` → "위치 기반 정렬" 섹션 (323번 줄)
- **개인정보**: 위치 정보는 로컬에서만 사용, 서버 저장 안 함

#### 3-3-2. 거리 계산 유틸리티 작성

- **설명**: 두 지점 간의 거리를 계산합니다
- **작업 내용**:
  - `lib/utils/distance.ts` 파일 작성
  - Haversine 공식으로 구면 거리 계산
  - km 단위로 반환 (소수점 1자리)
- **참고 문서**: `docs/code-architecture.md` → "API 설계" 섹션 (1083번 줄)

#### 3-3-3. 도서관 정렬 로직 구현

- **설명**: 거리 또는 대출 가능 여부로 정렬합니다
- **작업 내용**:
  - 거리순: 가까운 도서관 먼저
  - 대출 가능 우선: 대출 가능한 도서관을 위로
  - 클라이언트 컴포넌트에서 상태로 관리
- **참고 문서**: `docs/wireframes.md` → "필터 및 정렬 영역" 섹션 (226번 줄)

---

## Phase 4: 최적화 및 배포 준비 🚀

**소요 시간**: 1-2주  
**목표**: 성능, 접근성, 보안 최적화 및 배포 설정

### 4-1. 성능 최적화

**목적**: 빠른 로딩 속도와 좋은 사용자 경험을 제공합니다.

#### 4-1-1. 이미지 최적화

- **설명**: next/image 컴포넌트로 이미지를 최적화합니다
- **작업 내용**:
  - 도서 표지 이미지에 next/image 사용
  - lazy loading 적용
  - blur placeholder 추가
  - WebP 자동 변환
- **참고 문서**:
  - `docs/code-architecture.md` → "이미지 최적화" 섹션 (1597번 줄)
  - `.cursorrules` → "이미지 최적화" 섹션 (421번 줄)

#### 4-1-2. 코드 스플리팅

- **설명**: 필요한 코드만 로드하여 초기 번들 크기를 줄입니다
- **작업 내용**:
  - dynamic import 사용
  - 라우트별 자동 코드 스플리팅 (Next.js 기본 기능)
  - 큰 라이브러리는 lazy loading
- **참고 문서**: `docs/code-architecture.md` → "코드 스플리팅" 섹션 (1620번 줄)

#### 4-1-3. Server Components 최대 활용

- **설명**: 서버에서 렌더링하여 클라이언트 번들 크기를 줄입니다
- **작업 내용**:
  - 정적 콘텐츠는 Server Component로
  - 인터랙션 필요한 부분만 Client Component로
  - 'use client' 최소화
- **참고 문서**:
  - `.cursorrules` → "Server Components 우선" 섹션 (145번 줄)
  - 웹 리서치 결과: Next.js 15 Server Components 활용

#### 4-1-4. 캐시 최적화

- **설명**: 중복 요청을 줄이고 응답 속도를 높입니다
- **작업 내용**:
  - Redis 캐시 TTL 조정 (검색: 5분, 도서관: 24시간)
  - TanStack Query 클라이언트 캐시 활용
  - 캐시 키 전략 수립
- **참고 문서**: `docs/code-architecture.md` → "캐싱 전략" 섹션 (1046번 줄)

---

### 4-2. 접근성 구현

**목적**: 모든 사용자가 서비스를 이용할 수 있도록 합니다.

#### 4-2-1. 시맨틱 HTML 적용

- **설명**: 의미있는 HTML 태그를 사용합니다
- **작업 내용**:
  - `<header>`, `<main>`, `<section>`, `<article>` 사용
  - `<h1>`, `<h2>`, `<h3>` 계층 구조 유지
  - `<button>`, `<a>` 적절히 구분
- **참고 문서**:
  - `docs/design-guide.md` → "시맨틱 HTML" 섹션 (1246번 줄)
  - `.cursorrules` → "접근성" 섹션 (350번 줄)

#### 4-2-2. ARIA 레이블 추가

- **설명**: 스크린 리더 사용자를 위한 레이블을 추가합니다
- **작업 내용**:
  - `aria-label` 속성 추가 (아이콘 버튼 등)
  - `role="status"`, `aria-live="polite"` (로딩, 결과 메시지)
  - `alt` 속성 (이미지)
- **참고 문서**: `docs/design-guide.md` → "ARIA 레이블" 섹션 (1268번 줄)

#### 4-2-3. 키보드 접근성 확보

- **설명**: 마우스 없이 키보드만으로 모든 기능을 사용할 수 있게 합니다
- **작업 내용**:
  - Tab으로 모든 요소 접근 가능
  - 포커스 표시 명확히 (outline 제거 금지)
  - Enter로 버튼 실행, Esc로 모달 닫기
- **참고 문서**:
  - `docs/design-guide.md` → "키보드 접근성" 섹션 (1172번 줄)
  - `.cursorrules` → "접근성" 섹션 (389번 줄)

#### 4-2-4. 색상 대비 확인

- **설명**: WCAG AA 기준(4.5:1)을 충족하는지 확인합니다
- **작업 내용**:
  - 모든 텍스트-배경 조합 검증
  - 온라인 도구 사용 (WebAIM Contrast Checker)
  - 필요시 색상 조정
- **참고 문서**: `docs/design-guide.md` → "색상 대비" 섹션 (1139번 줄)

---

### 4-3. 보안 강화

**목적**: 사용자 데이터를 보호하고 악의적인 공격을 방지합니다.

#### 4-3-1. 환경 변수 보호

- **설명**: 민감한 정보를 코드에 노출하지 않습니다
- **작업 내용**:
  - `.env.local` 파일에 환경 변수 저장
  - `.env.example` 파일 작성 (예시 제공)
  - `.gitignore`에 `.env.local` 추가
  - Zod로 환경 변수 검증
- **참고 문서**:
  - `docs/code-architecture.md` → "환경 변수 관리" 섹션 (1746번 줄)
  - `.cursorrules` → "환경 변수" 섹션 (574번 줄)

#### 4-3-2. Input Sanitization 적용

- **설명**: 사용자 입력을 정제하여 XSS 공격을 방지합니다
- **작업 내용**:
  - `isomorphic-dompurify` 패키지 사용
  - `lib/utils/validation.ts`에 `sanitizeInput()` 함수 작성
  - 모든 사용자 입력에 적용
- **참고 문서**:
  - `docs/code-architecture.md` → "XSS 방지" 섹션 (1818번 줄)
  - `.cursorrules` → "Input Sanitization" 섹션 (612번 줄)

#### 4-3-3. Rate Limiting 테스트

- **설명**: API 호출 제한이 정상 작동하는지 확인합니다
- **작업 내용**:
  - 1분에 10회 초과 요청 시 429 에러 확인
  - 에러 메시지 사용자 친화적으로 표시
- **참고 문서**: `docs/code-architecture.md` → "Rate Limiting" 섹션 (1000번 줄)

#### 4-3-4. CORS 설정

- **설명**: 허용된 도메인에서만 API 호출 가능하게 합니다
- **작업 내용**:
  - `next.config.ts`에 headers 설정
  - Vercel 도메인만 허용
- **참고 문서**: `docs/code-architecture.md` → "CORS 설정" 섹션 (1798번 줄)

---

### 4-4. 배포 준비

**목적**: Vercel에 배포하기 위한 설정을 완료합니다.

#### 4-4-1. Vercel 계정 생성 및 프로젝트 연결

- **설명**: Vercel 플랫폼에 프로젝트를 등록합니다
- **작업 내용**:
  1. Vercel 계정 생성 ([https://vercel.com](https://vercel.com))
  2. GitHub 저장소 연동
  3. Import Project
  4. Framework Preset: Next.js 자동 감지
- **참고 문서**: `docs/code-architecture.md` → "Vercel 배포" 섹션 (1863번 줄)

#### 4-4-2. 환경 변수 설정

- **설명**: Vercel Dashboard에서 환경 변수를 등록합니다
- **작업 내용**:
  - Project Settings → Environment Variables
  - `UPSTASH_REDIS_REST_URL` 추가
  - `UPSTASH_REDIS_REST_TOKEN` 추가
  - Production, Preview, Development 환경 모두 설정
- **참고 문서**: `docs/code-architecture.md` → "환경 변수 설정" 섹션 (1880번 줄)

#### 4-4-3. vercel.json 설정 파일 작성

- **설명**: Vercel 배포 설정을 커스터마이징합니다
- **작업 내용**:
  - 빌드 명령어 설정
  - Serverless Functions 설정 (maxDuration: 60초)
  - 리전 설정 (icn1 - 서울)
- **참고 문서**: `docs/code-architecture.md` → "빌드 설정" 섹션 (1889번 줄)

#### 4-4-4. 프로덕션 빌드 테스트

- **설명**: 배포 전에 로컬에서 프로덕션 빌드를 테스트합니다
- **작업 내용**:
  - `pnpm build` 명령어 실행
  - 빌드 에러 확인 및 수정
  - `pnpm start`로 프로덕션 모드 실행
  - 모든 기능 정상 작동 확인
- **참고 문서**: `docs/code-architecture.md` → "개발 서버 실행" 섹션 (2136번 줄)

---

## Phase 5: 테스트 및 배포 ✅

**소요 시간**: 1주  
**목표**: 품질 검증 및 프로덕션 배포

### 5-1. 테스트 및 QA

**목적**: 버그를 찾고 사용자 경험을 개선합니다.

#### 5-1-1. 기능 테스트

- **설명**: 모든 기능이 정상 작동하는지 확인합니다
- **테스트 체크리스트**:
  - 제목만 입력하여 검색
  - 저자만 입력하여 검색
  - 출판사만 입력하여 검색
  - 제목 + 저자 조합 검색
  - 검색 결과 표시 (도서 정보 + 도서관 목록)
  - 도서관 카드의 배지 색상 (대출가능/대출중)
  - 상세보기 버튼 클릭 (외부 링크)
  - 위치 권한 허용 시 거리 표시
  - 위치 권한 거부 시 동작
  - 정렬 변경 (거리순/대출가능 우선)
  - 필터 적용 (대출 가능만 보기)
  - 최근 검색어 저장 및 재검색
  - 검색 결과 없음 화면
  - 네트워크 오류 화면
- **참고 문서**: `docs/wireframes.md` 전체

#### 5-1-2. 반응형 테스트

- **설명**: 다양한 기기에서 정상 표시되는지 확인합니다
- **테스트 환경**:
  - 모바일 (360px - iPhone SE)
  - 태블릿 (768px - iPad)
  - 데스크톱 (1920px)
- **체크리스트**:
  - 레이아웃 깨짐 없음
  - 버튼 크기 충분 (44px)
  - 텍스트 가독성
  - 스크롤 정상 작동
- **참고 문서**: `docs/design-guide.md` → "반응형 디자인" 섹션 (1331번 줄)

#### 5-1-3. 접근성 테스트

- **설명**: 접근성 기준을 충족하는지 확인합니다
- **테스트 도구**:
  - Lighthouse (Chrome DevTools)
  - axe DevTools
  - 키보드 내비게이션 직접 테스트
- **체크리스트**:
  - Lighthouse 접근성 점수 90점 이상
  - 색상 대비 WCAG AA 통과
  - 키보드로 모든 요소 접근 가능
  - 스크린 리더 테스트 (NVDA/VoiceOver)
- **참고 문서**: `docs/design-guide.md` → "접근성" 섹션 (1136번 줄)

#### 5-1-4. 성능 테스트

- **설명**: 로딩 속도와 성능을 측정합니다
- **측정 도구**:
  - Lighthouse Performance
  - WebPageTest
  - Vercel Speed Insights
- **목표 지표**:
  - First Contentful Paint (FCP) < 1.8초
  - Largest Contentful Paint (LCP) < 2.5초
  - Time to Interactive (TTI) < 3.8초
  - Cumulative Layout Shift (CLS) < 0.1
- **참고 문서**: 웹 리서치 결과 - Next.js 15 성능 최적화

#### 5-1-5. 크롤링 안정성 테스트

- **설명**: 웹 크롤링이 안정적으로 작동하는지 확인합니다
- **테스트 시나리오**:
  - 정상 응답 (200 OK)
  - 도서관 사이트 응답 없음 (타임아웃)
  - 429 Too Many Requests (재시도 로직)
  - HTML 구조 변경 시 에러 핸들링
  - 병렬 크롤링 정상 작동
- **참고 문서**: 
  - `docs/code-architecture.md` → "에러 처리 및 재시도" 섹션 (962번 줄)
  - 웹 리서치 결과 - Cheerio 크롤링 모범 사례

---

### 5-2. 배포 및 모니터링

**목적**: 프로덕션 환경에 배포하고 안정성을 모니터링합니다.

#### 5-2-1. 첫 배포 실행

- **설명**: Vercel에 프로덕션 배포를 합니다
- **작업 내용**:
  1. GitHub에 main 브랜치 푸시
  2. Vercel에서 자동 배포 시작
  3. 배포 로그 확인 (에러 없는지)
  4. 배포 완료 후 URL 확인
- **참고 문서**: `docs/code-architecture.md` → "Vercel 배포" 섹션 (1863번 줄)
- **예상 배포 URL**: `https://cheok.vercel.app`

#### 5-2-2. Vercel Analytics 설정

- **설명**: 사용자 분석 데이터를 수집합니다
- **작업 내용**:
  - `@vercel/analytics` 패키지 설치
  - `app/layout.tsx`에 `<Analytics />` 컴포넌트 추가
  - Vercel Dashboard에서 분석 데이터 확인
- **참고 문서**: `docs/code-architecture.md` → "Vercel Analytics" 섹션 (1968번 줄)

#### 5-2-3. Speed Insights 설정

- **설명**: 실제 사용자 경험 성능을 측정합니다
- **작업 내용**:
  - `@vercel/speed-insights` 패키지 설치
  - `app/layout.tsx`에 `<SpeedInsights />` 컴포넌트 추가
  - Real User Monitoring (RUM) 데이터 확인
- **참고 문서**: `docs/code-architecture.md` → "Speed Insights" 섹션 (1985번 줄)

#### 5-2-4. 에러 모니터링 설정

- **설명**: 프로덕션 환경의 에러를 추적합니다
- **작업 내용**:
  - Vercel의 Runtime Logs 확인
  - 에러 발생 시 알림 설정
  - 주기적으로 에러 로그 검토
- **참고 문서**: 웹 리서치 결과 - Next.js 15 observability

---

## 🔮 향후 확장 계획 (MVP 이후)

MVP 출시 후 사용자 피드백을 반영하여 순차적으로 추가할 기능들입니다.

### 알림 기능

- **대출 가능 알림**: 대출 중인 책이 반납되면 사용자에게 Web Push 알림
- **신간 알림**: 관심 분야 신간 입고 시 알림
- **기술 스택**: Web Push API, Upstash QStash, Vercel Cron Jobs
- **참고 문서**: `docs/service-proposal.md` → "Phase 2: 알림 기능" (491번 줄), `docs/code-architecture.md` → "Phase 2" (2161번 줄)

### 지도 기반 위치 서비스

- **도서관 지도 뷰**: 카카오맵으로 24개 도서관 위치 시각화
- **길찾기 연동**: 카카오맵/네이버 지도 앱 실행, 경로 안내
- **반경 검색**: 1km/3km/5km 내 도서관 필터링
- **기술 스택**: Kakao Maps JavaScript SDK 2.7.9
- **참고 문서**: `docs/service-proposal.md` → "Phase 3" (496번 줄), `docs/code-architecture.md` → "Kakao Maps API" (340번 줄)

### 사용자 기능 강화

- **회원 시스템**: NextAuth.js 기반 로그인/회원가입
- **검색 이력**: 클라우드 저장 및 동기화
- **즐겨찾기**: 자주 가는 도서관 등록
- **위시리스트**: 읽고 싶은 책 목록 관리
- **독서 기록**: 읽은 책 이력 관리
- **기술 스택**: NextAuth.js v5, Vercel Postgres
- **참고 문서**: `docs/service-proposal.md` → "Phase 4" (537번 줄), `docs/code-architecture.md` → "Phase 4" (2244번 줄)

### 지역 확대

- **인접 구 확장**: 강남구, 강동구, 광진구 도서관 추가
- **서울시 전역**: 192개 공공도서관으로 확대
- **전국 단위**: 전국 도서관으로 확장
- **지역 선택**: 사용자가 검색할 지역 선택 가능
- **참고 문서**: `docs/service-proposal.md` → "Phase 6" (547번 줄), `docs/code-architecture.md` → "Phase 5" (2257번 줄)

### 커뮤니티 기능

- **도서 리뷰**: 사용자 리뷰 및 평점
- **독서 모임**: 지역별 독서 모임 정보
- **추천 시스템**: AI 기반 도서 추천
- **참고 문서**: `docs/service-proposal.md` → "Phase 7" (553번 줄)

---

## 📝 참고 문서 목록

- **서비스 기획안**: `docs/service-proposal.md` - 서비스 목적, 기능, 사용자 시나리오
- **와이어프레임**: `docs/wireframes.md` - 화면 구성, UI 레이아웃
- **디자인 가이드**: `docs/design-guide.md` - 색상, 폰트, 컴포넌트 스타일
- **코드 아키텍처**: `docs/code-architecture.md` - 기술 스택, 폴더 구조, API 설계
- **프로젝트 규칙**: `.cursorrules` - TypeScript 규칙, 스타일링, 보안

---

## 🎯 MVP 개발 로드맵

### Phase별 소요 시간

- **Phase 1**: 환경 구축 및 기초 설정 (1-2주)
- **Phase 2**: 백엔드 인프라 및 크롤링 구현 (2-3주)
- **Phase 3**: 프론트엔드 구현 (2-3주)
- **Phase 4**: 최적화 및 배포 준비 (1-2주)
- **Phase 5**: 테스트 및 배포 (1주)

**총 예상 소요 시간**: 7-11주 (약 2-3개월)

### 단계별 의존성

```
Phase 1 (기초) → Phase 2 (백엔드) → Phase 3 (프론트) → Phase 4 (최적화) → Phase 5 (배포)
   ↓                ↓                   ↓                  ↓                  ↓
 환경세팅        크롤링/API          UI 구현           성능/보안          QA/출시
```

**중요**: 각 Phase는 이전 Phase가 완료되어야 시작할 수 있습니다.

---

## 💡 비개발자를 위한 가이드

### 개발 시작 전 준비물

1. **컴퓨터**: Windows, macOS, Linux 모두 가능
2. **코드 에디터**: VS Code 추천 ([https://code.visualstudio.com](https://code.visualstudio.com))
3. **GitHub 계정**: 코드 저장 및 협업 ([https://github.com](https://github.com))
4. **Vercel 계정**: 웹사이트 배포 ([https://vercel.com](https://vercel.com))
5. **Upstash 계정**: Redis 캐시 ([https://upstash.com](https://upstash.com))

### Phase별 진행 가이드

#### Phase 1에서 할 일

- Node.js 설치 (처음 한 번만)
- Next.js 프로젝트 생성 (폴더 구조 자동 생성됨)
- 디자인 시스템 파일 작성 (색상, 폰트 설정)
- 아직 화면이 보이지 않지만 기반 작업이라 중요함

#### Phase 2에서 할 일

- Upstash 계정 만들고 Redis 생성 (캐시 서버)
- 도서관 웹사이트에서 데이터 가져오는 코드 작성
- API 만들기 (프론트엔드가 데이터를 요청할 수 있는 주소)
- 이 단계부터 실제 데이터를 볼 수 있음

#### Phase 3에서 할 일

- 사용자가 보는 화면 만들기 (검색창, 결과 화면)
- 버튼, 입력 필드 등 UI 요소 만들기
- 위치 정보로 가까운 도서관 순서 정하기
- 이 단계가 끝나면 실제 서비스처럼 보임

#### Phase 4에서 할 일

- 속도 빠르게 만들기 (이미지 최적화 등)
- 장애인도 사용할 수 있게 만들기 (접근성)
- 해킹 방지 (보안)
- Vercel 배포 설정

#### Phase 5에서 할 일

- 모든 기능 테스트 (버그 찾기)
- 여러 기기에서 확인 (모바일, 태블릿, PC)
- Vercel에 배포 (실제 웹사이트로 공개)
- 방문자 수, 성능 모니터링

### 개발 진행 순서

1. **순차적 진행**: Phase 1 완료 → Phase 2 시작 → ... → Phase 5 완료
2. **문서 참고**: 각 작업마다 참고 문서와 줄 번호가 명시되어 있음
3. **막힐 때**: 공식 문서, YouTube 튜토리얼, 커뮤니티에 질문
4. **Git 활용**: 작업 완료할 때마다 commit (변경 이력 저장)
5. **정기 배포**: Phase 3부터 Vercel에 배포하여 실시간 확인

### 도움이 되는 리소스

- **Next.js 공식 문서**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React 공식 문서**: [https://react.dev](https://react.dev)
- **Tailwind CSS 문서**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **YouTube**: "Next.js 15 tutorial 한글" 검색
- **커뮤니티**: Next.js Discord, Reddit r/nextjs, 생활코딩
- **AI 도구**: ChatGPT, Claude에게 코드 질문 가능

### 예상되는 어려움과 해결법

| 어려움           | 해결법                         |
| ------------- | --------------------------- |
| 터미널 명령어 모름    | YouTube "터미널 사용법" 시청        |
| TypeScript 에러 | 에러 메시지 복사해서 구글 검색           |
| 크롤링 셀렉터 모름    | Chrome DevTools로 HTML 구조 확인 |
| 배포 실패         | Vercel 로그 확인, 공식 문서 참고      |
| 디자인 구현 어려움    | Tailwind CSS 치트시트 활용        |

---

**마지막 업데이트**: 2026-01-22  
**문의**: 프로젝트 GitHub Issues
