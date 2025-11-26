/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'shimmer': 'shimmer 2s infinite',
        
        // --- SUPER FAST SPEEDS ---
        'blob': 'blob 3s infinite',       // Was 7s
        'blob-fast': 'blob 2s infinite',  // Was 4s (Hyper active)
        'blob-slow': 'blob 5s infinite',  // Was 10s
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
        
        // --- NEW: The "Corner to Corner" Physics ---
        // These move the blobs across 30-50% of the screen width/height
        wander1: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30vw, -20vh) scale(1.2)' }, // Move Right-Up
          '66%': { transform: 'translate(-10vw, 20vh) scale(0.8)' }, // Move Left-Down
          '100%': { transform: 'translate(20vw, 10vh) scale(1)' },   // Move Right-Down
        },
        wander2: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-30vw, 30vh) scale(1.1)' }, // Move Left-Down
          '66%': { transform: 'translate(20vw, -10vh) scale(0.9)' }, // Move Right-Up
          '100%': { transform: 'translate(-10vw, 10vh) scale(1.1)' }, // Move Left-Down
        },
        wander3: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(25vw, 25vh) scale(1.3)' }, // Move Diagonal Down
          '100%': { transform: 'translate(-20vw, -20vh) scale(0.8)' }, // Move Diagonal Up
        }
      }
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'fade-in-up': 'fadeInUp 0.5s ease-out',
//         'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
//         'shimmer': 'shimmer 2s infinite',
//         // Speeds for the blobs
//         'blob': 'blob 7s infinite',
//         'blob-fast': 'blob 4s infinite',  // Fast!
//         'blob-slow': 'blob 10s infinite', // Slow & Heavy
//       },
//       keyframes: {
//         fadeInUp: {
//           '0%': { opacity: '0', transform: 'translateY(10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         shake: {
//           '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
//           '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
//           '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
//           '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
//         },
//         shimmer: {
//           '100%': { transform: 'translateX(100%)' },
//         },
//         // MOVEMENT PHYSICS (Large distances)
//         blob: {
//           '0%': { transform: 'translate(0px, 0px) scale(1)' },
//           '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
//           '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
//           '100%': { transform: 'translate(0px, 0px) scale(1)' },
//         }
//       }
//     },
//   },
//   plugins: [],
// }
