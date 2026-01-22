/**
 * 웹 크롤링 유틸리티 함수
 */

/**
 * 재시도 로직을 포함한 fetch 함수
 * 
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param maxRetries 최대 재시도 횟수 (기본값: 3)
 * @returns Response 객체
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // AbortController로 타임아웃 설정 (10초)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CheokBot/1.0; +https://cheok.vercel.app)',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      // 성공적인 응답
      if (response.ok) {
        return response
      }

      // 429 (Too Many Requests) - 지수 백오프
      if (response.status === 429) {
        const delay = Math.pow(2, attempt) * 1000 // 1초, 2초, 4초
        console.warn(`Rate limited (429). Retrying in ${delay}ms...`)
        await sleep(delay)
        continue
      }

      // 기타 HTTP 에러
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      lastError = error as Error

      // 마지막 시도가 아니면 재시도
      if (attempt < maxRetries - 1) {
        const delay = 1000 * (attempt + 1)
        console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay}ms...`)
        await sleep(delay)
        continue
      }
    }
  }

  // 모든 재시도 실패
  throw new Error(
    `Failed to fetch ${url} after ${maxRetries} attempts: ${lastError?.message}`
  )
}

/**
 * 지연 함수
 * 
 * @param ms 밀리초
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * HTML 엔티티 디코딩
 * 
 * @param text HTML 엔티티가 포함된 텍스트
 * @returns 디코딩된 텍스트
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  }

  return text.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match)
}

/**
 * 텍스트 정리 (공백, 줄바꿈 제거)
 * 
 * @param text 정리할 텍스트
 * @returns 정리된 텍스트
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim()
}
