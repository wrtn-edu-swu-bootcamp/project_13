'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookInfoCard } from '@/components/book/book-info-card'
import { LibraryCard } from '@/components/library/library-card'
import { SortOptions, type SortType } from '@/components/filter/sort-options'
import { FilterCheckbox } from '@/components/filter/filter-checkbox'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { useSearch } from '@/lib/hooks/use-search'
import { useLibraries } from '@/lib/hooks/use-libraries'
import { useLocation } from '@/lib/hooks/use-location'
import { calculateDistance } from '@/lib/utils/distance'
import type { LibraryStatus } from '@/types/library'
import type { SearchParams } from '@/types/search'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { latitude, longitude, getLocation, hasLocation, loading: locationLoading } = useLocation()

  // URL에서 검색 파라미터 추출
  const params: SearchParams = {
    title: searchParams.get('title') || undefined,
    author: searchParams.get('author') || undefined,
    publisher: searchParams.get('publisher') || undefined,
  }

  // 검색 API 호출
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearch(params, true)

  // 도서관 목록 API 호출 (위치 정보 포함)
  const { data: librariesData } = useLibraries(
    hasLocation ? { lat: latitude!, lng: longitude! } : undefined
  )

  // 정렬 및 필터 상태
  const [sortType, setSortType] = useState<SortType>('distance')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // 도서관별 소장 정보와 거리 계산
  const librariesWithStatus = useMemo(() => {
    if (!searchData?.libraries || !librariesData?.libraries) return []

    // 검색 결과와 도서관 정보 병합
    const result: LibraryStatus[] = searchData.libraries.map((searchLib) => {
      const libraryInfo = librariesData.libraries.find((lib) => lib.id === searchLib.libraryId)

      // 거리 계산
      let distance: number | undefined
      if (hasLocation && libraryInfo?.lat && libraryInfo?.lng) {
        distance = calculateDistance(
          latitude!,
          longitude!,
          libraryInfo.lat,
          libraryInfo.lng
        )
      }

      return {
        ...searchLib,
        distance,
        // 도서관 기본 정보 추가
        address: libraryInfo?.address,
        phone: libraryInfo?.phone,
        hours: libraryInfo?.hours,
        url: libraryInfo?.url,
      }
    })

    return result
  }, [searchData, librariesData, hasLocation, latitude, longitude])

  // 필터링 및 정렬
  const filteredAndSortedLibraries = useMemo(() => {
    let result = [...librariesWithStatus]

    // 필터: 대출 가능만 보기
    if (showAvailableOnly) {
      result = result.filter((lib) => lib.hasBook && lib.isAvailable)
    }

    // 정렬
    result.sort((a, b) => {
      if (sortType === 'availability') {
        // 대출 가능 우선 정렬
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1
        }
        // 대출 가능 도서관끼리는 거리순
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance
        }
      } else {
        // 거리순 정렬
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance
        }
      }
      return 0
    })

    return result
  }, [librariesWithStatus, sortType, showAvailableOnly])

  // 로딩 상태
  if (searchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // 에러 상태
  if (searchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-6 p-8">
          <p className="text-h2 text-text-primary font-semibold">검색 중 오류가 발생했습니다</p>
          <p className="text-body text-text-secondary">
            {searchError.message}
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            다시 검색하기
          </Button>
        </div>
      </div>
    )
  }

  // 검색 결과 없음
  if (!searchData?.book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-6 p-8">
          <p className="text-h2 text-text-primary font-semibold">검색 결과가 없습니다</p>
          <p className="text-body text-text-secondary">
            다른 검색어로 시도해보세요
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            다시 검색하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="container-responsive py-8 md:py-12">
        {/* 헤더 - Apple Style */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-sm text-primary hover:text-primary-dark transition-colors mb-6 font-medium"
          >
            ← 뒤로가기
          </Link>
          <h1 className="text-h1 font-bold text-text-primary tracking-tight">검색 결과</h1>
        </header>

        {/* 도서 정보 카드 */}
        <div className="mb-10">
          <BookInfoCard book={searchData.book} />
        </div>

        {/* 위치 정보 */}
        {!hasLocation && (
          <div className="mb-8 p-5 bg-bg-surface rounded-2xl border border-bg-border">
            <p className="text-body-sm text-text-secondary mb-4">
              📍 현재 위치를 허용하면 가까운 도서관부터 보여드립니다
            </p>
            <Button
              variant="secondary"
              onClick={getLocation}
              disabled={locationLoading}
              className="text-body-sm"
            >
              {locationLoading ? '위치 확인 중...' : '위치 권한 허용하기'}
            </Button>
          </div>
        )}

        {/* 필터 및 정렬 */}
        <div className="mb-8 p-5 bg-bg-surface rounded-2xl border border-bg-border">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <SortOptions value={sortType} onChange={setSortType} />
            <div className="md:ml-auto">
              <FilterCheckbox
                checked={showAvailableOnly}
                onChange={setShowAvailableOnly}
              />
            </div>
          </div>
        </div>

        {/* 도서관 목록 */}
        <div className="space-y-4 mb-10">
          {filteredAndSortedLibraries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-body text-text-tertiary">
                조건에 맞는 도서관이 없습니다
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 font-semibold text-text-primary">
                  소장 도서관 ({filteredAndSortedLibraries.length}개)
                </h2>
              </div>
              {filteredAndSortedLibraries.map((library) => (
                <LibraryCard key={library.libraryId} library={library} />
              ))}
            </>
          )}
        </div>

        {/* 다른 책 검색하기 */}
        <div className="text-center pt-4">
          <Button variant="primary" onClick={() => router.push('/')}>
            다른 책 검색하기
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultsContent />
    </Suspense>
  )
}
