'use client'

import { useQuery } from '@tanstack/react-query'
import type { Library } from '@/types/library'

interface LibrariesResponse {
  libraries: Library[]
  total: number
}

interface UseLibrariesOptions {
  lat?: number
  lng?: number
}

/**
 * 도서관 목록 API 훅
 * 
 * @param options - 위치 정보 (선택사항)
 * @param options.lat - 위도
 * @param options.lng - 경도
 */
export function useLibraries(options?: UseLibrariesOptions) {
  const { lat, lng } = options || {}

  return useQuery<LibrariesResponse>({
    queryKey: ['libraries', lat, lng],
    queryFn: async () => {
      // 위치 정보가 있으면 쿼리 파라미터에 포함
      const params = new URLSearchParams()
      if (lat !== undefined && lng !== undefined) {
        params.append('lat', lat.toString())
        params.append('lng', lng.toString())
      }

      const url = `/api/libraries${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('도서관 목록을 불러오는데 실패했습니다.')
      }

      return response.json()
    },
    staleTime: 24 * 60 * 60 * 1000, // 24시간 (도서관 정보는 자주 변하지 않음)
    retry: 2,
  })
}
