import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import {
  LogOut, Shield, PenTool, Menu, X, Sun, Moon, Sunset,
  Trophy, FileQuestion, Book, Calendar, FlaskConical, // 2. Import FlaskConical
  ShoppingBag, Users
} from 'lucide-react';
import GlassMenuCard from '../ui/GlassMenuCard'; 

const Navbar = ({ username, userRole, onLogout, onCreateClick, onAdminClick }) => {
  const navigate = useNavigate(); // 3. Initialize hook
  const [greeting, setGreeting] = useState({ text: 'Hello', theme: 'morning', icon: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'results',
      label: 'Exam Results',
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      link: 'https://rtmnuresults.org/',
      isExternal: true
    },
    {
      id: 'buysell',
      label: 'Buy & Sell',
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/buy-sell',
      isExternal: false,
      comingSoon: false
    },
    {
      id: 'pyq',
      label: 'Previous Year Qs',
      icon: FileQuestion,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      comingSoon: true
    },
    {
      id: 'notes',
      label: 'Lecture Notes',
      icon: Book,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      comingSoon: true
    },
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: Calendar,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      link: '/calendar',
      comingSoon: false
    },
    {
      id: 'labs',
      label: 'Virtual Labs',
      icon: FlaskConical, 
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      link: '/labs', 
      isExternal: false,
      // REMOVED 'comingSoon' -> Now it is active!
    },
    {
      id: 'community', // <--- 2. NEW FEATURE
      label: 'Community',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      link: '/community',
      isExternal: false,
      comingSoon: true // Locked for now
    },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'Good Morning', theme: 'morning', icon: <Sun className="text-amber-500 drop-shadow-sm" size={20} /> });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: 'Good Afternoon', theme: 'afternoon', icon: <Sun className="text-orange-500 drop-shadow-sm" size={20} /> });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ text: 'Good Evening', theme: 'evening', icon: <Sunset className="text-rose-500 drop-shadow-sm" size={20} /> });
    } else {
      setGreeting({ text: 'Good Night', theme: 'night', icon: <Moon className="text-indigo-500 drop-shadow-sm" size={20} fill="currentColor" /> });
    }
  }, []);

  const getGreetingStyle = () => {
    switch (greeting.theme) {
      case 'morning': return "text-amber-700";
      case 'evening': return "text-orange-700";
      case 'night': return "text-indigo-800";
      default: return "text-slate-800";
    }
  };

  const handleMenuClick = (item) => {
    if (item.comingSoon) return;

    if (item.isExternal) {
      window.open(item.link, '_blank');
    } else {
      navigate(item.link); // 4. Proper Internal Navigation
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 hidden md:block">
        <div className="relative rounded-full border border-white/40 bg-white/20 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_8px_20px_rgba(0,0,0,0.05)] px-8 py-3 flex items-center justify-between transition-all hover:bg-white/30">
          <div className="absolute inset-x-4 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-50 rounded-t-full pointer-events-none" />

          {/* 5. CLICKABLE BRAND LOGO (Go Home) */}
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col leading-none select-none z-10 text-left outline-none"
          >
            <span className="text-[10px] font-extrabold text-slate-500 tracking-[0.25em] uppercase pl-0.5">Campus</span>
            <span className="text-xl font-black text-slate-800 tracking-tighter drop-shadow-sm">NOTICE</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center leading-none z-10">
            <div className="flex items-center gap-2 mb-0.5">
              {greeting.icon}
              <span className={`text-[11px] font-bold tracking-widest uppercase ${getGreetingStyle()}`}>{greeting.text}</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">{username}</span>
          </div>

          <div className="flex items-center gap-3 z-10">
            {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
              <button onClick={onCreateClick} className="group relative px-5 py-2.5 rounded-full bg-white/30 border border-white/50 hover:bg-white/50 transition-all flex items-center gap-2 shadow-sm">
                <PenTool size={16} className="text-slate-700 group-hover:text-blue-600" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Post Notice</span>
              </button>
            )}
            {userRole === 'ROLE_ADMIN' && (
              <button onClick={onAdminClick} className="p-3 rounded-full bg-white/30 border border-white/50 hover:bg-white/50 transition-all group shadow-sm" title="Admin Panel">
                <Shield size={20} className="text-slate-600 group-hover:text-purple-600" strokeWidth={2.5} />
              </button>
            )}
            <div className="w-px h-6 bg-slate-400/30 mx-1"></div>
            <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-full border border-white/40 bg-white/30 text-slate-700 hover:bg-white/50 active:scale-95 transition-all shadow-sm">
              <Menu size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50">
        <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-2xl shadow-lg px-5 py-3 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          
          {/* 6. CLICKABLE BRAND LOGO (Mobile) */}
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col leading-none z-10 text-left outline-none"
          >
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Campus</span>
            <span className="text-lg font-black text-slate-800 tracking-tighter">NOTICE</span>
          </button>

          <div className="flex items-center gap-3 z-10">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                {greeting.icon}
                <span className={`text-[10px] font-bold uppercase ${getGreetingStyle()}`}>{greeting.text}</span>
              </div>
              <span className="text-xs font-black text-slate-800">{username}</span>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 bg-white/30 rounded-full border border-white/30 text-slate-700 active:scale-95 transition-all">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* DRAWER (Slide Menu) */}
      <button
        type="button"
        className={`fixed inset-0 z-[60] bg-slate-900/10 backdrop-blur-[4px] transition-opacity duration-500 w-full h-full border-none cursor-default ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        tabIndex="-1"
        aria-label="Close Menu"
      />

      <div className={`fixed top-0 left-0 h-full z-[70] w-[85%] md:w-[400px] bg-white/30 backdrop-blur-3xl border-r border-white/40 shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Main Menu</h2>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-1 block">Campus Utilities</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/30 border border-white/40 rounded-full text-slate-500 hover:bg-white hover:text-red-500 transition-all shadow-sm">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {menuItems.map((item) => (
              <GlassMenuCard key={item.id} item={item} onClick={() => handleMenuClick(item)} />
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/30 space-y-4">
            {userRole === 'ROLE_ADMIN' && (
              <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }} className="w-full p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-700 font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]">
                <Shield size={18} /> Admin Panel
              </button>
            )}
            {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
              <button onClick={() => { onCreateClick(); setIsMenuOpen(false); }} className="w-full p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-700 font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]">
                <PenTool size={18} /> Post New Notice
              </button>
            )}
            <button onClick={onLogout} className="w-full p-4 bg-white/20 border border-white/40 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  username: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
  onAdminClick: PropTypes.func.isRequired,
};

export default Navbar;