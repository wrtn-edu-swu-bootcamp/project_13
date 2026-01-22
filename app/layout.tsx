import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: '책크 - 송파구 도서관 통합 검색',
  description:
    '송파구 내 24개 도서관의 도서 소장 및 대출 가능 여부를 한 번에 검색하는 통합 서비스',
  keywords: [
    '송파구',
    '도서관',
    '도서 검색',
    '대출',
    '책',
    '통합 검색',
    '송파글마루도서관',
    '소나무언덕도서관',
  ],
  authors: [{ name: '책크' }],
  openGraph: {
    title: '책크 - 송파구 도서관 통합 검색',
    description: '송파구 24개 도서관의 도서를 한 번에 검색하세요',
    type: 'website',
    locale: 'ko_KR',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2D7A4E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          {/* 그라디언트 헤더 - project13 스타일 */}
          <header className="bg-gradient-to-br from-[#34C759] to-[#30D158] text-white shadow-md">
            <div className="max-w-[800px] mx-auto px-8 py-12 md:py-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                {/* 책 로고 아이콘 */}
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <h1 className="text-[2rem] font-bold tracking-tight">송파 도서관 통합 검색</h1>
              </div>
              <p className="text-base opacity-90 font-normal">송파구통합도서관 · 교육청송파도서관</p>
            </div>
          </header>
          
          <Providers>{children}</Providers>
          
          {/* 푸터 - project13 스타일 */}
          <footer className="text-center px-8 py-8 text-[#86868B] text-[0.9rem] mt-12">
            <p>송파 도서관 통합 검색</p>
            <p className="text-[0.85rem] mt-1">실시간 도서관 데이터를 제공합니다</p>
          </footer>
        </div>
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
