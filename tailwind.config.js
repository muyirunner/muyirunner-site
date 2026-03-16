/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调升级：紫→蓝→青动态渐变
        primary: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a3bfff',
          400: '#7a9fff',
          500: '#5a7eff',
          600: '#4361ee',
          700: '#3730a3',
          800: '#2e2890',
          900: '#1e1b4b'
        },
        accent: {
          DEFAULT: '#00d4ff',
          dark: '#00b8e6',
          light: '#33ddff',
          glow: '#00ffff',
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#22d3ee'
        },
        // 渐变专用色
        gradient: {
          start: '#a855f7',    // 紫色起点
          middle: '#6366f1',   // 蓝紫中间
          end: '#22d3ee',      // 青色终点
          pink: '#ec4899',
          orange: '#f97316',
          gold: '#fbbf24'
        },
        dark: {
          bg: '#0a0e1a',
          card: '#111827',
          border: '#1f2937',
          surface: '#1a1f35'
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      maxWidth: {
        'container': '1200px'
      },
      backgroundImage: {
        // 基础渐变
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent)',
        // 主题渐变
        'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #22d3ee 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)',
        'gradient-glow': 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
        'gradient-rainbow': 'linear-gradient(90deg, #f97316, #ec4899, #a855f7, #6366f1, #22d3ee)',
        // 极光效果
        'aurora': 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 25%, rgba(34, 211, 238, 0.15) 50%, rgba(168, 85, 247, 0.1) 75%, rgba(236, 72, 153, 0.15) 100%)',
        // 网格背景
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(168, 85, 247, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(34, 211, 238, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(99, 102, 241, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(168, 85, 247, 0.3) 0px, transparent 50%)',
      },
      animation: {
        // 基础动画
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // 增强动画
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'gradient-fast': 'gradient 5s ease infinite',
        // 3D/特效动画
        'spin-slow': 'spin 8s linear infinite',
        'aurora': 'aurora 15s ease infinite',
        'typewriter': 'typewriter 2s steps(20) 1s forwards',
        'blink': 'blink 0.8s infinite',
        'breathing': 'breathing 3s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'tilt': 'tilt 10s infinite linear',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        aurora: {
          '0%, 100%': { opacity: '0.5', transform: 'translateX(-5%) translateY(-5%) rotate(-3deg)' },
          '50%': { opacity: '0.8', transform: 'translateX(5%) translateY(5%) rotate(3deg)' }
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' }
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(168, 85, 247, 0.5)' },
          '33%': { borderColor: 'rgba(99, 102, 241, 0.5)' },
          '66%': { borderColor: 'rgba(34, 211, 238, 0.5)' }
        }
      },
      boxShadow: {
        // 基础阴影
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
        // 渐变阴影
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'glow-multi': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(99, 102, 241, 0.2), 0 0 60px rgba(34, 211, 238, 0.1)',
        // 玻璃态阴影
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // 霓虹效果
        'neon': '0 0 5px theme(colors.accent.DEFAULT), 0 0 20px theme(colors.accent.DEFAULT), 0 0 35px theme(colors.accent.DEFAULT), 0 0 40px theme(colors.accent.DEFAULT)',
        'neon-purple': '0 0 5px #a855f7, 0 0 20px #a855f7, 0 0 35px #a855f7',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      }
    }
  },
  plugins: []
}
