import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchBooks } from '@/lib/scraper'
import { getCached, setCached, CACHE_TTL } from '@/lib/cache/strategy'
import { getSearchCacheKey } from '@/lib/cache/keys'
import { checkRateLimit } from '@/lib/rate-limit'
import type { SearchParams, SearchResponse } from '@/types/search'

/**
 * 서버 사이드에서 입력 정제 (간단한 XSS 방지)
 */
function sanitizeServerInput(input: string): string {
  if (!input) return ''
  // HTML 태그와 특수 문자 제거
  return input
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/[<>'"&]/g, '') // 특수 문자 제거
    .trim()
}

/**
 * 도서 검색 API
 * 
 * GET /api/search?title=제목&author=저자&publisher=출판사
 * 
 * 최소 1개 이상의 검색 파라미터 필수
 */

// 검색 파라미터 검증 스키마
const searchParamsSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
}).refine(
  (data) => data.title || data.author || data.publisher,
  {
    message: '최소 1개 이상의 검색어를 입력해주세요 (제목, 저자, 출판사)',
  }
)

export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting 체크
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'anonymous'
    
    const { success, remaining, reset } = await checkRateLimit(ip)
    
    if (!success) {
      return NextResponse.json(
        { 
          error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          reset: reset.toISOString(),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.getTime().toString(),
          },
        }
      )
    }

    // 2. 쿼리 파라미터 추출 및 검증
    const { searchParams } = new URL(request.url)
    
    // 사용자 입력 정제 (XSS 방지)
    const params: SearchParams = {
      title: sanitizeServerInput(searchParams.get('title') || '') || undefined,
      author: sanitizeServerInput(searchParams.get('author') || '') || undefined,
      publisher: sanitizeServerInput(searchParams.get('publisher') || '') || undefined,
    }

    const validation = searchParamsSchema.safeParse(params)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // 3. 캐시 확인
    const cacheKey = getSearchCacheKey(params)
    const cached = await getCached<SearchResponse>(cacheKey)
    
    if (cached) {
      console.log('Cache hit for:', cacheKey)
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'X-RateLimit-Remaining': remaining.toString(),
        },
      })
    }

    console.log('Cache miss for:', cacheKey)

    // 4. 크롤링 실행
    const results = await searchBooks(params)

    // 5. 캐시 저장
    await setCached(cacheKey, results, CACHE_TTL.SEARCH_RESULT)

    // 6. 응답 반환
    return NextResponse.json(results, {
      headers: {
        'X-Cache': 'MISS',
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  } catch (error) {
    console.error('Search API error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}

// Serverless Function 설정
export const runtime = 'nodejs'
export const maxDuration = 60 // 60초 타임아웃
