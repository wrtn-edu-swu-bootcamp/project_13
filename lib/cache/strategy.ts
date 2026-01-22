import { redis } from './redis'

/**
 * 캐시 TTL (Time To Live) 전략
 * 
 * 단위: 초(seconds)
 */
export const CACHE_TTL = {
  /** 검색 결과: 5분 (실시간성 유지) */
  SEARCH_RESULT: 5 * 60,
  
  /** 도서관 목록: 24시간 (자주 변경 안됨) */
  LIBRARY_LIST: 24 * 60 * 60,
  
  /** 도서 정보: 7일 (서지정보는 거의 안 변함) */
  BOOK_INFO: 7 * 24 * 60 * 60,
} as const

/**
 * 캐시에서 데이터 조회
 * 
 * @param key 캐시 키
 * @returns 캐시된 데이터 또는 null
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    
    if (!cached) {
      return null
    }
    
    // Upstash Redis는 JSON을 자동으로 파싱하지만
    // 타입 안정성을 위해 명시적으로 처리
    return cached as T
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

/**
 * 캐시에 데이터 저장
 * 
 * @param key 캐시 키
 * @param value 저장할 데이터
 * @param ttl TTL (초 단위)
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  try {
    // setex: SET with EXpiration
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Cache set error:', error)
    // 캐시 저장 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}

/**
 * 캐시 삭제
 * 
 * @param key 캐시 키
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

/**
 * 패턴으로 캐시 키 조회 및 삭제
 * 
 * @param pattern 키 패턴 (예: "search:*")
 */
export async function deleteCachedByPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Cache delete by pattern error:', error)
  }
}
