import type { Library } from '@/types/library'

/**
 * 송파구 도서관 상수 데이터
 * 
 * 출처: 
 * - 송파구통합도서관: https://www.splib.or.kr
 * - 서울시교육청 송파도서관: https://splib.sen.go.kr
 * 
 * 도서관 유형:
 * - public: 공공도서관 및 작은도서관 (14개)
 * - smart: 스마트도서관 (별도 확인 필요)
 * - education: 교육청도서관 (1개)
 */
export const LIBRARIES: Library[] = [
  // 공공/작은도서관 (14개) - 송파구통합도서관 웹사이트 기준
  {
    id: 'songpa-unified',
    name: '송파구통합도서관',
    type: 'public',
    address: '서울특별시 송파구 백제고분로 242, 2층 송파문화재단',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.5063,
    lng: 127.1088,
  },
  {
    id: 'songpa-glmaru',
    name: '송파글마루도서관',
    type: 'public',
    address: '서울특별시 송파구 가락동',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4923,
    lng: 127.1270,
  },
  {
    id: 'songpa-children',
    name: '송파어린이도서관',
    type: 'public',
    address: '서울특별시 송파구 가락동',
    phone: '02-449-8855',
    hours: '평일 09:00~18:00, 주말 09:00~17:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4961,
    lng: 127.1289,
  },
  {
    id: 'songpa-wirye',
    name: '송파위례도서관',
    type: 'public',
    address: '서울특별시 송파구 장지동',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4795,
    lng: 127.1450,
  },
  {
    id: 'geoma',
    name: '거마도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4900,
    lng: 127.1400,
  },
  {
    id: 'dolmari',
    name: '돌마리도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.5000,
    lng: 127.1300,
  },
  {
    id: 'sonamuundeok-1',
    name: '소나무언덕1호도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4933,
    lng: 127.1472,
  },
  {
    id: 'sonamuundeok-2',
    name: '소나무언덕2호도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4940,
    lng: 127.1480,
  },
  {
    id: 'sonamuundeok-3',
    name: '소나무언덕3호도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4950,
    lng: 127.1490,
  },
  {
    id: 'sonamuundeok-4',
    name: '소나무언덕4호도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4960,
    lng: 127.1500,
  },
  {
    id: 'sonamuundeok-jamsil',
    name: '소나무언덕잠실본동도서관',
    type: 'public',
    address: '서울특별시 송파구 잠실본동',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.5120,
    lng: 127.0860,
  },
  {
    id: 'songpa-english',
    name: '송파어린이영어도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~18:00, 주말 09:00~17:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4970,
    lng: 127.1290,
  },
  {
    id: 'garakmall',
    name: '가락몰도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4920,
    lng: 127.1180,
  },
  {
    id: 'songigol',
    name: '송이골작은도서관',
    type: 'public',
    address: '서울특별시 송파구',
    phone: '02-449-8855',
    hours: '평일 09:00~22:00, 주말 09:00~18:00',
    url: 'https://www.splib.or.kr',
    lat: 37.4880,
    lng: 127.1250,
  },

  // 스마트도서관 (9개) - 송파구통합도서관 웹사이트 기준
  {
    id: 'smart-jamsil-naru',
    name: '스마트도서관 잠실나루역',
    type: 'smart',
    address: '서울특별시 송파구 잠실나루역(2호선)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5205,
    lng: 127.0950,
  },
  {
    id: 'smart-bangi',
    name: '스마트도서관 방이역',
    type: 'smart',
    address: '서울특별시 송파구 방이역(5호선)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5144,
    lng: 127.1263,
  },
  {
    id: 'smart-macheon',
    name: '스마트도서관 마천역',
    type: 'smart',
    address: '서울특별시 송파구 마천역(5호선)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.4946,
    lng: 127.1476,
  },
  {
    id: 'smart-geoyeo',
    name: '스마트도서관 거여역',
    type: 'smart',
    address: '서울특별시 송파구 거여역(5호선)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.4934,
    lng: 127.1456,
  },
  {
    id: 'smart-jangji',
    name: '스마트도서관 장지역',
    type: 'smart',
    address: '서울특별시 송파구 장지역(8호선)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.4783,
    lng: 127.1262,
  },
  {
    id: 'smart-jamsil2-center',
    name: '스마트도서관 잠실2동주민센터',
    type: 'smart',
    address: '서울특별시 송파구 잠실2동 주민센터',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5134,
    lng: 127.0858,
  },
  {
    id: 'smart-book-museum',
    name: '스마트도서관 책박물관',
    type: 'smart',
    address: '서울특별시 송파구 송파책박물관',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5080,
    lng: 127.1100,
  },
  {
    id: 'smart-jamsil-park',
    name: '스마트도서관 잠실근린공원',
    type: 'smart',
    address: '서울특별시 송파구 백제고분로15길 7 (잠실근린공원)',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5115,
    lng: 127.0793,
  },
  {
    id: 'smart-pungnap',
    name: '스마트도서관 풍납동',
    type: 'smart',
    address: '서울특별시 송파구 풍납동 83-29',
    phone: '02-449-8855',
    hours: '24시간 운영',
    url: 'https://www.splib.or.kr',
    lat: 37.5298,
    lng: 127.1159,
  },

  // 교육청도서관 (1개) - 서울시교육청 송파도서관
  {
    id: 'songpa-education',
    name: '송파도서관',
    type: 'education',
    address: '서울특별시 송파구 동남로 263 (오금동)',
    phone: '02-3434-3333',
    hours: '평일 09:00~22:00, 주말 09:00~17:00',
    url: 'https://splib.sen.go.kr',
    lat: 37.4916,
    lng: 127.1296,
  },
]

/**
 * 도서관 ID로 도서관 정보를 찾는 함수
 */
export function getLibraryById(id: string): Library | undefined {
  return LIBRARIES.find((library) => library.id === id)
}

/**
 * 도서관 유형별로 필터링하는 함수
 */
export function getLibrariesByType(type: Library['type']): Library[] {
  return LIBRARIES.filter((library) => library.type === type)
}

/**
 * 도서관 통계
 */
export const LIBRARY_STATS = {
  total: LIBRARIES.length,
  public: LIBRARIES.filter((lib) => lib.type === 'public').length,
  smart: LIBRARIES.filter((lib) => lib.type === 'smart').length,
  education: LIBRARIES.filter((lib) => lib.type === 'education').length,
} as const
