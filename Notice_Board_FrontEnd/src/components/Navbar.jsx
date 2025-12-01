import React, { useState, useEffect } from 'react';
import { LogOut, Shield, PenTool, Menu, X, Sun, Moon, Sunset } from 'lucide-react';

const Navbar = ({ username, userRole, onLogout, onCreateClick, onAdminClick }) => {
  const [greeting, setGreeting] = useState({ text: 'Hello', theme: 'morning', icon: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- 1. Advanced Time Logic ---
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      // Morning: 5 AM - 11:59 AM
      setGreeting({ 
        text: 'Good Morning', 
        theme: 'morning', 
        icon: <Sun className="text-amber-500 drop-shadow-sm" size={20} /> 
      });
    } else if (hour >= 12 && hour < 17) {
      // Afternoon: 12 PM - 4:59 PM (Bright Sun, NOT Sunset)
      setGreeting({ 
        text: 'Good Afternoon', 
        theme: 'afternoon', 
        icon: <Sun className="text-orange-500 drop-shadow-sm" size={20} /> 
      });
    } else if (hour >= 17 && hour < 21) {
      // Evening: 5 PM - 8:59 PM (Sunset Icon belongs here)
      setGreeting({ 
        text: 'Good Evening', 
        theme: 'evening', 
        icon: <Sunset className="text-rose-500 drop-shadow-sm" size={20} /> 
      });
    } else {
      // Night: 9 PM - 4:59 AM (Moon + Good Night)
      setGreeting({ 
        text: 'Good Night', 
        theme: 'night', 
        icon: <Moon className="text-indigo-500 drop-shadow-sm" size={20} fill="currentColor" /> 
      });
    }
  }, []);

  // Helper for text colors
  const getGreetingStyle = () => {
    switch (greeting.theme) {
      case 'morning': return "text-amber-700"; 
      case 'evening': return "text-orange-700"; 
      case 'night':   return "text-indigo-800"; 
      default: return "text-slate-800";
    }
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR (Floating "Balanced" Glass) --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 hidden md:block">
        
        {/* Container Styles:
            - bg-white/40: The perfect middle ground.
            - border-white/50: Slightly softer border.
            - shadow-[inset...]: The white "lip" on top is preserved.
        */}
        <div className="relative rounded-full border border-white/50 bg-white/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.05)] px-8 py-3 flex items-center justify-between transition-all hover:bg-white/50">
          
          {/* Glossy Overlay (Subtle Shine) */}
          <div className="absolute inset-x-4 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent opacity-50 rounded-t-full pointer-events-none" />

          {/* 1. LEFT: Brand */}
          <div className="flex flex-col leading-none select-none z-10">
            <span className="text-[10px] font-extrabold text-slate-500 tracking-[0.25em] uppercase pl-0.5">Campus</span>
            <span className="text-xl font-black text-slate-800 tracking-tighter drop-shadow-sm">NOTICE</span>
          </div>

          {/* 2. CENTER: Greeting */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center leading-none z-10">
            <div className="flex items-center gap-2 mb-0.5">
              {greeting.icon}
              <span className={`text-[11px] font-bold tracking-widest uppercase ${getGreetingStyle()}`}>
                {greeting.text}
              </span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              {username}
            </span>
          </div>

          {/* 3. RIGHT: Controls */}
          <div className="flex items-center gap-3 z-10">
            
            {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
              <button 
                onClick={onCreateClick}
                className="group relative px-5 py-2.5 rounded-full bg-white/30 border border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] hover:bg-white/60 transition-all flex items-center gap-2"
              >
                <PenTool size={16} className="text-slate-700 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Post Notice</span>
              </button>
            )}

            {userRole === 'ROLE_ADMIN' && (
              <button 
                onClick={onAdminClick}
                className="p-3 rounded-full bg-white/30 border border-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] hover:bg-white/60 transition-all group"
                title="Admin Panel"
              >
                <Shield size={20} className="text-slate-600 group-hover:text-purple-600 transition-colors" strokeWidth={2.5} />
              </button>
            )}

            <div className="w-px h-6 bg-slate-400/40 mx-1"></div>

            <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE NAVBAR (Fixed + Glass + Greeting) --- */}
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50">
        <div className="rounded-2xl border border-white/50 bg-white/60 backdrop-blur-xl shadow-lg px-5 py-3 flex justify-between items-center relative overflow-hidden">
          
          {/* Glossy Overlay */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Left: Brand */}
          <div className="flex flex-col leading-none z-10">
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Campus</span>
            <span className="text-lg font-black text-slate-800 tracking-tighter">NOTICE</span>
          </div>

          {/* Right: Greeting + Menu */}
          <div className="flex items-center gap-3 z-10">
            
            {/* --- MOBILE GREETING (Visible Now) --- */}
            <div className="flex flex-col items-end"> 
              <div className="flex items-center gap-1">
                {greeting.icon}
                <span className={`text-[10px] font-bold uppercase ${getGreetingStyle()}`}>{greeting.text}</span>
              </div>
              <span className="text-xs font-black text-slate-800">{username}</span>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 bg-white/40 rounded-full border border-white/40 text-slate-700 active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-28 px-6 space-y-4 md:hidden animate-fade-in-up">
           
           {/* Big Greeting in Menu */}
           <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                {greeting.icon}
                <span className={`text-sm font-bold uppercase tracking-widest ${getGreetingStyle()}`}>{greeting.text}</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900">{username}</h2>
           </div>
           
           {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
             <button onClick={() => { onCreateClick(); setIsMobileMenuOpen(false); }} className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center gap-3 font-bold text-slate-800 active:scale-95 transition-transform">
               <PenTool size={20} /> Post Notice
             </button>
           )}

           {userRole === 'ROLE_ADMIN' && (
             <button onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }} className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center gap-3 font-bold text-slate-700 active:scale-95 transition-transform">
               <Shield size={20} /> Admin Panel
             </button>
           )}

           <button onClick={onLogout} className="w-full p-4 text-red-500 font-bold mt-8 flex items-center justify-center gap-2">
             <LogOut size={20} /> Logout
           </button>
        </div>
      )}
    </>
  );
};

export default Navbar;