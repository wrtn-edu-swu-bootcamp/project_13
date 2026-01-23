'use client'

import { useState } from 'react'
import { BookSearchForm } from '@/components/search/book-search-form'
import { BookResultCard } from '@/components/book/book-result-card'
import type { SearchParams, BookResult } from '@/types/search'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BookResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true)
    setError('')
    setHasSearched(true)
    
    // 검색어 추출
    const query = params.title || params.author || params.publisher || ''
    setSearchQuery(query)

    try {
      const searchParams = new URLSearchParams()
      if (params.title) searchParams.append('title', params.title)
      if (params.author) searchParams.append('author', params.author)
      if (params.publisher) searchParams.append('publisher', params.publisher)

      const startTime = Date.now()
      const response = await fetch(`/api/search?${searchParams.toString()}`)
      const endTime = Date.now()
      
      if (!response.ok) {
        throw new Error('검색 요청에 실패했습니다.')
      }

      const data = await response.json()
      
      // API 응답을 BookResult 형식으로 변환
      if (data.book && data.libraries) {
        const bookResults: BookResult[] = data.libraries
          .filter((lib: any) => lib.hasBook) // 소장하고 있는 도서관만
          .map((lib: any) => ({
            title: data.book.title,
            author: data.book.author,
            publisher: data.book.publisher,
            call_number: lib.callNumber || '',
            status: lib.status,
            available: lib.isAvailable,
            library: lib.libraryName,
            location: lib.location || '',
            cover: data.book.cover || '',
          }))
        
        setResults(bookResults)
        setTotalCount(bookResults.length)
      } else {
        setResults([])
        setTotalCount(0)
      }
      
      setSearchTime((endTime - startTime) / 1000)
    } catch (err) {
      setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 max-w-[1000px] mx-auto px-8 py-8 w-full">
      {/* 검색 영역 */}
      <div className="mt-12 mb-12">
        <BookSearchForm onSearch={handleSearch} />
      </div>

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="spinner w-[50px] h-[50px] mx-auto mb-6 border-4 border-[#E8F5E9] border-t-[#34C759] rounded-full"></div>
          <p className="text-[#86868B] text-base">검색 중...</p>
        </div>
      )}

      {/* 검색 결과 */}
      {!isLoading && hasSearched && !error && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-[#1D1D1F]">
              "{searchQuery}" 검색 결과
            </h2>
            <div className="flex gap-6 items-center">
              <span className="text-[0.95rem] text-[#86868B] font-medium">
                총 {totalCount}건
              </span>
              <span className="text-[0.85rem] text-[#86868B] px-3 py-1 bg-[#E8F5E9] rounded-lg">
                {searchTime.toFixed(2)}초
              </span>
            </div>
          </div>
          
          <div className="grid gap-6">
            {results.length === 0 ? (
              <div className="text-center py-12 text-[#86868B]">
                <svg className="mx-auto mb-6 text-[#34C759]" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-base leading-relaxed">
                  다른 검색어로 다시 시도해주세요
                </p>
              </div>
            ) : (
              results.map((result, index) => (
                <BookResultCard key={index} result={result} />
              ))
            )}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {!isLoading && error && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md mt-8">
          <svg className="mx-auto mb-6 text-[#FF3B30]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="text-[#86868B] text-base">{error}</p>
        </div>
      )}

      {/* 시작 안내 */}
      {!isLoading && !hasSearched && !error && (
        <div className="text-center py-12 text-[#86868B]">
          <svg className="mx-auto mb-6 text-[#34C759]" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
            도서관에서 찾고 싶은 책이 있나요?
          </h3>
          <p className="text-base leading-relaxed">
            두 도서관을 한 번에 검색하여<br />원하는 책을 빠르게 찾아보세요
          </p>
        </div>
      )}
    </main>
  )
}
