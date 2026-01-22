import * as cheerio from 'cheerio'
import type { BookInfo } from '@/types/book'
import type { LibraryStatus, LibraryType } from '@/types/library'
import { LIBRARIES } from '@/lib/constants/libraries'
import { cleanText, decodeHtmlEntities } from './utils'

/**
 * HTML 파싱 유틸리티
 */

/**
 * 도서관 이름으로 도서관 타입 판별
 * 
 * @param libraryName 도서관 이름
 * @returns 도서관 타입
 */
export function determineLibraryType(libraryName: string): LibraryType {
  if (libraryName.includes('스마트')) return 'smart'
  if (libraryName.includes('교육청') || libraryName === '송파도서관') return 'education'
  return 'public'
}

/**
 * 도서관 이름으로 도서관 ID 찾기
 * 
 * @param libraryName 도서관 이름
 * @returns 도서관 ID 또는 null
 */
export function findLibraryId(libraryName: string): string | null {
  const library = LIBRARIES.find((lib) => 
    lib.name === libraryName || lib.name.includes(libraryName)
  )
  return library?.id || null
}

/**
 * 대출 상태 문자열을 표준 상태로 변환
 * 
 * @param statusText 대출 상태 텍스트
 * @returns 표준 대출 상태
 */
export function parseAvailabilityStatus(
  statusText: string
): 'available' | 'on-loan' | 'in-library-only' {
  const text = statusText.toLowerCase().trim()

  if (
    text.includes('대출가능') ||
    text.includes('대출 가능') ||
    text.includes('available')
  ) {
    return 'available'
  }

  if (
    text.includes('관내열람') ||
    text.includes('열람만') ||
    text.includes('in-library')
  ) {
    return 'in-library-only'
  }

  return 'on-loan'
}

/**
 * 반납 예정일 파싱
 * 
 * @param dueDateText 반납 예정일 텍스트
 * @returns YYYY-MM-DD 형식의 날짜 또는 null
 */
export function parseDueDate(dueDateText: string): string | null {
  if (!dueDateText || dueDateText.trim() === '') return null

  // YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD 형식 찾기
  const dateMatch = dueDateText.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/)
  
  if (dateMatch) {
    const [, year, month, day] = dateMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return null
}

/**
 * Cheerio로 로드된 HTML에서 텍스트 추출 및 정리
 * 
 * @param $element Cheerio 엘리먼트
 * @returns 정리된 텍스트
 */
export function extractText($element: cheerio.Cheerio<any>): string {
  const text = $element.text()
  return cleanText(decodeHtmlEntities(text))
}
