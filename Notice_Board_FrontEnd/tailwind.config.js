/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
  sans: ['Outfit', 'sans-serif'],
},
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        
        // --- The "Flight Paths" ---
        wander1: { // Moves diagonally Top-Left to Bottom-Right
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30vw, 20vh) scale(1.2)' },
          '100%': { transform: 'translate(-10vw, 40vh) scale(0.9)' },
        },
        wander2: { // Moves Looping Left/Right
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-40vw, -10vh) scale(1.1)' },
          '100%': { transform: 'translate(20vw, 10vh) scale(0.9)' },
        },
        wander3: { // Moves Up/Down
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(10vw, -30vh) scale(1.3)' },
          '100%': { transform: 'translate(-20vw, 20vh) scale(0.8)' },
        }
      }
    },
  },
  plugins: [],
}