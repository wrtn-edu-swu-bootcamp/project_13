'use client'

export type SortType = 'distance' | 'availability'

interface SortOptionsProps {
  value: SortType
  onChange: (value: SortType) => void
}

/**
 * 정렬 옵션 컴포넌트
 * 
 * 도서관 목록을 거리순 또는 대출가능 우선으로 정렬합니다.
 */
export function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-body-sm font-semibold text-text-primary">
        정렬
      </span>
      <div className="flex gap-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="distance"
            checked={value === 'distance'}
            onChange={() => onChange('distance')}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
          />
          <span className="text-body-sm text-text-secondary">거리순</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="radio"
            name="sort"
            value="availability"
            checked={value === 'availability'}
            onChange={() => onChange('availability')}
            className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
          />
          <span className="text-body-sm text-text-secondary">대출가능 우선</span>
        </label>
      </div>
    </div>
  )
}
