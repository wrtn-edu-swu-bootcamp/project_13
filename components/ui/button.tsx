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
          // 기본 스타일
          'inline-flex items-center justify-center',
          'px-8 py-4 rounded-md font-semibold',
          'min-h-touch min-w-touch',
          'transition-all duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          // variant별 스타일
          variant === 'primary' && [
            'bg-primary text-white',
            'hover:bg-primary-dark active:bg-primary-dark',
            'focus-visible:outline-primary',
            'disabled:bg-text-disabled',
          ],
          variant === 'secondary' && [
            'bg-transparent text-primary',
            'border border-primary',
            'hover:bg-primary-lighter active:bg-primary-lighter',
            'focus-visible:outline-primary',
            'disabled:border-text-disabled disabled:text-text-disabled',
          ],
          // 비활성 상태
          disabled && 'cursor-not-allowed opacity-60',
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
