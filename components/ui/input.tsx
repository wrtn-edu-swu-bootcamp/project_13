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
            'w-full px-4 py-4 border rounded-md',
            'text-body text-text-primary',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:bg-bg-surface disabled:cursor-not-allowed',
            'transition-all duration-200',
            error
              ? 'border-status-on-loan-text focus:ring-status-on-loan-text'
              : 'border-bg-border focus:ring-primary',
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
