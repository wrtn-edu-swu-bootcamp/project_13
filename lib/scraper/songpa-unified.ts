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
 * URL: https://www.splib.or.kr
 * 대상: 공공도서관 14개 + 스마트도서관 9개 (총 23개)
 * 
 * ⚠️ 주의: 실제 웹사이트 구조를 확인하고 CSS 셀렉터를 수정해야 합니다.
 * 1. https://www.splib.or.kr 접속
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
    // 실제 검색 URL: https://www.splib.or.kr/intro/program/plusSearchResultList.do (GET 방식)
    const searchUrl = new URL('https://www.splib.or.kr/intro/program/plusSearchResultList.do')
    
    // 검색어 조합 (제목 + 저자 + 출판사)
    let searchText = ''
    if (title) searchText = title
    if (author) searchText += (searchText ? ' ' : '') + author
    if (publisher) searchText += (searchText ? ' ' : '') + publisher
    
    // 필수 검색 파라미터 추가
    searchUrl.searchParams.set('searchType', 'SIMPLE')
    searchUrl.searchParams.set('searchCategory', 'BOOK')
    searchUrl.searchParams.set('searchKey', 'ALL')
    searchUrl.searchParams.set('searchLibrary', 'ALL')
    
    if (searchText) {
      searchUrl.searchParams.set('searchKeyword', searchText)
    }

    console.log('Scraping Songpa Unified Library:', searchUrl.toString())

    // HTML 가져오기
    const html = await fetchWithRetry(searchUrl.toString())
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
    // .bookList ul.listWrap > li 구조에서 첫 번째 도서 찾기
    const $bookList = $('.bookList')
    const $firstItem = $bookList.find('li:not(.noResultNote)').first()
    
    if ($firstItem.length === 0) {
      console.log('No search results found in Songpa Unified')
      return null
    }

    // 제목 추출: .book_name .title
    let title = ''
    const $titleEl = $firstItem.find('.book_name .title')
    if ($titleEl.length > 0) {
      title = extractText($titleEl)
      // "1. 이방인" 형식에서 번호 제거
      title = title.replace(/^\d+\.\s*/, '')
    }
    
    // 저자 추출: .book_info.info01
    let author = ''
    const $authorEl = $firstItem.find('.book_info.info01')
    if ($authorEl.length > 0) {
      author = extractText($authorEl)
      // "지음" 등의 텍스트 정리
      author = author.replace(/\s*지음\s*;.*$/, '').trim()
    }
    
    // 출판사 추출: .book_info.info02 span
    let publisher = ''
    const $publisherEl = $firstItem.find('.book_info.info02 span').first()
    if ($publisherEl.length > 0) {
      publisher = extractText($publisherEl)
    }
    
    // 발행연도 추출: .book_info.info02에서
    let year = ''
    const info02Text = $firstItem.find('.book_info.info02').text()
    const yearMatch = info02Text.match(/(\d{4})/i)
    if (yearMatch) {
      year = yearMatch[1]
    }
    
    // ISBN 추출
    let isbn = ''
    const itemText = $firstItem.text()
    const isbnMatch = itemText.match(/ISBN[:\s]*([\d\-]+)/i)
    if (isbnMatch) {
      isbn = isbnMatch[1]
    }
    
    // 책 표지 이미지: .bookImg img
    const $coverImg = $firstItem.find('.bookImg img')
    let cover = $coverImg.attr('src') || ''
    if (cover && !cover.startsWith('http') && !cover.includes('noimg')) {
      cover = 'https://www.splib.or.kr' + (cover.startsWith('/') ? '' : '/') + cover
    } else if (cover.includes('noimg')) {
      cover = '' // 기본 이미지는 사용하지 않음
    }

    if (!title) {
      console.log('No title found in Songpa Unified result')
      return null
    }
    
    console.log(`Songpa Unified book found: "${title}" by ${author}`)

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
    console.error('Error extracting book info from Songpa Unified:', error)
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
    // .bookList ul.listWrap > li 구조에서 각 도서관 소장 정보 추출
    const $bookList = $('.bookList')
    const $items = $bookList.find('li:not(.noResultNote)')
    
    console.log(`Songpa Unified: Found ${$items.length} library holdings`)
    
    $items.each((i, item) => {
      const $item = $(item)
      
      // 각 li는 하나의 도서관 소장 정보를 나타냄
      const itemText = $item.text()
      
      // 도서관 이름 추출
      let libraryName = ''
      const libMatch = itemText.match(/(송파글마루도서관|송파어린이도서관|송파위례도서관|거마도서관|돌마리도서관|소나무언덕\d호도서관|송파어린이영어도서관|가락몰도서관|송이골작은도서관|소나무언덕잠실본동도서관)/i)
      if (libMatch) {
        libraryName = libMatch[1]
      }
      
      if (!libraryName) {
        // 일반적인 패턴으로 시도
        const generalMatch = itemText.match(/([\w가-힣]+도서관)/i)
        if (generalMatch) {
          libraryName = generalMatch[1]
        }
      }
      
      if (!libraryName) return
      
      // 도서관 ID 찾기
      const libraryId = findLibraryId(libraryName)
      if (!libraryId) {
        console.warn(`Unknown library in Songpa Unified: ${libraryName}`)
        return
      }
      
      const library = LIBRARIES.find((lib) => lib.id === libraryId)
      if (!library) return
      
      // 대출 상태 추출: .status 요소
      const $status = $item.find('.status')
      let status: 'available' | 'on-loan' | 'unavailable' = 'unavailable'
      
      if ($status.length > 0) {
        status = parseSongpaStatus($status)
      } else {
        // .status가 없으면 텍스트에서 추출
        if (itemText.includes('대출가능')) {
          status = 'available'
        } else if (itemText.includes('대출중')) {
          status = 'on-loan'
        }
      }
      
      const isAvailable = status === 'available'
      const hasBook = true
      
      // 청구기호 추출
      let callNumber = ''
      const callMatch = itemText.match(/청구기호[:\s]*([\d가-힣\.\-]+)/i)
      if (callMatch) {
        callNumber = callMatch[1].trim()
      }
      
      // 소장 위치 추출
      let location = ''
      const locMatch = itemText.match(/자료실[:\s]*([\w가-힣\s\(\)]+?)(?:\n|자료상태|대출|$)/i) ||
                      itemText.match(/([\w가-힣]+(?:자료실|열람실|서고))/i)
      if (locMatch) {
        location = locMatch[1].trim()
      }
      
      // 반납 예정일 추출 (대출중인 경우)
      let dueDateText = ''
      if (status === 'on-loan') {
        const dueMatch = itemText.match(/(\d{4}[-./]\d{2}[-./]\d{2})/i)
        if (dueMatch) {
          dueDateText = dueMatch[1]
        }
      }
      
      const dueDate = parseDueDate(dueDateText)
      
      console.log(`  - ${libraryName}: ${status} ${location ? `(${location})` : ''}`)
      
      statuses.push({
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
      })
    })

    return statuses
  } catch (error) {
    console.error('Error extracting library statuses from Songpa Unified:', error)
    return []
  }
}

/**
 * 송파구 도서관 대출 상태 파싱 (CSS 클래스 기반)
 * .okRent: 대출가능(비치중)
 * .noRentIng: 대출불가(대출중)
 * .noRentLoan: 대출불가(상호대차중, 전자도서관)
 */
function parseSongpaStatus($statusElement: cheerio.Cheerio<any>): 'available' | 'on-loan' | 'unavailable' {
  const $strong = $statusElement.find('strong')
  const className = $strong.attr('class') || ''
  
  if (className.includes('okRent')) {
    return 'available'
  } else if (className.includes('noRentIng')) {
    return 'on-loan'
  } else if (className.includes('noRentLoan')) {
    return 'unavailable'
  }
  
  // 텍스트 기반 폴백
  const statusText = $statusElement.text()
  if (statusText.includes('대출가능')) {
    return 'available'
  } else if (statusText.includes('대출중')) {
    return 'on-loan'
  }
  
  return 'unavailable'
}

/**
 * .status 요소가 있는 소장 정보 행 처리 (송파구 도서관 전용)
 */
function processHoldingRowWithStatus(
  $: cheerio.CheerioAPI,
  $row: cheerio.Cheerio<any>,
  $status: cheerio.Cheerio<any>,
  statuses: LibraryStatus[]
): void {
  try {
    const rowText = $row.text()
    
    // 도서관 이름 추출
    let libraryName = ''
    const cells = $row.find('td')
    
    // 첫 번째 셀에서 도서관 이름 찾기
    if (cells.length > 0) {
      libraryName = extractText(cells.first())
    }
    
    // 도서관 이름이 없으면 텍스트에서 추출 시도
    if (!libraryName || libraryName.length < 2) {
      const nameMatch = rowText.match(/([\w가-힣]+(?:도서관|스마트도서관))/i)
      if (nameMatch) {
        libraryName = nameMatch[1]
      }
    }
    
    if (!libraryName) return
    
    // 도서관 ID 찾기
    const libraryId = findLibraryId(libraryName)
    if (!libraryId) {
      console.warn(`Unknown library in Songpa Unified: ${libraryName}`)
      return
    }
    
    const library = LIBRARIES.find((lib) => lib.id === libraryId)
    if (!library) return
    
    // 송파구 전용 대출 상태 파싱
    const status = parseSongpaStatus($status)
    const isAvailable = status === 'available'
    const hasBook = true
    
    // 청구기호 추출
    let callNumber = ''
    const callNumberCell = $row.find('td').filter((i, el) => {
      const text = $(el).text()
      return /[\d]{3}[\.\-][가-힣\d]/.test(text)
    }).first()
    if (callNumberCell.length > 0) {
      callNumber = extractText(callNumberCell)
    }
    
    // 소장 위치 추출
    let location = ''
    const locationMatch = rowText.match(/([\w가-힣]+(?:자료실|열람실|서고))/i)
    if (locationMatch) {
      location = locationMatch[1]
    }
    
    // 반납 예정일 추출 (대출중인 경우)
    let dueDateText = ''
    if (status === 'on-loan') {
      const dueDateMatch = rowText.match(/(\d{4}[-./]\d{2}[-./]\d{2})/i)
      if (dueDateMatch) {
        dueDateText = dueDateMatch[1]
      }
    }
    
    const dueDate = parseDueDate(dueDateText)
    
    statuses.push({
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
    })
  } catch (error) {
    console.error('Error processing holding row with status:', error)
  }
}

/**
 * 개별 소장 정보 행 처리
 */
function processHoldingRow(
  $: cheerio.CheerioAPI,
  $row: cheerio.Cheerio<any>,
  statuses: LibraryStatus[]
): void {
  try {
    const rowText = $row.text()
    
    // 도서관 이름 추출
    let libraryName = ''
    const cells = $row.find('td, div[class*="cell"]')
    
    // 첫 번째 셀에서 도서관 이름 찾기
    if (cells.length > 0) {
      libraryName = extractText(cells.first())
    } else {
      // 텍스트에서 도서관 이름 추출 시도
      const nameMatch = rowText.match(/([\w가-힣]+(?:도서관|스마트도서관))/i)
      if (nameMatch) {
        libraryName = nameMatch[1]
      }
    }
    
    if (!libraryName) return
    
    // 도서관 ID 찾기
    const libraryId = findLibraryId(libraryName)
    if (!libraryId) {
      console.warn(`Unknown library in Songpa Unified: ${libraryName}`)
      return
    }
    
    const library = LIBRARIES.find((lib) => lib.id === libraryId)
    if (!library) return
    
    // 청구기호 추출
    let callNumber = ''
    const callNumberMatch = rowText.match(/청구기호[:\s]*([\d\-가-힣a-zA-Z.]+)/i) ||
                           rowText.match(/([\d]{3}[\.\-][가-힣\d]+)/i)
    if (callNumberMatch) {
      callNumber = callNumberMatch[1].trim()
    }
    
    // 소장 위치 추출
    let location = ''
    const locationMatch = rowText.match(/([\w가-힣]+(?:자료실|열람실|서고))/i)
    if (locationMatch) {
      location = locationMatch[1]
    }
    
    // 대출 상태 추출
    let statusText = ''
    const statusMatch = rowText.match(/(대출가능|대출중|대출불가|비치중|예약가능)/i)
    if (statusMatch) {
      statusText = statusMatch[1]
    }
    
    // 반납 예정일 추출
    let dueDateText = ''
    if (statusText.includes('대출중')) {
      const dueDateMatch = rowText.match(/(\d{4}[-./]\d{2}[-./]\d{2})/i)
      if (dueDateMatch) {
        dueDateText = dueDateMatch[1]
      }
    }
    
    const status = parseAvailabilityStatus(statusText)
    const hasBook = statusText !== '' && statusText !== '미소장'
    const isAvailable = status === 'available'
    const dueDate = parseDueDate(dueDateText)
    
    statuses.push({
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
    })
  } catch (error) {
    console.error('Error processing holding row:', error)
  }
}
