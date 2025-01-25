import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'blob-1': 'blob-1 20s infinite',
        'blob-2': 'blob-2 25s infinite',
        'blob-3': 'blob-3 30s infinite',
        'blob-4': 'blob-4 35s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'blob-1': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(150px, -100px) scale(1.2)',
          },
          '50%': {
            transform: 'translate(-50px, 100px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(-100px, -50px) scale(1.1)',
          },
        },
        'blob-2': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(-100px, 100px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(100px, 50px) scale(0.9)',
          },
        },
        'blob-3': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(100px, -100px) scale(0.8)',
          },
          '66%': {
            transform: 'translate(-150px, 50px) scale(1.2)',
          },
        },
        'blob-4': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(-100px, -150px) scale(1.2)',
          },
          '50%': {
            transform: 'translate(100px, 100px) scale(0.8)',
          },
          '75%': {
            transform: 'translate(50px, -100px) scale(1.1)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
