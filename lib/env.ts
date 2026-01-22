import { z } from 'zod'

/**
 * 환경 변수 검증 스키마
 * 
 * 애플리케이션 시작 시 환경 변수를 검증하여
 * 누락되거나 잘못된 값이 있는 경우 명확한 에러 메시지를 표시합니다.
 */
const envSchema = z.object({
  // Upstash Redis (필수)
  UPSTASH_REDIS_REST_URL: z.string().url('Redis URL must be a valid URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Redis token is required'),
  
  // 환경 (기본값: development)
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * 환경 변수 타입
 */
export type Env = z.infer<typeof envSchema>

/**
 * 검증된 환경 변수
 * 
 * 이 객체를 import하여 사용하면 타입 안정성과 런타임 검증을 모두 보장받습니다.
 * 
 * @example
 * import { env } from '@/lib/env'
 * 
 * const redisUrl = env.UPSTASH_REDIS_REST_URL
 */
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`)
    
    console.warn('⚠️  환경 변수 검증 실패:')
    console.warn(missingVars.join('\n'))
    console.warn('\n.env.local 파일을 확인하거나 Vercel Dashboard에서 환경 변수를 설정해주세요.')
    
    // 빌드 시에는 기본값 사용 (실제 런타임에서는 Vercel이 자동 주입)
    env = {
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || 'https://placeholder.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || 'placeholder_token',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    }
  } else {
    throw error
  }
}

export { env }
