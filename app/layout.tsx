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
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
