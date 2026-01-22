import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import type { LibraryType } from '@/types/library'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant:
    | 'available'
    | 'on-loan'
    | 'in-library'
    | 'owned'
    | 'not-owned'
    | 'library-public'
    | 'library-smart'
    | 'library-education'
  children: React.ReactNode
  icon?: React.ReactNode
}

/**
 * 접근성을 고려한 배지 컴포넌트
 * - 색상 + 아이콘 + 텍스트 조합으로 정보 전달
 * - WCAG AA 색상 대비 기준 준수
 */
export function Badge({ className, variant, children, icon, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'text-caption font-semibold',
        // 상태 배지
        variant === 'available' && 'bg-status-available-bg text-status-available-text',
        variant === 'on-loan' && 'bg-status-on-loan-bg text-status-on-loan-text',
        variant === 'in-library' && 'bg-status-in-library-bg text-status-in-library-text',
        variant === 'owned' && 'bg-status-owned-bg text-status-owned-text',
        variant === 'not-owned' && 'bg-status-not-owned-bg text-status-not-owned-text',
        // 도서관 유형 배지 - Green Theme
        variant === 'library-public' && 'bg-primary-lighter text-primary-dark',
        variant === 'library-smart' && 'bg-purple-100 text-library-smart',
        variant === 'library-education' && 'bg-blue-100 text-library-education',
        className
      )}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

/**
 * 도서관 유형별 배지를 반환하는 헬퍼 함수
 */
export function getLibraryTypeBadgeVariant(
  type: LibraryType
): 'library-public' | 'library-smart' | 'library-education' {
  const variantMap: Record<LibraryType, 'library-public' | 'library-smart' | 'library-education'> = {
    public: 'library-public',
    smart: 'library-smart',
    education: 'library-education',
  }
  return variantMap[type]
}

/**
 * 도서관 유형별 레이블을 반환하는 헬퍼 함수
 */
export function getLibraryTypeLabel(type: LibraryType): string {
  const labelMap: Record<LibraryType, string> = {
    public: '공공도서관',
    smart: '스마트도서관',
    education: '교육청도서관',
  }
  return labelMap[type]
}
