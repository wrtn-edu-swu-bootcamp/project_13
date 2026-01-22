import * as cheerio from 'cheerio'
import type { BookInfo } from '@/types/book'
import type { LibraryStatus } from '@/types/library'
import type { SearchParams } from '@/types/search'
import { fetchWithRetry } from './utils'
import {
  extractText,
  determineLibraryType,
  findLibraryId,
  parseAvailabilityStatus,
  parseDueDate,
} from './parser'
import { LIBRARIES } from '@/lib/constants/libraries'

/**
 * 송파구통합도서관 크롤러
 * 
 * URL: https://www.splibrary.or.kr
 * 대상: 공공도서관 14개 + 스마트도서관 9개 (총 23개)
 * 
 * ⚠️ 주의: 실제 웹사이트 구조를 확인하고 CSS 셀렉터를 수정해야 합니다.
 * 1. https://www.splibrary.or.kr 접속
 * 2. 검색 기능 테스트
 * 3. Chrome DevTools로 HTML 구조 확인
 * 4. 네트워크 탭에서 검색 API 엔드포인트 확인
 * 5. 아래 셀렉터들을 실제 구조에 맞게 수정
 */

/**
 * 송파구통합도서관에서 도서 검색
 * 
 * @param params 검색 파라미터
 * @returns 도서 정보 및 도서관별 소장 상태
 */
export async function scrapeSongpaUnified(params: SearchParams): Promise<{
  book: BookInfo | null
  libraries: LibraryStatus[]
}> {
  const { title, author, publisher } = params

  try {
    // TODO: 실제 검색 URL 확인 필요
    // 예상 URL 패턴: https://www.splibrary.or.kr/search/searchResult.do?q={title}
    const searchUrl = new URL('https://www.splibrary.or.kr/search/searchResult.do')
    
    // 검색 파라미터 추가 (실제 파라미터명 확인 필요)
    if (title) searchUrl.searchParams.set('q', title)
    if (author) searchUrl.searchParams.set('author', author)
    if (publisher) searchUrl.searchParams.set('publisher', publisher)

    console.log('Scraping Songpa Unified Library:', searchUrl.toString())

    // HTML 가져오기
    const response = await fetchWithRetry(searchUrl.toString())
    const html = await response.text()
    const $ = cheerio.load(html)

    // TODO: 실제 HTML 구조 확인 후 셀렉터 수정
    // 현재는 예상 구조로 작성됨

    // 도서 기본 정보 추출
    const bookInfo: BookInfo | null = extractBookInfo($)

    // 도서관별 소장 정보 추출
    const libraries: LibraryStatus[] = extractLibraryStatuses($, bookInfo)

    return {
      book: bookInfo,
      libraries,
    }
  } catch (error) {
    console.error('Songpa Unified scraping error:', error)
    
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
    // 예상 HTML 구조:
    // <div class="book-detail">
    //   <h2 class="book-title">멋진 신세계</h2>
    //   <p class="book-author">올더스 헉슬리</p>
    //   <p class="book-publisher">문학동네</p>
    //   <img class="book-cover" src="...">
    // </div>

    const title = extractText($('.book-title').first())
    const author = extractText($('.book-author').first())
    const publisher = extractText($('.book-publisher').first())
    const year = extractText($('.book-year').first())
    const isbn = extractText($('.book-isbn').first())
    const cover = $('.book-cover').first().attr('src') || ''
    const description = extractText($('.book-description').first())

    // 최소한 제목이 있어야 유효한 도서 정보
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
    console.error('Error extracting book info:', error)
    return null
  }
}

/**
 * 도서관별 소장 정보 추출
 * 
 * @param $ Cheerio 인스턴스
 * @param bookInfo 도서 정보
 * @returns 도서관 상태 배열
 */
function extractLibraryStatuses(
  $: cheerio.CheerioAPI,
  bookInfo: BookInfo | null
): LibraryStatus[] {
  const statuses: LibraryStatus[] = []

  try {
    // TODO: 실제 셀렉터 확인 필요
    // 예상 HTML 구조:
    // <table class="library-holdings">
    //   <tr class="library-row">
    //     <td class="library-name">송파글마루도서관</td>
    //     <td class="location">종합자료실</td>
    //     <td class="call-number">843.6-H</td>
    //     <td class="status available">대출가능</td>
    //     <td class="due-date"></td>
    //   </tr>
    // </table>

    $('.library-row').each((i, row) => {
      const $row = $(row)

      const libraryName = extractText($row.find('.library-name'))
      const location = extractText($row.find('.location'))
      const callNumber = extractText($row.find('.call-number'))
      const statusText = extractText($row.find('.status'))
      const dueDateText = extractText($row.find('.due-date'))

      // 도서관 정보 찾기
      const libraryId = findLibraryId(libraryName)
      if (!libraryId) {
        console.warn(`Unknown library: ${libraryName}`)
        return // continue
      }

      const library = LIBRARIES.find((lib) => lib.id === libraryId)
      if (!library) return

      // 대출 상태 파싱
      const status = parseAvailabilityStatus(statusText)
      const hasBook = statusText !== '' && statusText !== '미소장'
      const isAvailable = status === 'available'
      const dueDate = parseDueDate(dueDateText)

      statuses.push({
        ...library,
        hasBook,
        isAvailable,
        status,
        dueDate,
        location,
        callNumber,
      })
    })

    return statuses
  } catch (error) {
    console.error('Error extracting library statuses:', error)
    return []
  }
}
