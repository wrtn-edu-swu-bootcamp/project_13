'use client'

interface FilterCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * 필터 체크박스 컴포넌트
 * 
 * 대출 가능한 도서관만 필터링합니다.
 */
export function FilterCheckbox({ checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-primary rounded-md focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
      />
      <span className="text-body-sm text-text-secondary">
        대출 가능만 보기
      </span>
    </label>
  )
}
