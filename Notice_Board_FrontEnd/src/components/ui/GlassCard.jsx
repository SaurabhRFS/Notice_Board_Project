import React from 'react';

const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-md bg-white/30 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl p-8 animate-fade-in-up relative overflow-hidden ${className}`}>
      {/* Internal Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-3xl" />
      
      {/* The Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;