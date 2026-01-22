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
        // Primary Green (소나무 초록)
        primary: {
          DEFAULT: '#2D7A4E',
          light: '#4CAF6F',
          lighter: '#E8F5E9',
          dark: '#1B5E3A',
        },
        // 상태 색상
        status: {
          available: {
            bg: '#DCFCE7',
            text: '#15803D',
          },
          'on-loan': {
            bg: '#FEE2E2',
            text: '#B91C1C',
          },
          'in-library': {
            bg: '#FEF3C7',
            text: '#92400E',
          },
          owned: {
            bg: '#F3F4F6',
            text: '#15803D',
          },
          'not-owned': {
            bg: '#F3F4F6',
            text: '#B91C1C',
          },
        },
        // 도서관 유형 색상
        library: {
          public: '#3455b3',
          smart: '#8B5CF6',
          education: 'rgb(12, 167, 115)',
        },
        // 중립 색상
        text: {
          primary: '#1E293B',
          secondary: '#475569',
          tertiary: '#94A3B8',
          disabled: '#CBD5E1',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          surface: '#F9FAFB',
          border: '#E5E7EB',
          divider: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // 모바일 우선 (16px 기본)
        'h1': ['28px', { lineHeight: '1.4', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
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
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
