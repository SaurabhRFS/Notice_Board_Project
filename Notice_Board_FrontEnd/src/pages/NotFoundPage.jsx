import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center relative overflow-hidden p-4">
      
      {/* 1. Reuse the cool background */}
      <AnimatedBackground />

      {/* 2. Centered Glass Card */}
      <GlassCard className="text-center !max-w-md border-red-100">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-inner">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl font-black text-slate-800 mb-2 tracking-tighter">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
          Oops! It seems you've wandered off the campus map. This page doesn't exist.
        </p>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Go Back Home
        </button>

      </GlassCard>
    </div>
  );
};

export default NotFoundPage;