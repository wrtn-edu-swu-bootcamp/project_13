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
