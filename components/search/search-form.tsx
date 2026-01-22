'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { sanitizeInput } from '@/lib/utils/sanitize'
import type { SearchParams } from '@/types/search'

interface SearchFormProps {
  onSearch?: (params: SearchParams) => void
  initialValues?: SearchParams
}

/**
 * 도서 검색 폼 컴포넌트
 * 
 * 제목, 저자, 출판사를 입력받아 검색합니다.
 * 최소 1개 이상의 검색어가 필요합니다.
 */
export function SearchForm({ onSearch, initialValues }: SearchFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialValues?.title || '')
  const [author, setAuthor] = useState(initialValues?.author || '')
  const [publisher, setPublisher] = useState(initialValues?.publisher || '')

  // 최소 1개 이상 입력되었는지 확인
  const hasInput = title.trim() || author.trim() || publisher.trim()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 입력값 정제 (XSS 방지)
    const cleanTitle = sanitizeInput(title)
    const cleanAuthor = sanitizeInput(author)
    const cleanPublisher = sanitizeInput(publisher)

    // 최소 1개 이상의 검색어 필수
    if (!cleanTitle && !cleanAuthor && !cleanPublisher) {
      return
    }

    // 검색 파라미터 생성
    const params: SearchParams = {
      title: cleanTitle || undefined,
      author: cleanAuthor || undefined,
      publisher: cleanPublisher || undefined,
    }

    // 콜백 호출
    if (onSearch) {
      onSearch(params)
    }

    // 검색 결과 페이지로 이동
    const searchParams = new URLSearchParams()
    if (params.title) searchParams.append('title', params.title)
    if (params.author) searchParams.append('author', params.author)
    if (params.publisher) searchParams.append('publisher', params.publisher)

    router.push(`/results?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* 메인 검색 박스 */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-2 border-primary-light space-y-4">
        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="sr-only">
            책 제목
          </label>
          <Input
            id="title"
            type="text"
            placeholder="📖 책 제목을 입력하세요 (선택)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg"
          />
        </div>

        {/* 저자 입력 */}
        <div>
          <label htmlFor="author" className="sr-only">
            저자명
          </label>
          <Input
            id="author"
            type="text"
            placeholder="✍️ 저자명을 입력하세요 (선택)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full text-lg"
          />
        </div>

        {/* 출판사 입력 */}
        <div>
          <label htmlFor="publisher" className="sr-only">
            출판사명
          </label>
          <Input
            id="publisher"
            type="text"
            placeholder="🏢 출판사명을 입력하세요 (선택)"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full text-lg"
          />
        </div>

        {/* 안내 텍스트 */}
        <p className="text-body-sm text-text-tertiary text-center pt-2">
          ⓘ 최소 1개 이상의 검색어를 입력해주세요
        </p>

        {/* 검색 버튼 */}
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={!hasInput}
            className="min-w-[240px] text-lg py-5"
          >
            🔍 검색하기
          </Button>
        </div>
      </div>
    </form>
  )
}
