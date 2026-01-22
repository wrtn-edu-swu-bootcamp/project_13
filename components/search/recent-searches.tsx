'use client'

import { useRouter } from 'next/navigation'
import { useRecentSearches } from '@/lib/hooks/use-recent-searches'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * 최근 검색어 컴포넌트
 * 
 * Local Storage에 저장된 최근 검색어 5개를 표시합니다.
 */
export function RecentSearches() {
  const router = useRouter()
  const { recentSearches, removeSearch, clearAll } = useRecentSearches()

  // 최근 검색어가 없으면 표시하지 않음
  if (recentSearches.length === 0) {
    return null
  }

  // 검색어 클릭 시 재검색
  const handleSearchClick = (search: typeof recentSearches[0]) => {
    const params = new URLSearchParams()
    if (search.params.title) params.append('title', search.params.title)
    if (search.params.author) params.append('author', search.params.author)
    if (search.params.publisher) params.append('publisher', search.params.publisher)

    router.push(`/results?${params.toString()}`)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>최근 검색어</CardTitle>
          <button
            onClick={clearAll}
            className="text-body-sm text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="모든 검색어 삭제"
          >
            전체 삭제
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recentSearches.map((search) => (
            <li key={search.id} className="flex items-center gap-3">
              <button
                onClick={() => handleSearchClick(search)}
                className="flex-1 text-left px-4 py-2 rounded-md hover:bg-bg-surface transition-colors text-body text-text-primary"
              >
                • {search.displayText}
              </button>
              <button
                onClick={() => removeSearch(search.id)}
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                aria-label={`${search.displayText} 삭제`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
