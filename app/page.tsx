'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SearchForm } from '@/components/search/search-form'
import { RecentSearches } from '@/components/search/recent-searches'
import { useRecentSearches } from '@/lib/hooks/use-recent-searches'
import { LIBRARY_STATS } from '@/lib/constants/libraries'
import type { SearchParams } from '@/types/search'

export default function HomePage() {
  const { addSearch } = useRecentSearches()

  const handleSearch = (params: SearchParams) => {
    // 최근 검색어에 추가
    addSearch(params)
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="container-responsive py-8 md:py-12">
        {/* 헤더 */}
        <header className="text-center space-y-3 mb-8">
          <h1 className="text-h1 font-bold text-primary">
            책크 📚
          </h1>
          <p className="text-h2 text-text-primary">
            송파구 도서관 통합 검색
          </p>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            송파구 내 {LIBRARY_STATS.total}개 도서관의 도서 소장 및 대출 가능 여부를
            한 번에 검색하세요
          </p>
        </header>

        {/* 검색 폼 - 메인 컨텐츠로 강조 */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>

        {/* 최근 검색어 */}
        <div className="mb-8 max-w-3xl mx-auto">
          <RecentSearches />
        </div>

        {/* 안내 메시지 및 통계 */}
        <div className="max-w-3xl mx-auto space-y-4">
          {/* 사용 팁 */}
          <div className="p-4 bg-primary-lighter rounded-lg text-center">
            <p className="text-body text-text-primary">
              💡 여러 검색어를 함께 입력하면 더 정확한 검색 결과를 얻을 수 있습니다
            </p>
          </div>

          {/* 간소화된 통계 */}
          <div className="flex items-center justify-center gap-4 flex-wrap text-body-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Badge variant="library-public">공공</Badge>
              <span>{LIBRARY_STATS.public}개</span>
            </div>
            <span className="text-text-tertiary">·</span>
            <div className="flex items-center gap-2">
              <Badge variant="library-smart">스마트</Badge>
              <span>{LIBRARY_STATS.smart}개</span>
            </div>
            <span className="text-text-tertiary">·</span>
            <div className="flex items-center gap-2">
              <Badge variant="library-education">교육청</Badge>
              <span>{LIBRARY_STATS.education}개</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
