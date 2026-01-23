'use client'

import { useState, FormEvent } from 'react'
import { sanitizeInput } from '@/lib/utils/sanitize'
import type { SearchParams } from '@/types/search'

interface BookSearchFormProps {
  onSearch?: (params: SearchParams) => void
}

export function BookSearchForm({ onSearch }: BookSearchFormProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')

  const hasInput = !!(title.trim() || author.trim() || publisher.trim())

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const cleanTitle = sanitizeInput(title)
    const cleanAuthor = sanitizeInput(author)
    const cleanPublisher = sanitizeInput(publisher)

    if (!cleanTitle && !cleanAuthor && !cleanPublisher) return

    const params: SearchParams = {
      title: cleanTitle || undefined,
      author: cleanAuthor || undefined,
      publisher: cleanPublisher || undefined,
    }

    if (onSearch) {
      onSearch(params)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      {/* 검색 입력 필드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="px-5 py-4 text-base border-2 border-[#D2D2D7] rounded-xl bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] transition-all duration-300 focus:outline-none focus:border-[#34C759] focus:bg-white focus:shadow-[0_0_0_4px_rgba(52,199,89,0.1)]"
          autoComplete="off"
        />
        
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="저자"
          className="px-5 py-4 text-base border-2 border-[#D2D2D7] rounded-xl bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] transition-all duration-300 focus:outline-none focus:border-[#34C759] focus:bg-white focus:shadow-[0_0_0_4px_rgba(52,199,89,0.1)]"
          autoComplete="off"
        />
        
        <input
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          placeholder="출판사"
          className="px-5 py-4 text-base border-2 border-[#D2D2D7] rounded-xl bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] transition-all duration-300 focus:outline-none focus:border-[#34C759] focus:bg-white focus:shadow-[0_0_0_4px_rgba(52,199,89,0.1)]"
          autoComplete="off"
        />
      </div>

      {/* 안내 텍스트 및 검색 버튼 */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="text-body-sm text-text-secondary">
          최소 1개 이상 입력해주세요
        </p>
        
        <button
          type="submit"
          disabled={!hasInput}
          className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-br from-[#34C759] to-[#30D158] rounded-xl border-none cursor-pointer transition-all duration-300 whitespace-nowrap hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(52,199,89,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none md:ml-auto md:min-w-[140px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>검색</span>
        </button>
      </div>
    </form>
  )
}
