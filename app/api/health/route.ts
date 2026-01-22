import { NextResponse } from 'next/server'
import { checkRedisConnection } from '@/lib/cache/redis'

/**
 * 헬스체크 API
 * 
 * GET /api/health
 * 
 * 시스템 상태를 확인합니다:
 * - Redis 연결 상태
 * - 서비스 전반적인 상태
 */

export async function GET() {
  try {
    const timestamp = new Date().toISOString()

    // Redis 연결 확인
    const redisOk = await checkRedisConnection()

    // 전체 상태 판별
    const status = redisOk ? 'ok' : 'degraded'

    const response = {
      status,
      timestamp,
      services: {
        redis: redisOk ? 'ok' : 'error',
        api: 'ok',
      },
      version: '1.0.0',
    }

    // 상태에 따라 HTTP 상태 코드 결정
    const statusCode = status === 'ok' ? 200 : 503

    return NextResponse.json(response, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          redis: 'error',
          api: 'error',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

// Serverless Function 설정
export const runtime = 'nodejs'
