import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

/**
 * 접근성을 고려한 입력 필드 컴포넌트
 * - 최소 폰트 크기: 16px (모바일 줌 방지)
 * - 명확한 레이블
 * - 에러 상태 표시
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body font-medium text-text-primary mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // project13 스타일 - 더 큰 패딩과 향상된 전환
            'w-full px-5 py-4 border-2 rounded-xl',
            'text-base text-text-primary font-normal',
            'placeholder:text-text-secondary',
            'bg-bg',
            // focus 시 배경색을 흰색으로 변경
            'focus:outline-none focus:border-primary focus:bg-white',
            'focus:shadow-[0_0_0_4px_rgba(52,199,89,0.1)]',
            'disabled:bg-bg disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300',
            error
              ? 'border-status-on-loan-text focus:border-status-on-loan-text focus:shadow-[0_0_0_4px_rgba(255,59,48,0.1)]'
              : 'border-bg-border hover:border-primary-light',
            className
          )}
          {...props}
        />
        {error && (
          <p
            className="mt-2 text-body-sm text-status-on-loan-text"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
