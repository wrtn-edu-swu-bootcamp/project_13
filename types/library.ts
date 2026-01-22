export type LibraryType = 'public' | 'smart' | 'education'

export interface Library {
  id: string
  name: string
  type: LibraryType
  address: string
  phone: string
  hours: string
  url: string
  lat: number
  lng: number
  distance?: number
}

export interface LibraryStatus {
  libraryId: string
  libraryName: string
  libraryType: LibraryType
  hasBook: boolean
  isAvailable: boolean
  status: string
  dueDate: string | null
  location?: string
  callNumber?: string
  distance?: number
  // 도서관 기본 정보 (선택사항)
  address?: string
  phone?: string
  hours?: string
  url?: string
  lat?: number
  lng?: number
}
