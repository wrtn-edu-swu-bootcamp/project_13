'use client'

import { useQuery } from '@tanstack/react-query'
import type { SearchParams, SearchResponse } from '@/types/search'

/**
 * 도서 검색 API 훅
 * 
 * @param params - 검색 파라미터 (title, author, publisher)
 * @param enabled - 쿼리 활성화 여부 (최소 1개 이상 입력 시 true)
 */
export function useSearch(params: SearchParams, enabled: boolean = true) {
  const { title, author, publisher } = params

  return useQuery<SearchResponse>({
    queryKey: ['search', title, author, publisher],
    queryFn: async () => {
      // 쿼리 파라미터 생성
      const searchParams = new URLSearchParams()
      if (title) searchParams.append('title', title)
      if (author) searchParams.append('author', author)
      if (publisher) searchParams.append('publisher', publisher)

      const response = await fetch(`/api/search?${searchParams.toString()}`)

      if (!response.ok) {
        const error = await response.json()
        
        // Rate limiting 에러 처리
        if (response.status === 429) {
          throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
        }
        
        // 일반 에러 처리
        throw new Error(error.error || '검색 중 오류가 발생했습니다.')
      }

      return response.json()
    },
    enabled: enabled && (!!title || !!author || !!publisher),
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  })
}
