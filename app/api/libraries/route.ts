import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LIBRARIES } from '@/lib/constants/libraries'
import { calculateDistance } from '@/lib/utils/distance'
import type { Library } from '@/types/library'

/**
 * 도서관 목록 API
 * 
 * GET /api/libraries?lat=37.5145&lng=127.1059
 * 
 * 사용자 위치를 제공하면 거리를 계산하여 반환
 */

// 위치 파라미터 검증 스키마
const locationParamsSchema = z.object({
  lat: z.string().optional(),
  lng: z.string().optional(),
}).transform((data) => ({
  lat: data.lat ? parseFloat(data.lat) : undefined,
  lng: data.lng ? parseFloat(data.lng) : undefined,
})).refine(
  (data) => {
    // 둘 다 있거나 둘 다 없어야 함
    return (data.lat !== undefined && data.lng !== undefined) ||
           (data.lat === undefined && data.lng === undefined)
  },
  {
    message: '위도(lat)와 경도(lng)를 모두 제공해야 합니다',
  }
).refine(
  (data) => {
    // 위도/경도 범위 검증
    if (data.lat !== undefined && data.lng !== undefined) {
      return (
        data.lat >= -90 && data.lat <= 90 &&
        data.lng >= -180 && data.lng <= 180 &&
        !isNaN(data.lat) && !isNaN(data.lng)
      )
    }
    return true
  },
  {
    message: '유효하지 않은 위도/경도 값입니다',
  }
)

export async function GET(request: NextRequest) {
  try {
    // 1. 쿼리 파라미터 추출 및 검증
    const { searchParams } = new URL(request.url)
    
    const params = {
      lat: searchParams.get('lat') || undefined,
      lng: searchParams.get('lng') || undefined,
    }

    const validation = locationParamsSchema.safeParse(params)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { lat, lng } = validation.data

    // 2. 도서관 목록 가져오기
    let libraries = [...LIBRARIES]

    // 3. 사용자 위치가 제공되면 거리 계산
    if (lat !== undefined && lng !== undefined) {
      libraries = libraries.map((library) => ({
        ...library,
        distance: calculateDistance(lat, lng, library.lat, library.lng),
      }))

      // 거리순으로 정렬
      libraries.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    // 4. 응답 반환
    return NextResponse.json({
      libraries,
      total: libraries.length,
    })
  } catch (error) {
    console.error('Libraries API error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '도서관 목록 조회 중 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}

// Serverless Function 설정
export const runtime = 'nodejs'
