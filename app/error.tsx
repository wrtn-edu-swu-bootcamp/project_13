'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션 환경에서는 에러 모니터링 서비스로 전송)
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-h1 font-bold text-text-primary">
            오류가 발생했습니다
          </h1>
          <p className="text-body text-text-secondary">
            죄송합니다. 예상치 못한 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-status-on-loan-bg border border-status-on-loan-text rounded-md p-4 text-left">
            <p className="text-body-sm font-mono text-status-on-loan-text break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            다시 시도
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="secondary"
          >
            홈으로 돌아가기
          </Button>
        </div>

        <div className="pt-6 border-t border-bg-border">
          <p className="text-body-sm text-text-tertiary">
            문제가 계속되면{' '}
            <a
              href="https://github.com/yourusername/cheok/issues"
              className="text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              문의하기
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
