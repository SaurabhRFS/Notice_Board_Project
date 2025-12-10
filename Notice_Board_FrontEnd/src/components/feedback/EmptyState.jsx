import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchX } from 'lucide-react';

const EmptyState = ({ message = "All Caught Up!", subMessage = "Check back later for new announcements." }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  
  // --- GLOBAL PHYSICS ENGINE ---
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const { innerWidth, innerHeight } = globalThis;
      
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      // Deep 3D Rotation (Max 50 degrees)
      const rotateX = y * -50; 
      const rotateY = x * 50;  

      setRotate({ x: rotateX, y: rotateY });
    };

    globalThis.addEventListener('mousemove', handleGlobalMouseMove);
    return () => globalThis.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center animate-fade-in-up overflow-visible perspective-1200">
      
      {/* CSS: Amplified Glitch Animation */}
      <style>{`
        @keyframes float-3d {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -20px, 0); }
        }
        @keyframes glitch-twitch {
          0%, 50% { transform: translate(0); opacity: 0; } /* Silent for longer */
          86% { transform: translate(-5px, 3px); opacity: 0.8; } /* Big Jump */
          88% { transform: translate(5px, -3px); opacity: 0.8; }
          90% { transform: translate(-4px, 0px); opacity: 0.8; }
          92% { transform: translate(4px, 3px); opacity: 0.8; }
          94% { transform: translate(0); opacity: 0; }
          100% { transform: translate(0); opacity: 0; }
        }
        .animate-float-3d {
          animation: float-3d 6s ease-in-out infinite;
        }
        .animate-glitch {
          animation: glitch-twitch 0.8s infinite; /* Faster Frequency (2s) */
        }
      `}</style>

      {/* --- THE 3D STAGE (Native Button Fix) --- */}
      <button 
        type="button"
        className="relative group cursor-pointer outline-none bg-transparent border-none p-0"
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
        onTouchStart={() => setIsClicked(true)}
        onTouchEnd={() => setIsClicked(false)}
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${rotate.x}deg) 
            rotateY(${rotate.y}deg)
            scale(${isClicked ? 0.9 : 1})
          `,
          transition: 'transform 0.1s ease-out'
        }}
      >
        
        {/* 1. The Aura */}
        <div 
          className="absolute inset-0 bg-purple-500/30 blur-[80px] rounded-full pointer-events-none"
          style={{ transform: 'translateZ(-50px)' }} 
        />

        {/* 2. The Floating Wrapper */}
        <div className="animate-float-3d transform-style-3d">
          
          {/* --- THE GLASS BOX --- */}
          <div className="
            relative w-36 h-36
            bg-gradient-to-br from-white/40 via-white/10 to-transparent
            backdrop-blur-md border border-white/50
            rounded-[2.5rem] shadow-2xl
            flex items-center justify-center
            transform-style-3d overflow-hidden
          ">
            
            {/* Dynamic Glare */}
            <div 
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-50"
              style={{ 
                opacity: 0.5 + (Math.abs(rotate.x) + Math.abs(rotate.y)) / 100,
                transform: `translateX(${rotate.y * -2}px) translateY(${rotate.x * -2}px)`
              }}
            />

            {/* --- PRISMATIC ICON (The "Z Z Z" Effect) --- */}
            <div className="relative z-20" style={{ transform: 'translateZ(60px)' }}>
              
              {/* RED CHANNEL (Twitches Left) */}
              <div 
                className="absolute inset-0 text-red-500/60 mix-blend-screen blur-[1px] animate-glitch"
                style={{ 
                  transform: `translateX(${rotate.y * 0.1}px)`,
                  animationDelay: '0ms'
                }}
              >
                <SearchX size={64} strokeWidth={1.5} />
              </div>

              {/* BLUE CHANNEL (Twitches Right) */}
              <div 
                className="absolute inset-0 text-blue-500/60 mix-blend-screen blur-[1px] animate-glitch"
                style={{ 
                  transform: `translateX(${rotate.y * -0.1}px)`,
                  animationDelay: '50ms' 
                }}
              >
                <SearchX size={64} strokeWidth={1.5} />
              </div>

              {/* MAIN CHANNEL (Solid) */}
              <SearchX 
                size={64} 
                className="text-slate-700/90 relative z-10 drop-shadow-xl" 
                strokeWidth={1.5} 
              />
            </div>

            {/* Glass Rim */}
            <div className="absolute top-0 left-0 w-full h-full rounded-[2.5rem] border-t-2 border-l-2 border-white/60 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-full rounded-[2.5rem] border-b-2 border-r-2 border-white/20 pointer-events-none" />
          </div>

          {/* 3. Parallax Orbs */}
          <div 
            className="absolute -top-8 -right-8 w-12 h-12 bg-blue-400/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg"
            style={{ transform: `translateZ(40px) translateX(${rotate.y * -1.5}px) translateY(${rotate.x * 1.5}px)` }}
          />
          
          <div 
            className="absolute -bottom-6 -left-10 w-8 h-8 bg-purple-400/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg"
            style={{ transform: `translateZ(80px) translateX(${rotate.y * 2}px) translateY(${rotate.x * -2}px)` }}
          />

        </div>
      </button>

      {/* --- TEXT CONTENT (Now Glitched!) --- */}
      <div 
        className="relative z-10 mt-12 pointer-events-none select-none transition-transform duration-200"
        style={{ transform: `translateX(${rotate.y * 0.5}px) translateY(${rotate.x * 0.5}px)` }}
      >
        <div className="relative inline-block">
            {/* RED TEXT CHANNEL */}
            <h3 className="absolute inset-0 text-3xl font-black text-red-500/40 animate-glitch blur-[1px] select-none" aria-hidden="true">
              {message}
            </h3>
            
            {/* BLUE TEXT CHANNEL */}
            <h3 className="absolute inset-0 text-3xl font-black text-blue-500/40 animate-glitch blur-[1px] select-none" style={{ animationDelay: '50ms' }} aria-hidden="true">
              {message}
            </h3>

            {/* MAIN TEXT CHANNEL */}
            <h3 className="relative text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">
              {message}
            </h3>
        </div>

        <p className="text-slate-500 font-bold text-lg leading-relaxed mt-2">
          {subMessage}
        </p>
      </div>

    </div>
  );
};

// Define Prop Types
EmptyState.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
};

export default EmptyState;