import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge, getLibraryTypeBadgeVariant, getLibraryTypeLabel } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { LibraryStatus } from '@/types/library'

interface LibraryCardProps {
  library: LibraryStatus
}

/**
 * 도서관 카드 컴포넌트
 * 
 * 각 도서관의 소장 및 대출 상태를 표시합니다.
 */
export function LibraryCard({ library }: LibraryCardProps) {

  // 대출 상태 배지 variant 결정
  const getStatusVariant = () => {
    if (!library.hasBook) return 'not-owned' as const
    if (library.isAvailable) return 'available' as const
    if (library.status === '관내열람만') return 'in-library' as const
    return 'on-loan' as const
  }

  // 대출 상태 텍스트
  const getStatusText = () => {
    if (!library.hasBook) return '미소장'
    if (library.isAvailable) return '대출가능 ✓'
    if (library.status === '관내열람만') return '관내열람만'
    return '대출중'
  }

  return (
    <Card className="w-full hover:shadow-md transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3 gap-4">
              <CardTitle className="text-h3">{library.libraryName}</CardTitle>
              {library.distance !== undefined && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl font-semibold text-primary whitespace-nowrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-body-sm">{library.distance.toFixed(1)}km</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getLibraryTypeBadgeVariant(library.libraryType)}>
                {getLibraryTypeLabel(library.libraryType)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 소장 및 대출 상태 */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={library.hasBook ? 'owned' : 'not-owned'}>
            {library.hasBook ? '소장함' : '미소장'}
          </Badge>
          {library.hasBook && (
            <Badge variant={getStatusVariant()}>
              {getStatusText()}
            </Badge>
          )}
          {library.dueDate && (
            <span className="text-caption text-text-tertiary">
              반납예정: {library.dueDate}
            </span>
          )}
        </div>

        {/* 운영 시간, 연락처, 주소 */}
        {(library.hours || library.phone || library.address) && (
          <div className="space-y-2 text-body-sm text-text-secondary">
            {library.hours && (
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">🕒</span>
                <span>{library.hours}</span>
              </p>
            )}
            {library.phone && (
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">📞</span>
                <span>{library.phone}</span>
              </p>
            )}
            {library.address && (
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">📌</span>
                <span>{library.address}</span>
              </p>
            )}
          </div>
        )}

        {/* 버튼 */}
        {library.url && (
          <div className="flex gap-3 pt-2">
            <Link
              href={library.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              aria-label={`${library.libraryName} 상세보기 (새 창)`}
            >
              <Button variant="secondary" className="w-full text-body-sm">
                상세보기
              </Button>
            </Link>
            {library.hasBook && library.isAvailable && (
              <Link
                href={library.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                aria-label={`${library.libraryName}에서 예약하기 (새 창)`}
              >
                <Button variant="primary" className="w-full text-body-sm">
                  예약하기
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
