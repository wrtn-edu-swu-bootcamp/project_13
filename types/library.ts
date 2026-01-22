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
}

export interface LibraryStatus extends Library {
  hasBook: boolean
  isAvailable: boolean
  status: 'available' | 'on-loan' | 'in-library-only'
  dueDate: string | null
  location: string
  callNumber: string
  distance?: number
}
