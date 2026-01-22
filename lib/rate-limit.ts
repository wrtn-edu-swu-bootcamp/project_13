import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './cache/redis'

/**
 * IP 기반 Rate Limiting
 * 
 * 설정: 1분에 10회 요청 (Sliding Window 알고리즘)
 * 
 * Sliding Window:
 * - 시간 창이 매 요청마다 이동하여 더 정확한 제한
 * - Fixed Window보다 버스트 트래픽에 강함
 */
export const ipRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true, // Upstash Analytics 활성화
  prefix: 'ratelimit:ip',
})

/**
 * API 키 기반 Rate Limiting (향후 사용)
 * 
 * 설정: 1분에 100회 요청
 */
export const apiKeyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:apikey',
})

/**
 * Rate limit 체크 헬퍼 함수
 * 
 * @param identifier IP 주소 또는 API 키
 * @param limiter 사용할 Rate Limiter (기본값: ipRateLimit)
 * @returns { success: boolean, remaining: number, reset: Date }
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit = ipRateLimit
) {
  try {
    const result = await limiter.limit(identifier)
    
    return {
      success: result.success,
      remaining: result.remaining,
      reset: new Date(result.reset),
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    
    // Rate limit 체크 실패 시 요청을 허용 (fail-open)
    // 서비스 가용성을 우선
    return {
      success: true,
      remaining: 0,
      reset: new Date(),
    }
  }
}
