/**
 * 지리적 거리 계산 유틸리티
 */

/**
 * Haversine 공식을 사용한 두 지점 간 거리 계산
 * 
 * @param lat1 첫 번째 지점의 위도
 * @param lng1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lng2 두 번째 지점의 경도
 * @returns 거리 (km, 소수점 1자리)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 지구 반지름 (km)
  
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  // 소수점 1자리로 반올림
  return Math.round(distance * 10) / 10
}

/**
 * 도(degree)를 라디안(radian)으로 변환
 * 
 * @param deg 도(degree)
 * @returns 라디안(radian)
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}
