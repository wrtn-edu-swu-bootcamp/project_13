'use client'

import { useState, useEffect } from 'react'
import type { SearchParams } from '@/types/search'

const STORAGE_KEY = 'cheok-recent-searches'
const MAX_RECENT_SEARCHES = 5

export interface RecentSearch {
  id: string
  params: SearchParams
  timestamp: number
  displayText: string
}

/**
 * 최근 검색어 관리 훅
 * 
 * Local Storage를 사용하여 최근 검색어 5개를 저장하고 관리합니다.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  // 초기 로드
  useEffect(() => {
    loadRecentSearches()
  }, [])

  // Local Storage에서 검색어 불러오기
  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const searches = JSON.parse(stored) as RecentSearch[]
        setRecentSearches(searches)
      }
    } catch (error) {
      console.error('최근 검색어를 불러오는데 실패했습니다:', error)
    }
  }

  // Local Storage에 검색어 저장
  const saveToStorage = (searches: RecentSearch[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
    } catch (error) {
      console.error('최근 검색어를 저장하는데 실패했습니다:', error)
    }
  }

  // 검색어 추가
  const addSearch = (params: SearchParams) => {
    // 표시용 텍스트 생성
    const parts: string[] = []
    if (params.title) parts.push(params.title)
    if (params.author) parts.push(params.author)
    if (params.publisher) parts.push(params.publisher)
    const displayText = parts.join(' · ')

    // 새 검색어 객체
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      params,
      timestamp: Date.now(),
      displayText,
    }

    // 중복 제거 (동일한 검색어는 최신 것만 유지)
    const filtered = recentSearches.filter((search) => {
      return !(
        search.params.title === params.title &&
        search.params.author === params.author &&
        search.params.publisher === params.publisher
      )
    })

    // 최신 검색어를 맨 앞에 추가하고 최대 개수 제한
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(updated)
    saveToStorage(updated)
  }

  // 특정 검색어 삭제
  const removeSearch = (id: string) => {
    const updated = recentSearches.filter((search) => search.id !== id)
    setRecentSearches(updated)
    saveToStorage(updated)
  }

  // 모든 검색어 삭제
  const clearAll = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('최근 검색어를 삭제하는데 실패했습니다:', error)
    }
  }

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  }
}
