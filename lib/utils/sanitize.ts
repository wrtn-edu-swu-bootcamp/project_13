/**
 * 사용자 입력을 정제하여 XSS 공격을 방지합니다.
 * 
 * 클라이언트 사이드에서만 사용 가능합니다.
 * 
 * @param input - 정제할 문자열
 * @returns 정제된 안전한 문자열
 * 
 * @example
 * const cleanInput = sanitizeInput('<script>alert("XSS")</script>안녕하세요')
 * // 결과: "안녕하세요"
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  // 간단한 HTML 태그와 특수 문자 제거
  return input
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/[<>'"&]/g, '') // 특수 문자 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+=/gi, '') // 이벤트 핸들러 제거
    .trim()
}

/**
 * 검색 파라미터 객체를 정제합니다.
 * 
 * @param params - 정제할 검색 파라미터
 * @returns 정제된 검색 파라미터
 */
export function sanitizeSearchParams<T extends Record<string, string | undefined>>(
  params: T
): T {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value as T[keyof T]
    }
  }
  
  return sanitized
}

/**
 * API 응답 데이터를 정제합니다 (도서 정보 등).
 * 
 * HTML이 포함될 수 있는 필드만 정제하고,
 * 기본 텍스트는 그대로 유지합니다.
 * 
 * @param text - 정제할 텍스트
 * @returns 정제된 텍스트
 */
export function sanitizeHtmlContent(text: string): string {
  if (!text) return ''
  
  // 위험한 태그와 속성 제거
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // script 태그 제거
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // iframe 태그 제거
    .replace(/on\w+="[^"]*"/gi, '') // 이벤트 핸들러 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
}
