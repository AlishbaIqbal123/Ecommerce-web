/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Islamic-inspired palette
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EDE0',
          300: '#E8DCC8',
        },
        beige: {
          DEFAULT: '#F5EDE0',
          50: '#FDFAF5',
          100: '#F5EDE0',
          200: '#E8DCC8',
          300: '#D4C4A8',
        },
        sand: {
          DEFAULT: '#E8DCC8',
          50: '#F5F0E8',
          100: '#E8DCC8',
          200: '#D4C4A8',
          300: '#C0AC88',
        },
        blush: {
          DEFAULT: '#E8D5D0',
          50: '#F5EEEC',
          100: '#E8D5D0',
          200: '#D4B5AD',
          300: '#C0958A',
        },
        sage: {
          DEFAULT: '#C5D1C8',
          50: '#E8EDE9',
          100: '#C5D1C8',
          200: '#9DB5A0',
          300: '#759978',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          50: '#4A4A4A',
          100: '#2D2D2D',
          200: '#1A1A1A',
          300: '#0D0D0D',
        },
        gold: {
          DEFAULT: '#C9A962',
          50: '#D9C994',
          100: '#C9A962',
          200: '#B08A3E',
          300: '#8C6D2F',
        },
        // ShadCN theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        body: ['Inter', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.08)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounceSlow 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
