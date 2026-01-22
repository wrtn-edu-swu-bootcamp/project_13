import { Redis } from '@upstash/redis'

/**
 * Upstash Redis 클라이언트
 * 
 * 환경 변수에서 자동으로 설정을 읽어옵니다:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export const redis = Redis.fromEnv()

/**
 * Redis 연결 상태 확인
 */
export async function checkRedisConnection(): Promise<boolean> {
  try {
    const result = await redis.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Redis connection error:', error)
    return false
  }
}
