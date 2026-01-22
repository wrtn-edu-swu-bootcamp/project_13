import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { BookInfo } from '@/types/book'

interface BookInfoCardProps {
  book: BookInfo
}

/**
 * 도서 정보 카드 컴포넌트
 * 
 * 검색된 도서의 기본 정보를 표시합니다.
 */
export function BookInfoCard({ book }: BookInfoCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 도서 표지 */}
          {book.cover ? (
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={book.cover}
                alt={`${book.title} 표지`}
                width={120}
                height={180}
                className="rounded-xl shadow-sm object-cover"
                sizes="(max-width: 768px) 120px, 120px"
                loading="lazy"
                onError={(e) => {
                  // 이미지 로딩 실패 시 fallback
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-[120px] h-[180px] bg-bg rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <span className="text-text-tertiary text-5xl">📚</span>
            </div>
          )}

          {/* 도서 정보 */}
          <div className="flex-1 space-y-3">
            {/* 제목 */}
            <h1 className="text-h2 font-bold text-text-primary tracking-tight">
              {book.title}
            </h1>

            {/* 저자, 출판사, 출판년도 */}
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-text-secondary">
              {book.author && <span className="font-medium">{book.author}</span>}
              {book.author && (book.publisher || book.year) && (
                <span className="text-text-tertiary">·</span>
              )}
              {book.publisher && <span>{book.publisher}</span>}
              {book.publisher && book.year && (
                <span className="text-text-tertiary">·</span>
              )}
              {book.year && <span>{book.year}</span>}
            </div>

            {/* ISBN */}
            {book.isbn && (
              <p className="text-caption text-text-tertiary">
                ISBN: {book.isbn}
              </p>
            )}

            {/* 책 소개 */}
            {book.description && (
              <p className="text-body-sm text-text-secondary line-clamp-3 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
