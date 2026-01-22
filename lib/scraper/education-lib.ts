import * as cheerio from 'cheerio'
import type { BookInfo } from '@/types/book'
import type { LibraryStatus } from '@/types/library'
import type { SearchParams } from '@/types/search'
import { fetchWithRetry } from './utils'
import {
  extractText,
  parseAvailabilityStatus,
  parseDueDate,
} from './parser'
import { LIBRARIES } from '@/lib/constants/libraries'

/**
 * 서울시교육청 송파도서관 크롤러
 * 
 * URL: https://songpalib.sen.go.kr
 * 대상: 송파도서관 1개
 * 
 * ⚠️ 주의: 실제 웹사이트 구조를 확인하고 CSS 셀렉터를 수정해야 합니다.
 * 송파구통합도서관과는 별도 시스템이므로 독립적인 크롤링 로직이 필요합니다.
 */

/**
 * 교육청도서관에서 도서 검색
 * 
 * @param params 검색 파라미터
 * @returns 도서 정보 및 소장 상태
 */
export async function scrapeEducationLib(params: SearchParams): Promise<{
  book: BookInfo | null
  libraries: LibraryStatus[]
}> {
  const { title, author, publisher } = params

  try {
    // TODO: 실제 검색 URL 확인 필요
    // 예상 URL 패턴: https://songpalib.sen.go.kr/search?query={title}
    const searchUrl = new URL('https://songpalib.sen.go.kr/search')
    
    // 검색 파라미터 추가 (실제 파라미터명 확인 필요)
    if (title) searchUrl.searchParams.set('query', title)
    if (author) searchUrl.searchParams.set('author', author)
    if (publisher) searchUrl.searchParams.set('publisher', publisher)

    console.log('Scraping Education Library:', searchUrl.toString())

    // HTML 가져오기
    const response = await fetchWithRetry(searchUrl.toString())
    const html = await response.text()
    const $ = cheerio.load(html)

    // 도서 기본 정보 추출
    const bookInfo: BookInfo | null = extractBookInfo($)

    // 소장 정보 추출
    const libraries: LibraryStatus[] = extractHoldingStatus($, bookInfo)

    return {
      book: bookInfo,
      libraries,
    }
  } catch (error) {
    console.error('Education Library scraping error:', error)
    
    // 크롤링 실패 시 빈 결과 반환
    return {
      book: null,
      libraries: [],
    }
  }
}

/**
 * 도서 기본 정보 추출
 * 
 * @param $ Cheerio 인스턴스
 * @returns 도서 정보 또는 null
 */
function extractBookInfo($: cheerio.CheerioAPI): BookInfo | null {
  try {
    // TODO: 실제 셀렉터 확인 필요
    // 교육청 도서관 시스템의 실제 HTML 구조에 맞게 수정

    const title = extractText($('.book-title, .title').first())
    const author = extractText($('.book-author, .author').first())
    const publisher = extractText($('.book-publisher, .publisher').first())
    const year = extractText($('.book-year, .pub-year').first())
    const isbn = extractText($('.book-isbn, .isbn').first())
    const cover = $('.book-cover, .cover-img').first().attr('src') || ''
    const description = extractText($('.book-description, .summary').first())

    if (!title) {
      return null
    }

    return {
      title,
      author,
      publisher,
      year,
      isbn,
      cover,
      description,
    }
  } catch (error) {
    console.error('Error extracting book info from education lib:', error)
    return null
  }
}

/**
 * 소장 정보 추출
 * 
 * @param $ Cheerio 인스턴스
 * @param bookInfo 도서 정보
 * @returns 도서관 상태 배열 (송파도서관 1개)
 */
function extractHoldingStatus(
  $: cheerio.CheerioAPI,
  bookInfo: BookInfo | null
): LibraryStatus[] {
  try {
    // 송파도서관 정보 가져오기
    const library = LIBRARIES.find((lib) => lib.id === 'songpa-education')
    if (!library) {
      console.error('Songpa Education Library not found in constants')
      return []
    }

    // TODO: 실제 셀렉터 확인 필요
    // 소장 여부 및 대출 상태 확인

    const hasBook = $('.holding-status, .availability').length > 0
    if (!hasBook) {
      return []
    }

    const statusText = extractText($('.status-text, .availability-status').first())
    const location = extractText($('.location, .shelf-location').first())
    const callNumber = extractText($('.call-number, .classification').first())
    const dueDateText = extractText($('.due-date, .return-date').first())

    const status = parseAvailabilityStatus(statusText)
    const isAvailable = status === 'available'
    const dueDate = parseDueDate(dueDateText)

    return [
      {
        ...library,
        hasBook: true,
        isAvailable,
        status,
        dueDate,
        location,
        callNumber,
      },
    ]
  } catch (error) {
    console.error('Error extracting holding status from education lib:', error)
    return []
  }
}
