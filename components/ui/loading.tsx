import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

/**
 * 접근성을 고려한 로딩 스피너 컴포넌트
 * - ARIA 레이블로 스크린 리더 지원
 * - 시각적으로 명확한 애니메이션
 */
export function Loading({ className, size = 'md', text, ...props }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-live="polite"
      aria-label={text || '로딩 중입니다'}
      {...props}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-bg-border border-t-primary',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <p className="text-body text-text-secondary font-medium">{text}</p>
      )}
      <span className="sr-only">{text || '로딩 중입니다'}</span>
    </div>
  )
}

/**
 * 전체 화면 로딩 오버레이 컴포넌트
 */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <Loading size="lg" text={text} />
      </div>
    </div>
  )
}

/**
 * 스켈레톤 로딩 컴포넌트 (선택사항)
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-bg-surface', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
