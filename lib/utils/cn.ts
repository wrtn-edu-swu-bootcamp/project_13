import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * clsx로 조건부 클래스를 처리하고, twMerge로 충돌하는 클래스를 해결합니다.
 *
 * @param inputs - 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // 조건부 클래스
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
