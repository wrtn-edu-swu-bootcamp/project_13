import type { SearchParams } from '@/types/search'

/**
 * 캐시 키 생성 함수들
 */

/**
 * 도서 검색 결과 캐시 키 생성
 * 
 * @param params 검색 파라미터
 * @returns 캐시 키 (예: "search:멋진신세계:올더스헉슬리:문학동네")
 */
export function getSearchCacheKey(params: SearchParams): string {
  const { title = '', author = '', publisher = '' } = params
  return `search:${title}:${author}:${publisher}`
}

/**
 * 도서관 목록 캐시 키 생성
 * 
 * @returns 캐시 키 ("libraries")
 */
export function getLibrariesCacheKey(): string {
  return 'libraries'
}

/**
 * 도서 정보 캐시 키 생성
 * 
 * @param isbn 도서 ISBN
 * @returns 캐시 키 (예: "book:9788937460883")
 */
export function getBookCacheKey(isbn: string): string {
  return `book:${isbn}`
}
