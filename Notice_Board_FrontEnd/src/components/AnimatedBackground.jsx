import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      
      {/* --- GIANT BLOBS (Normal Speed) --- */}
      
      {/* 1. Purple (Top Left) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-1"></div>
      
      {/* 2. Cyan (Top Right) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-2 animation-delay-2000"></div>
      
      {/* 3. Pink (Bottom Left) */}
      <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-3 animation-delay-4000"></div>
      
      {/* 4. Yellow (Bottom Right) */}
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-1 animation-delay-1000"></div>

      {/* 5. Indigo (Center) */}
      <div className="absolute top-[40%] left-[20%] w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-2 animation-delay-500"></div>

      {/* 6. Orange (Top Center) */}
      <div className="absolute top-[10%] left-[50%] w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-3 animation-delay-2500"></div>

      {/* 7. Teal (Bottom Center) */}
      <div className="absolute bottom-[10%] right-[40%] w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-wander-1 animation-delay-1500"></div>


      {/* --- SMALL BLOBS (Super Slow Motion) --- */}
      
      {/* 8. Small Red (Drifting slowly in top right) */}
      <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-wander-slow-1"></div>

      {/* 9. Small Green (Drifting bottom left) */}
      <div className="absolute bottom-[30%] left-[40%] w-24 h-24 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-wander-slow-2 animation-delay-1000"></div>

      {/* 10. Small Blue (Center Float) */}
      <div className="absolute top-[50%] right-[50%] w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-90 animate-wander-slow-1 animation-delay-3000"></div>

      {/* 11. Small Violet (Corner Float) */}
      <div className="absolute bottom-[10%] left-[10%] w-35 h-35 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-wander-slow-2 animation-delay-2000"></div>

      {/* 12. Small Amber (Top Patrol) */}
      <div className="absolute top-[5%] right-[30%] w-24 h-24 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-wander-slow-1 animation-delay-4000"></div>

    </div>
  );
};

export default AnimatedBackground;