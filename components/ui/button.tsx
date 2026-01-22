import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

/**
 * 접근성을 고려한 버튼 컴포넌트
 * - 최소 터치 타겟: 44x44px
 * - 명확한 포커스 표시
 * - 키보드 접근 가능
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // 기본 스타일 - Apple Style
          'inline-flex items-center justify-center',
          'px-6 py-3 rounded-xl font-semibold',
          'min-h-[44px] min-w-[44px]',
          'transition-all duration-300',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          // variant별 스타일
          variant === 'primary' && [
            // 그라디언트 배경 - project13 스타일
            'bg-gradient-to-br from-[#34C759] to-[#30D158] text-white',
            // 향상된 hover 효과
            'hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(52,199,89,0.4)]',
            'active:translate-y-0',
            'focus-visible:outline-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          ],
          variant === 'secondary' && [
            'bg-bg-surface text-primary',
            'border-2 border-bg-border',
            'hover:bg-primary-lighter hover:border-primary-light hover:-translate-y-0.5 active:scale-95',
            'focus-visible:outline-primary',
            'disabled:border-text-disabled disabled:text-text-disabled disabled:opacity-50',
          ],
          // 비활성 상태
          disabled && 'cursor-not-allowed',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
