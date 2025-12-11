import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ExternalLink, List, Grid } from 'lucide-react';

import Navbar from '../../components/layout/Navbar';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
// GlassCard import removed to avoid width restrictions
import { useCurrentUser } from '../auth/hooks/useCurrentUser';

const CalendarPage = () => {
  const navigate = useNavigate();
  const { username, userRole } = useCurrentUser();
  const [viewMode, setViewMode] = useState('MONTH'); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('AGENDA');
      } else {
        setViewMode('MONTH');
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const BASE_URL = "https://calendar.google.com/calendar/embed";
  
  const PARAMS = new URLSearchParams({
    ctz: "Asia/Kolkata",
    wkst: "1",
    bgcolor: "#ffffff",
    showPrint: "0",
    showTitle: "0",
    showDate: "1",
    showTz: "0",
    showCalendars: "0",
    showTabs: "0", 
    mode: viewMode,
  });

  const calendars = [
    { src: "c2F1cmFiaHJmczJAZ21haWwuY29t", color: "#039BE5" }, 
    { src: "MjRiOWEwYTYzYzkwNjg0ZTZlNjg0YjU2YTEwNTMyYTBhMWY4NmI2OWU2OTRiYTNkYTZjNjczY2UyMjAwN2EwZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t", color: "#A79B8E" }, 
    { src: "ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t", color: "#0B8043" } 
  ];

  let finalUrl = `${BASE_URL}?${PARAMS.toString()}`;
  calendars.forEach(cal => {
    finalUrl += `&src=${cal.src}&color=${encodeURIComponent(cal.color)}`;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      <AnimatedBackground />

      <Navbar 
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        onCreateClick={() => navigate('/')} 
        onAdminClick={() => navigate('/admin')}
      />

      {/* FIXED HERE: Changed 'pt-20' to 'pt-28'.
         This adds extra spacing on mobile to prevent the collision with the Navbar.
      */}
      <div className="relative z-10 pt-28 md:pt-32 pb-12 px-2 md:px-4 w-full flex flex-col">

        {/* Header Section */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-6 px-2 gap-4">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
              <CalendarIcon size={12} /> Academic Schedule
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Calendar</span>
            </h1>

            <p className="text-slate-500 text-sm md:text-base mt-1 font-medium">
              Stay updated with exams, holidays, and events.
            </p>
          </div>

          <div className="flex bg-white/40 backdrop-blur-md border border-white/60 p-1 rounded-xl shadow-sm">
            <button 
              onClick={() => setViewMode('MONTH')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'MONTH' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid size={14} /> Month
            </button>

            <button 
              onClick={() => setViewMode('AGENDA')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'AGENDA' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={14} /> List
            </button>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="w-full max-w-7xl mx-auto shadow-2xl shadow-teal-900/10 rounded-2xl overflow-hidden border border-white/50">
          <div 
            className="
              w-full 
              min-h-[75vh]
              md:min-h-[85vh]
              bg-white/40           
              backdrop-blur-xl      
              relative
            "
          >
            <iframe
              src={finalUrl}
              className="w-full h-full absolute inset-0 bg-white"
              style={{ borderWidth: 0 }}
              title="Campus Calendar"
              loading="lazy"
            />
          </div>
        </div>

        <a 
          href="https://calendar.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors w-full"
        >
          Open in Google Calendar <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default CalendarPage;