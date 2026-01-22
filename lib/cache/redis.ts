import { Redis } from '@upstash/redis'
import { env } from '@/lib/env'

/**
 * Upstash Redis 클라이언트
 * 
 * 환경 변수에서 자동으로 설정을 읽어옵니다:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 * 
 * env 객체를 통해 검증된 환경 변수를 사용합니다.
 * 환경 변수가 없으면 null을 반환하여 개발 환경에서도 작동 가능
 */
export const redis = (() => {
  try {
    const url = env.UPSTASH_REDIS_REST_URL
    const token = env.UPSTASH_REDIS_REST_TOKEN
    
    // 환경 변수가 유효하지 않으면 null 반환
    if (!url || !token || url.includes('xxx') || token === 'your_token_here') {
      console.warn('⚠️  Redis credentials not configured. Running without cache.')
      return null
    }
    
    return Redis.fromEnv()
  } catch (error) {
    console.warn('⚠️  Redis initialization failed:', error)
    return null
  }
})() as Redis | null

/**
 * Redis 연결 상태 확인
 */
export async function checkRedisConnection(): Promise<boolean> {
  try {
    if (!redis) {
      return false
    }
    const result = await redis.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Redis connection error:', error)
    return false
  }
}
