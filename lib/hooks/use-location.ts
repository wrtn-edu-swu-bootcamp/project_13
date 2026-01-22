'use client'

import { useState, useEffect } from 'react'

interface LocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export type LocationError =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNKNOWN'

/**
 * 브라우저 Geolocation API 훅
 * 
 * 사용자의 현재 위치를 가져옵니다.
 * 위치 정보는 로컬에서만 사용되며 서버로 전송되지 않습니다.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  const getLocation = () => {
    // Geolocation API 지원 확인
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: '이 브라우저는 위치 정보를 지원하지 않습니다.',
        loading: false,
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      // 성공 시
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      // 실패 시
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
            break
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
        })
      },
      // 옵션
      {
        enableHighAccuracy: false, // 정확도보다 속도 우선
        timeout: 10000, // 10초 타임아웃
        maximumAge: 5 * 60 * 1000, // 5분간 캐시된 위치 사용
      }
    )
  }

  return {
    ...state,
    getLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}
