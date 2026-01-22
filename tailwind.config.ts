import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple Green Theme - Primary Colors
        primary: {
          DEFAULT: '#34C759',
          light: '#30D158',
          lighter: '#E8F5E9',
          dark: '#248A3D',
        },
        // 상태 색상 - Green Theme
        status: {
          available: {
            bg: '#E8F5E9',
            text: '#248A3D',
          },
          'on-loan': {
            bg: '#FFE8E8',
            text: '#FF3B30',
          },
          'in-library': {
            bg: '#FFF9E6',
            text: '#FF9500',
          },
          owned: {
            bg: '#E8F5E9',
            text: '#248A3D',
          },
          'not-owned': {
            bg: '#F5F5F7',
            text: '#FF3B30',
          },
        },
        // 도서관 유형 색상 - Green Theme
        library: {
          public: '#34C759',
          smart: '#AF52DE',
          education: '#007AFF',
        },
        // iOS 스타일 중립 색상
        text: {
          primary: '#1D1D1F',
          secondary: '#86868B',
          tertiary: '#8E8E93',
          disabled: '#C7C7CC',
        },
        bg: {
          DEFAULT: '#F5F5F7',
          surface: '#FFFFFF',
          border: '#D2D2D7',
          divider: '#E5E5EA',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Pretendard Variable', 'Pretendard', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // SF Pro 스타일 타이포그래피
        'h1': ['34px', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2': ['28px', { lineHeight: '1.29', fontWeight: '700', letterSpacing: '-0.015em' }],
        'h3': ['22px', { lineHeight: '1.36', fontWeight: '600', letterSpacing: '-0.01em' }],
        'body': ['17px', { lineHeight: '1.47', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '1.47', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.38', fontWeight: '400' }],
      },
      spacing: {
        // 8px 기반 스페이싱
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      minHeight: {
        'touch': '44px', // 최소 터치 타겟
      },
      minWidth: {
        'touch': '44px', // 최소 터치 타겟
      },
    },
  },
  plugins: [],
}

export default config
