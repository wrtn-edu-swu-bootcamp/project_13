import type { BookResult } from '@/types/search'

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

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md transition-all duration-300 border-2 border-transparent hover:translate-y-[-4px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#E8F5E9]">
      <div className="flex justify-between items-start mb-4 gap-6 flex-col md:flex-row">
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
        
        <div className={`px-4 py-2 rounded-xl text-[0.85rem] font-semibold whitespace-nowrap inline-flex items-center gap-2 ${statusClass}`}>
          <span className={`w-2 h-2 rounded-full ${result.available ? 'bg-[#34C759]' : result.status === '대출중' ? 'bg-[#FF3B30]' : 'bg-[#8E8E93]'}`}></span>
          {statusText}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-[#D2D2D7] flex justify-between items-center flex-wrap gap-4">
        <span className="inline-flex items-center gap-2 px-3 py-2 bg-[#34C759] text-white rounded-lg text-[0.85rem] font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          {result.library}
        </span>
        {result.location && (
          <span className="text-[0.85rem] text-[#86868B]">
            {result.location}
          </span>
        )}
      </div>
    </div>
  )
}
