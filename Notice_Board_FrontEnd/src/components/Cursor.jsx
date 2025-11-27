import React, { useEffect, useRef } from 'react';

// --- Configuration ---
const PARTICLE_COUNT = 20; // Higher count to handle fast movement without gaps
const SPACING = 1;          // Spawn a particle every 3 pixels (Lower = Denser)
const FADE_SPEED = 0.02;    // How fast they disappear
const COLORS = ['#4f46e5', '#0ea5e9', '#ec4899', '#8b5cf6']; // Indigo, Sky, Pink, Violet (Vibrant)

const Cursor = () => {
  const cursorRef = useRef(null);
  const particleRefs = useRef([]);
  const particlesData = useRef([]);
  
  const mouse = useRef({ x: -100, y: -100 });
  const lastMouse = useRef({ x: -100, y: -100 });
  const spawnIndex = useRef(0);
  const isHovering = useRef(false);

  // Initialize data pool
  if (particlesData.current.length === 0) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesData.current.push({
        x: -100, y: -100, // Start off-screen
        vx: 0, vy: 0, 
        life: 0, 
        color: '#fff',
        scale: 1
      });
    }
  }

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Initialize lastMouse position on first movement to prevent giant streak
      if (lastMouse.current.x === -100) {
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }

      const target = e.target;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') || 
        target.closest('a');
      
      isHovering.current = !!isClickable;
    };

    const animate = () => {
      // 1. Move the Head (Responsive)
      if (cursorRef.current) {
        // Fast lerp for responsiveness
        const currentX = parseFloat(cursorRef.current.dataset.x || mouse.current.x);
        const currentY = parseFloat(cursorRef.current.dataset.y || mouse.current.y);
        
        const nextX = currentX + (mouse.current.x - currentX) * 0.5;
        const nextY = currentY + (mouse.current.y - currentY) * 0.5;

        cursorRef.current.dataset.x = nextX;
        cursorRef.current.dataset.y = nextY;

        const scale = isHovering.current ? 2 : 1;
        cursorRef.current.style.transform = `translate(${nextX}px, ${nextY}px) scale(${scale})`;
      }

      // 2. Interpolation Logic (The Fix for Fast Movement)
      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      const distance = Math.hypot(dx, dy);
      
      // Calculate how many particles fit in the gap
      const steps = Math.floor(distance / SPACING);

      if (steps > 0) {
        for (let i = 0; i < steps; i++) {
          const idx = spawnIndex.current;
          const p = particlesData.current[idx];
          
          // Calculate exact intermediate position
          const percent = i / steps;
          p.x = lastMouse.current.x + (dx * percent);
          p.y = lastMouse.current.y + (dy * percent);
          
          // Gentle random drift
          p.vx = (Math.random() - 0.5) * 0.5; 
          p.vy = (Math.random() - 0.5) * 0.5;
          
          p.life = 1; 
          p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          p.scale = Math.random() * 0.5 + 0.5; 

          spawnIndex.current = (spawnIndex.current + 1) % PARTICLE_COUNT;
        }
        // Update last position to current
        lastMouse.current = { ...mouse.current };
      }

      // 3. Update Particles
      particlesData.current.forEach((p, i) => {
        const el = particleRefs.current[i];
        if (!el) return;

        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= FADE_SPEED; 
          p.scale -= 0.005;

          el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${Math.max(0, p.scale)}) rotate(${p.life * 180}deg)`;
          el.style.opacity = p.life;
          el.style.backgroundColor = p.color;
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* The Head Dot (Keep on top z-50) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />

      {/* The Sparkle Pool */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (particleRefs.current[i] = el)}
          // REMOVED: 'mix-blend-screen' (It hides colors on white backgrounds)
          // ADDED: 'mix-blend-multiply' (Makes colors pop on white)
          className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-[-1] mix-blend-multiply -translate-x-1/2 -translate-y-1/2"
          style={{
            willChange: 'transform, opacity',
            display: 'none',
            borderRadius: i % 2 === 0 ? '50%' : '0%', 
          }}
        />
      ))}
      
    </>
  );
};

export default Cursor;

// import React, { useEffect, useRef } from 'react';

// // --- Configuration ---
// const PARTICLE_COUNT = 25; // Number of stars/dust available
// const COLORS = ['#facc15', '#22d3ee', '#e879f9', '#ffffff']; // Gold, Cyan, Pink, White

// const Cursor = () => {
//   const cursorRef = useRef(null);
  
//   // Arrays to manage our pool of particles
//   const particleRefs = useRef([]); // The actual DOM elements
//   const particlesData = useRef([]); // The math (x, y, life, etc.)
  
//   // Track mouse and "spawn index"
//   const mouse = useRef({ x: -100, y: -100 });
//   const lastMouse = useRef({ x: -100, y: -100 }); // To calculate speed
//   const spawnIndex = useRef(0);
//   const isHovering = useRef(false);

//   // Initialize data for all particles
//   if (particlesData.current.length === 0) {
//     for (let i = 0; i < PARTICLE_COUNT; i++) {
//       particlesData.current.push({
//         x: 0, 
//         y: 0, 
//         vx: 0, 
//         vy: 0, 
//         life: 0, // 0 = dead, 1 = full life
//         color: '#fff',
//         scale: 1
//       });
//     }
//   }

//   useEffect(() => {
//     const onMouseMove = (e) => {
//       mouse.current = { x: e.clientX, y: e.clientY };
      
//       // Hover detection (same as before)
//       const target = e.target;
//       const isClickable = 
//         target.tagName === 'BUTTON' ||
//         target.tagName === 'A' ||
//         target.tagName === 'INPUT' ||
//         target.tagName === 'TEXTAREA' ||
//         target.tagName === 'SELECT' ||
//         target.closest('button') || 
//         target.closest('a');
      
//       isHovering.current = !!isClickable;
//     };

//     const animate = () => {
//       // 1. Move the Head (The Main Dot)
//       if (cursorRef.current) {
//         // Smoothly follow mouse (Lerp)
//         const currentX = parseFloat(cursorRef.current.dataset.x || 0);
//         const currentY = parseFloat(cursorRef.current.dataset.y || 0);
        
//         const nextX = currentX + (mouse.current.x - currentX) * 0.2;
//         const nextY = currentY + (mouse.current.y - currentY) * 0.2;

//         cursorRef.current.dataset.x = nextX;
//         cursorRef.current.dataset.y = nextY;

//         const scale = isHovering.current ? 1.8 : 1;
//         cursorRef.current.style.transform = `translate(${nextX}px, ${nextY}px) scale(${scale})`;
//       }

//       // 2. Spawn logic: Did we move enough to drop a new star?
//       const dist = Math.hypot(mouse.current.x - lastMouse.current.x, mouse.current.y - lastMouse.current.y);
      
//       if (dist > 2) { // Only spawn if moved > 2px
//         const idx = spawnIndex.current;
//         const p = particlesData.current[idx];
        
//         // Reset this particle to the mouse position
//         p.x = mouse.current.x + (Math.random() * 10 - 5); // Slight scatter
//         p.y = mouse.current.y + (Math.random() * 10 - 5);
        
//         // Random velocity (drift)
//         p.vx = (Math.random() - 0.5) * 2; 
//         p.vy = (Math.random() - 0.5) * 2;
        
//         p.life = 1; // Reset life
//         p.color = COLORS[Math.floor(Math.random() * COLORS.length)]; // Random color
//         p.scale = Math.random() * 0.5 + 0.5; // Random size

//         // Move to next particle in pool
//         spawnIndex.current = (spawnIndex.current + 1) % PARTICLE_COUNT;
//         lastMouse.current = { ...mouse.current };
//       }

//       // 3. Update & Draw Particles
//       particlesData.current.forEach((p, i) => {
//         const el = particleRefs.current[i];
//         if (!el) return;

//         if (p.life > 0) {
//           // Physics: Move and Fade
//           p.x += p.vx;
//           p.y += p.vy;
//           p.life -= 0.03; // Fade speed (higher = faster fade)
//           p.scale -= 0.01; // Shrink speed

//           // Apply to DOM
//           el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${Math.max(0, p.scale)}) rotate(${p.life * 100}deg)`;
//           el.style.opacity = p.life;
//           el.style.backgroundColor = p.color;
//           el.style.display = 'block';
//         } else {
//           el.style.display = 'none'; // Hide dead particles
//         }
//       });

//       requestAnimationFrame(animate);
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     const animationId = requestAnimationFrame(animate);

//     return () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       cancelAnimationFrame(animationId);
//     };
//   }, []);

//   return (
//     <>
//       {/* The "Head" Dot (Slightly bigger: w-4 h-4) */}
//       <div
//         ref={cursorRef}
//         className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
//         style={{ willChange: 'transform' }}
//       />

//       {/* The Sparkle Pool */}
//       {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
//         <div
//           key={i}
//           ref={(el) => (particleRefs.current[i] = el)}
//           className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-40 mix-blend-screen"
//           style={{
//             willChange: 'transform, opacity',
//             display: 'none', // Hidden by default
//             borderRadius: i % 2 === 0 ? '50%' : '0%', // Mix of circles and squares (diamonds)
//             // If it's a square, the rotation in JS will turn it into a diamond
//           }}
//         />
//       ))}
//     </>
//   );
// };

// export default Cursor;
