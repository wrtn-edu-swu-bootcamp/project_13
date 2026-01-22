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
 * URL: https://splib.sen.go.kr
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
    // 실제 검색 URL: https://splib.sen.go.kr/splib/intro/search/index.do
    const searchUrl = new URL('https://splib.sen.go.kr/splib/intro/search/index.do')
    
    // 필수 파라미터 추가
    searchUrl.searchParams.set('menu_idx', '4')
    searchUrl.searchParams.set('locExquery', '111030')
    searchUrl.searchParams.set('editMode', 'normal')
    searchUrl.searchParams.set('officeNm', '송파도서관')
    searchUrl.searchParams.set('mainSearchType', 'on')
    
    // 검색어 조합 (제목 + 저자)
    let searchText = ''
    if (title) searchText = title
    if (author) searchText += (searchText ? ' ' : '') + author
    if (publisher) searchText += (searchText ? ' ' : '') + publisher
    
    if (searchText) {
      searchUrl.searchParams.set('search_text', searchText)
    }

    console.log('Scraping Education Library:', searchUrl.toString())

    // HTML 가져오기
    const html = await fetchWithRetry(searchUrl.toString())
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
    // 검색 결과에서 첫 번째 도서 항목 찾기
    // external_links에서 확인한 실제 구조를 반영
    
    // 다양한 선택자 시도
    let title = ''
    let author = ''
    let publisher = ''
    let year = ''
    let isbn = ''
    let cover = ''
    
    // 전체 페이지 텍스트에서 정보 추출 (가장 유연한 방법)
    const bodyText = $('body').text()
    
    // 도서 제목 추출 - 첫 번째 주요 링크나 제목
    const titleSelectors = [
      'h3 a', 'h2 a', '.title a', 'a[href*="detail"]',
      'td a', 'div[class*="book"] a', 'div[class*="result"] a'
    ]
    
    for (const selector of titleSelectors) {
      const titleElem = $(selector).first()
      if (titleElem.length > 0) {
        title = extractText(titleElem)
        if (title && title.length > 2) {
          console.log(`Found title with selector '${selector}': ${title}`)
          break
        }
      }
    }
    
    // 제목을 못 찾았으면 텍스트 패턴으로 시도
    if (!title) {
      // "도서." 다음에 오는 제목 패턴
      const titlePattern = bodyText.match(/도서\.\s*([^\n]+?)(?:\s+저자|$)/i)
      if (titlePattern) {
        title = titlePattern[1].trim()
        console.log(`Found title with pattern: ${title}`)
      }
    }
    
    if (!title) {
      console.log('No title found, attempting to extract from body text')
      console.log('First 500 chars:', bodyText.substring(0, 500))
      return null
    }
    
    // 저자 추출
    const authorMatch = bodyText.match(/저자[:\s]*([^발행]+?)(?:\s+발행처|$)/i)
    if (authorMatch) {
      author = authorMatch[1].trim()
    }
    
    // 출판사 추출  
    const publisherMatch = bodyText.match(/발행처[:\s]*([^발행년도]+?)(?:\s+발행년도|$)/i)
    if (publisherMatch) {
      publisher = publisherMatch[1].trim()
    }
    
    // 발행연도 추출
    const yearMatch = bodyText.match(/발행년도[:\s]*(\d{4})/i)
    if (yearMatch) {
      year = yearMatch[1]
    }
    
    // ISBN 추출
    const isbnMatch = bodyText.match(/ISBN[:\s]*([\d\-]+)/i)
    if (isbnMatch) {
      isbn = isbnMatch[1].replace(/\-/g, '')
    }
    
    // 책 표지 이미지
    const coverImg = $('img[src*="cover"], img[src*="book"]').first()
    cover = coverImg.attr('src') || ''

    return {
      title,
      author,
      publisher,
      year,
      isbn,
      cover,
      description: '',
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

    // 전체 페이지 텍스트에서 소장 정보 추출
    const bodyText = $('body').text()
    
    // 청구기호 추출
    let callNumber = ''
    const callNumberMatch = bodyText.match(/청구기호[:\s]*([\d\-가-힣a-zA-Z.]+)/i)
    if (callNumberMatch) {
      callNumber = callNumberMatch[1].trim()
    }
    
    // 소장 위치 추출 (예: [송파]2층 어문학실)
    let location = ''
    const locationMatch = bodyText.match(/도서관[:\s]*송파도서관\s+자료실[:\s]*(\[송파\][^\n]+)/i) ||
                         bodyText.match(/자료실[:\s]*(\[송파\][^\n]+?)(?:\s+자료상태|$)/i) ||
                         bodyText.match(/\[송파\][^\n\r]+?(?:실|서고)/i)
    if (locationMatch) {
      location = locationMatch[1]?.trim() || locationMatch[0].trim()
    }
    
    // 대출 상태 추출 (예: 대출가능, 대출중)
    let statusText = ''
    const statusMatch = bodyText.match(/자료상태[:\s]*([^\n]+?)(?:\n|도서대출|관심도서|$)/i) ||
                       bodyText.match(/(대출가능|대출중|대출불가|비치중)/i)
    if (statusMatch) {
      statusText = statusMatch[1]?.trim() || statusMatch[0].trim()
    }
    
    // 반납 예정일 추출 (대출중인 경우)
    let dueDateText = ''
    if (statusText.includes('대출중')) {
      const dueDateMatch = bodyText.match(/반납예정[:\s]*(\d{4}[-./]\d{2}[-./]\d{2})/i)
      if (dueDateMatch) {
        dueDateText = dueDateMatch[1]
      }
    }

    const status = parseAvailabilityStatus(statusText)
    const isAvailable = status === 'available'
    const dueDate = parseDueDate(dueDateText)
    const hasBook = true // 검색 결과에 나타났다면 소장 중
    
    console.log(`Education lib holding: location='${location}', status='${statusText}', callNumber='${callNumber}'`)

    return [
      {
        libraryId: library.id,
        libraryName: library.name,
        libraryType: library.type,
        hasBook,
        isAvailable,
        status,
        dueDate,
        location,
        callNumber,
        address: library.address,
        phone: library.phone,
        hours: library.hours,
        url: library.url,
        lat: library.lat,
        lng: library.lng,
      },
    ]
  } catch (error) {
    console.error('Error extracting holding status from education lib:', error)
    return []
  }
}
