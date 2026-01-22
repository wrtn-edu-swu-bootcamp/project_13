'use client'

import { useState, FormEvent } from 'react'
import { sanitizeInput } from '@/lib/utils/sanitize'
import type { SearchParams } from '@/types/search'

interface BookSearchFormProps {
  onSearch?: (params: SearchParams) => void
}

type SearchType = 'title' | 'author' | 'publisher'

export function BookSearchForm({ onSearch }: BookSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('title')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const cleanQuery = sanitizeInput(searchQuery)
    if (!cleanQuery) return

    const params: SearchParams = {
      title: searchType === 'title' ? cleanQuery : undefined,
      author: searchType === 'author' ? cleanQuery : undefined,
      publisher: searchType === 'publisher' ? cleanQuery : undefined,
    }

    if (onSearch) {
      onSearch(params)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      {/* 검색 입력 + 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="책 제목, 저자, 출판사를 검색하세요"
          className="flex-1 px-5 py-4 text-base border-2 border-[#D2D2D7] rounded-xl bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] transition-all duration-300 focus:outline-none focus:border-[#34C759] focus:bg-white focus:shadow-[0_0_0_4px_rgba(52,199,89,0.1)]"
          autoComplete="off"
          required
        />
        
        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-br from-[#34C759] to-[#30D158] rounded-xl border-none cursor-pointer transition-all duration-300 whitespace-nowrap hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(52,199,89,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none md:min-w-[140px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>검색</span>
        </button>
      </div>
      
      {/* 검색 타입 선택 */}
      <div className="flex gap-6 justify-center flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name="searchType"
            value="title"
            checked={searchType === 'title'}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="radio-input"
          />
          <span className="text-[0.95rem] text-[#1D1D1F]">제목</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name="searchType"
            value="author"
            checked={searchType === 'author'}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="radio-input"
          />
          <span className="text-[0.95rem] text-[#1D1D1F]">저자</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            name="searchType"
            value="publisher"
            checked={searchType === 'publisher'}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className="radio-input"
          />
          <span className="text-[0.95rem] text-[#1D1D1F]">출판사</span>
        </label>
      </div>
    </form>
  )
}
