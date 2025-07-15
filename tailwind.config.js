/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Simple, high-contrast color palette
        primary: {
          DEFAULT: '#3b82f6', // Blue
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6b7280', // Gray
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#059669', // Green
          foreground: '#ffffff',
        },
        danger: {
          DEFAULT: '#ef4444', // Red
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#d97706', // Orange
          foreground: '#ffffff',
        },
        // Clean background colors
        background: '#f8fafc', // Very light gray
        foreground: '#1e293b', // Dark gray
        card: '#ffffff', // Pure white
        border: '#e2e8f0', // Light gray
        input: '#ffffff', // White
        ring: '#3b82f6', // Blue for focus
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
