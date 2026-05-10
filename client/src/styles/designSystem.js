// Custom Design System - Moving away from AI-generated templates
export const designTokens = {
  colors: {
    primary: {
      50: '#FF6B35',
      100: '#FF8C42',
      500: '#FF9F1C',
      600: '#FFB84D',
      700: '#FFA726',
      800: '#FFBDBA',
      900: '#FFC3A2'
    },
    secondary: {
      50: '#1E293B',
      100: '#1E40AF',
      500: '#E11D48',
      600: '#D97706',
      700: '#B91C1C',
      800: '#9333EA',
      900: '#7C3AED'
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#FEF3C7',
      400: '#E2E8F0',
      500: '#D1D5DB',
      600: '#9CA3AF',
      700: '#6B7280',
      800: '#4B5563',
      900: '#1F2937'
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      base: '0 4px 6px rgba(0, 0, 0, 0.07)',
      md: '0 10px 15px rgba(0, 0, 0, 0.1)',
      lg: '0 20px 25px rgba(0, 0, 0, 0.15)',
      xl: '0 25px 50px rgba(0, 0, 0, 0.25)'
    },
    animation: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.4, 0, 0.2, 0)'
      }
    }
  },
  
  components: {
    button: {
      base: 'px-6 py-3 font-medium rounded-lg transition-all duration-200',
      variants: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500',
        outline: 'border-2 border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-2 focus:ring-secondary-500',
        ghost: 'text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100',
        danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-2 focus:ring-error-400'
      }
    },
    input: {
      base: 'px-4 py-3 border-2 border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white',
      error: 'border-2 border-error-300 bg-error-50 focus:ring-2 focus:ring-error-500 focus:border-error-500'
    },
    card: {
      base: 'bg-white rounded-xl shadow-md border border-neutral-100',
      elevated: 'bg-white rounded-xl shadow-lg border border-neutral-100',
      floating: 'bg-white rounded-2xl shadow-xl border border-neutral-100 backdrop-blur-sm'
    }
  }
};

// Custom utility classes
export const customClasses = {
  // Unique animations
  'float-gentle': 'animate-float-gentle',
  'slide-up': 'animate-slide-up',
  'fade-in': 'animate-fade-in',
  'pulse-soft': 'animate-pulse-soft',
  
  // Custom gradients
  'gradient-primary': 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700',
  'gradient-secondary': 'bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700',
  'gradient-accent': 'bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600',
  
  // Custom effects
  'glass': 'bg-white/80 backdrop-blur-xl border border-white/20',
  'glow': 'shadow-lg shadow-primary/20',
  'subtle': 'text-neutral-600 hover:text-neutral-800'
};
