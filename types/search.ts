import type { BookInfo } from './book'
import type { LibraryStatus } from './library'

export interface SearchParams {
  title?: string
  author?: string
  publisher?: string
}

export interface SearchResponse {
  book: BookInfo
  libraries: LibraryStatus[]
}

// project13 스타일 검색 결과 타입
export interface BookResult {
  title: string
  author?: string
  publisher?: string
  call_number?: string
  status: string
  available: boolean
  library: string
  location?: string
  cover?: string // 책 표지 이미지 URL
}
