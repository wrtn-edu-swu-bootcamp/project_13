import type { BookInfo } from '@/types/book'
import type { LibraryStatus } from '@/types/library'
import type { SearchParams, SearchResponse } from '@/types/search'
import { scrapeSongpaUnified } from './songpa-unified'
import { scrapeEducationLib } from './education-lib'

/**
 * 크롤러 통합 및 병렬 처리
 */

/**
 * 모든 도서관에서 도서 검색
 * 
 * 2개의 크롤러를 병렬로 실행하여 성능 향상:
 * 1. 송파구통합도서관 (23개 도서관)
 * 2. 교육청도서관 (1개 도서관)
 * 
 * @param params 검색 파라미터
 * @returns 도서 정보 및 모든 도서관의 소장 상태
 */
export async function searchBooks(params: SearchParams): Promise<SearchResponse> {
  try {
    console.log('Starting parallel scraping for:', params)
    const startTime = Date.now()

    // 병렬 크롤링 실행
    const [songpaResult, eduResult] = await Promise.all([
      scrapeSongpaUnified(params),
      scrapeEducationLib(params),
    ])

    const elapsed = Date.now() - startTime
    console.log(`Scraping completed in ${elapsed}ms`)

    // 도서 정보 병합 (송파구통합도서관 우선, 없으면 교육청)
    const book = songpaResult.book || eduResult.book

    if (!book) {
      throw new Error('No book found')
    }

    // 도서관 소장 정보 병합
    const libraries = mergeLibraryStatuses([
      ...songpaResult.libraries,
      ...eduResult.libraries,
    ])

    return {
      book,
      libraries,
    }
  } catch (error) {
    console.error('Search books error:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search books'
    )
  }
}

/**
 * 도서관 소장 정보 병합 및 정규화
 * 
 * @param statuses 도서관 상태 배열
 * @returns 병합된 도서관 상태 배열
 */
function mergeLibraryStatuses(statuses: LibraryStatus[]): LibraryStatus[] {
  // 중복 제거 (같은 도서관 ID)
  const uniqueStatuses = new Map<string, LibraryStatus>()

  for (const status of statuses) {
    if (!uniqueStatuses.has(status.libraryId)) {
      uniqueStatuses.set(status.libraryId, status)
    }
  }

  // 배열로 변환 및 정렬 (대출 가능 우선)
  return Array.from(uniqueStatuses.values()).sort((a, b) => {
    // 1순위: 대출 가능 여부
    if (a.isAvailable !== b.isAvailable) {
      return a.isAvailable ? -1 : 1
    }

    // 2순위: 소장 여부
    if (a.hasBook !== b.hasBook) {
      return a.hasBook ? -1 : 1
    }

    // 3순위: 도서관 이름 (가나다순)
    return a.libraryName.localeCompare(b.libraryName, 'ko')
  })
}

/**
 * 단일 크롤러 테스트용 함수
 * 
 * @param source 크롤러 소스 ('songpa' | 'education')
 * @param params 검색 파라미터
 * @returns 크롤링 결과
 */
export async function testScraper(
  source: 'songpa' | 'education',
  params: SearchParams
) {
  if (source === 'songpa') {
    return await scrapeSongpaUnified(params)
  } else {
    return await scrapeEducationLib(params)
  }
}
