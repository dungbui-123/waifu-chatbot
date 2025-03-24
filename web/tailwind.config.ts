import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      aspectRatio: {
        '4/3': '4/3'
      },
      minHeight: {
        content: 'calc(100vh - 3.75rem - 2.5rem)'
      },
      height: {
        content: 'calc(100vh - 3.75rem - 2.5rem - 6rem)'
      },
      backgroundColor: {
        logo: 'rgb(var(--rgb-gray-0))',
        timer: 'var(--clr-timer)',
        'online-round-bottom': 'rgb(var(--rgb-tile-active-bottom))'
      },
      backgroundImage: {
        'auth-blur-r': 'linear-gradient(to left,var(--clr-bg),transparent)',
        'auth-blur-l': 'linear-gradient(to right,var(--clr-bg),transparent)',
        'auth-bottom': 'url(/images/auth-bottom.png)',
        game: 'var(--clr-game-bg)',
        navbar: 'linear-gradient(to right,rgb(var(--rgb-gray-0)) 50%,transparent)',
        sidebar: 'linear-gradient(175deg,rgb(var(--rgb-gray-1)) 0,rgba(var(--rgb-gray-0),.7) 85%)',
        'side-link':
          'linear-gradient(95.67deg,rgb(var(--rgb-sidebar-highlight)) 0,rgba(var(--rgb-sidebar-highlight),0) 92.54%)',
        panel: 'var(--panel-bg)',
        'panel-secondary':
          'radial-gradient(82.25% 100% at 50% 0,rgba(var(--rgb-gray-1),.75) 37.28%,rgba(var(--rgb-gray-0),0) 100%)',
        stack: 'linear-gradient(95.41deg,rgba(var(--rgba-tile-top)) 0,rgba(var(--rgba-tile-bottom)) 101.76%)',
        'leaderboard-top':
          'linear-gradient(95.41deg,rgba(var(--rgba-tile-top)) 0,rgba(var(--rgba-tile-bottom)) 101.76%)',
        'leaderboard-top-1': 'linear-gradient(95.41deg,rgba(var(--rgba-tile-top)) 0,var(--gold-shadow-color) 101.76%)',
        'leaderboard-top-2':
          'linear-gradient(95.41deg,rgba(var(--rgba-tile-top)) 0,var(--silver-shadow-color) 101.76%)',
        'leaderboard-top-3':
          'linear-gradient(95.41deg,rgba(var(--rgba-tile-top)) 0,var(--bronze-shadow-color) 101.76%)',
        filter: 'linear-gradient(95deg,rgb(var(--rgb-tile-active-top)) 0,rgb(var(--rgb-tile-active-bottom)) 100%)',
        'top-user': 'linear-gradient(180deg,rgb(var(--podium-rgb-0)) 0,rgba(var(--podium-rgb-0),0) 100%)',
        'top-user-after':
          'radial-gradient(167.5% 203.72% at 48.5% -21.62%,rgb(var(--podium-rgb-1)) 0,rgba(var(--podium-rgb-0),.5) 100%);',
        'main-profile-light':
          'linear-gradient( 45deg, rgba(var(--rgb-tile-top), 0.45), rgba(var(--rgb-tile-bottom), 0.45) ), linear-gradient( to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.8) ), url(/images/profile-bg.jpg)',
        'main-profile-dark':
          'linear-gradient(45deg,rgba(var(--rgb-tile-top),.45),rgba(var(--rgb-tile-bottom),.45)),linear-gradient(to bottom,rgba(0,0,0,.8),#000),url(/images/profile-bg.jpg)'
      },
      borderWidth: {
        'app-icon': '1.5px'
      },
      boxShadow: {
        btn: 'inset 1px 1px 2px rgba(var(--rgb-white), 0.1)',
        badge: 'inset 1px 1px 2px hsla(0, 0%, 100%, 0.1)',
        'app-icon': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'app-icon-hover': '-4px -4px 0px rgba(0, 0, 0, 0.8)',
        panel: 'var(--panel-shadow)',
        'panel-secondary':
          '0 0 30px rgba(var(--rgb-brand),0),0 20px 50px rgba(0,0,0,.1),inset 0 1px 3px hsla(0,0%,100%,.1)',
        'stack-dark': '0 8px 36px rgba(0,0,0,.1), 0 24px 74px rgba(0,0,0,.15), inset 1px 1px 3px hsla(0,0%,100%,.1)',
        'stack-light': '0px 0 20px rgba(0, 0, 0, 0.1)',
        hard: 'var(--hard-shadow)',
        timer: '0 10px 5px -5px rgba(0, 0, 0, .2)',
        'timer-item': 'inset 0 1px 2px 0 hsla(0, 0%, 100%, .1)',
        glory: 'var(--glory-shadow)',
        'popover-light': '0 10px 80px rgba(0,0,0,.25)',
        'popover-dark': '0 10px 80px rgba(0,0,0,.75)'
      },
      dropShadow: {
        'plus-badge': '0 0 14px yellow'
      },
      gridTemplateColumns: {
        'auto-22%': 'repeat(auto-fill, minmax(22%, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(15rem, 1fr))',
        'auto-fill-stack': 'repeat(auto-fill, minmax(16rem, 1fr))',
        'auto-fill-word': 'repeat(auto-fill, minmax(5rem, 1fr))',
        'auto-fill-benefit': 'repeat(auto-fill, minmax(35rem, 1fr))',
        'auto-game-list': 'repeat(4, 22rem)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    },
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
} satisfies Config

export default config
