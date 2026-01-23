import type { BookResult } from '@/types/search'
import { getLibraryByName } from '@/lib/constants/libraries'
import Link from 'next/link'

interface BookResultCardProps {
  result: BookResult
}

export function BookResultCard({ result }: BookResultCardProps) {
  // 상태 뱃지 클래스 결정
  let statusClass = 'bg-[#F5F5F7] text-[#8E8E93]'
  let statusText = result.status

  if (result.available) {
    statusClass = 'bg-[#E8F5E9] text-[#248A3D]'
    statusText = '대출 가능'
  } else if (result.status === '대출중') {
    statusClass = 'bg-[#FFE8E8] text-[#FF3B30]'
    statusText = '대출 중'
  }

  // 도서관 정보 가져오기
  const libraryInfo = getLibraryByName(result.library)

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md transition-all duration-300 border-2 border-transparent hover:translate-y-[-4px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#E8F5E9]">
      <div className="flex justify-between items-start mb-4 gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2 leading-snug">
            {result.title}
          </h3>
          <div className="flex flex-col gap-1 text-[#86868B] text-[0.9rem]">
            {result.author && (
              <span className="flex items-center gap-2">
                저자: {result.author}
              </span>
            )}
            {result.publisher && (
              <span className="flex items-center gap-2">
                출판사: {result.publisher}
              </span>
            )}
            {result.call_number && (
              <span className="flex items-center gap-2">
                청구기호: {result.call_number}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          {result.cover && (
            <img 
              src={result.cover} 
              alt={`${result.title} 표지`}
              className="w-[120px] h-[180px] object-cover rounded-lg shadow-sm flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <div className={`px-4 py-2 rounded-xl text-[0.85rem] font-semibold whitespace-nowrap inline-flex items-center gap-2 ${statusClass}`}>
            <span className={`w-2 h-2 rounded-full ${result.available ? 'bg-[#34C759]' : result.status === '대출중' ? 'bg-[#FF3B30]' : 'bg-[#8E8E93]'}`}></span>
            {statusText}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-[#D2D2D7]">
        <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#34C759] text-white rounded-lg text-[0.8rem] font-semibold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              {result.library}
            </span>
            {libraryInfo && (
              <Link 
                href={libraryInfo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[#007AFF] rounded-lg text-[0.8rem] font-semibold hover:text-[#0051D5] transition-colors duration-200"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                홈페이지
              </Link>
            )}
          </div>
          {result.location && (
            <span className="text-[0.75rem] text-[#86868B]">
              {result.location}
            </span>
          )}
        </div>
        {libraryInfo && (
          <div className="flex items-start gap-2 text-[0.75rem] text-[#86868B]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{libraryInfo.address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
