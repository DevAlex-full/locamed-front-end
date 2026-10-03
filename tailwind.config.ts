import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Clinical Atelier Palette
        brand: {
          navy: '#0F172A',      // Deep Authority
          blue: '#2563EB',      // Precision Action
          slate: '#64748B',     // Muted Steel
          background: '#F8FAFC', // Clinical Grey
          surface: '#FFFFFF',    // Surgical White
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          neutral: '#94A3B8',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { 
          DEFAULT: 'hsl(var(--primary))', 
          foreground: 'hsl(var(--primary-foreground))' 
        },
        secondary: { 
          DEFAULT: 'hsl(var(--secondary))', 
          foreground: 'hsl(var(--secondary-foreground))' 
        },
        destructive: { 
          DEFAULT: 'hsl(var(--destructive))', 
          foreground: 'hsl(var(--destructive-foreground))' 
        },
        muted: { 
          DEFAULT: 'hsl(var(--muted))', 
          foreground: 'hsl(var(--muted-foreground))' 
        },
        accent: { 
          DEFAULT: 'hsl(var(--accent))', 
          foreground: 'hsl(var(--accent-foreground))' 
        },
        popover: { 
          DEFAULT: 'hsl(var(--popover))', 
          foreground: 'hsl(var(--popover-foreground))' 
        },
        card: { 
          DEFAULT: 'hsl(var(--card))', 
          foreground: 'hsl(var(--card-foreground))' 
        },
      },
      borderRadius: {
        none: '0',
        sm: '2px',    // Precision Radius
        md: '4px',    // Professional Radius
        lg: '8px',    // Soft Surface
      },
      boxShadow: {
        'premium': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
} satisfies Config
