import React from 'react';
import { ListFilter, GitBranch, GraduationCap, BookOpen, Search, Loader2 } from 'lucide-react';

const FilterBar = ({ 
  branches, semesters, subjects,
  selectedBranch, setSelectedBranch,
  selectedSemester, setSelectedSemester,
  selectedSubject, setSelectedSubject,
  onApply,
  isLoading // <-- 1. NEW PROP
}) => {
  return (
    // --- MAIN DECK ---
    <div className="relative mx-auto max-w-8xl mb-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl px-2 py-2 md:px-4 md:py-3 transition-all hover:bg-white/25">
      
      <div className="flex items-center justify-between gap-1 md:gap-4 w-full">
        
        {/* 1. FILTER ICON */}
        <div className="flex items-center justify-center shrink-0">
          <div className="p-2 md:p-2 bg-white/30 rounded-full border border-white/50 shadow-sm text-slate-700">
            <ListFilter size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <span className="hidden md:block font-black text-xs text-slate-600 tracking-[0.15em] uppercase opacity-80 ml-3">
            Filter By
          </span>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

        {/* 2. THE 3 SUB-CAPSULES (Dropdowns) */}
        <div className="flex flex-1 items-center gap-1 md:gap-3 min-w-0">
          
          {/* Branch Capsule */}
          <div className="relative group flex-1 min-w-0">
            <GitBranch size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 z-10 md:left-3 md:w-3.5 md:h-3.5" />
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)} 
              disabled={isLoading} // Disable while loading
              className="w-full pl-6 pr-1 py-2 md:pl-9 md:pr-4 md:py-2.5 rounded-xl bg-white/40 border-[2px] border-white/50 text-[10px] md:text-sm font-bold text-slate-700 focus:bg-white/80 focus:ring-2 focus:ring-blue-200 outline-none appearance-none cursor-pointer transition-all hover:bg-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] truncate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Semester Capsule */}
          <div className="relative group flex-1 min-w-0">
            <GraduationCap size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 z-10 md:left-3 md:w-3.5 md:h-3.5" />
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={isLoading} 
              className="w-full pl-6 pr-1 py-2 md:pl-9 md:pr-4 md:py-2.5 rounded-xl bg-white/40 border-[2px] border-white/50 text-[10px] md:text-sm font-bold text-slate-700 focus:bg-white/80 focus:ring-2 focus:ring-blue-200 outline-none appearance-none cursor-pointer transition-all hover:bg-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] truncate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Sem</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Subject Capsule */}
          <div className="relative group flex-1 min-w-0">
            <BookOpen size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 z-10 md:left-3 md:w-3.5 md:h-3.5" />
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)} 
              disabled={isLoading}
              className="w-full pl-6 pr-1 py-2 md:pl-9 md:pr-4 md:py-2.5 rounded-xl bg-white/40 border-[2px] border-white/50 text-[10px] md:text-sm font-bold text-slate-700 focus:bg-white/80 focus:ring-2 focus:ring-blue-200 outline-none appearance-none cursor-pointer transition-all hover:bg-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] truncate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Sub</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* 3. SEARCH BUTTON (Loading Logic) */}
        <button 
          onClick={onApply} 
          disabled={isLoading} // Prevent double clicks
          className="
            group relative shrink-0
            p-2 md:px-6 md:py-2.5 rounded-full 
            bg-white/40 backdrop-blur-md 
            border border-white/60
            text-slate-700 font-bold text-sm
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.05)]
            hover:bg-white/70 hover:text-blue-700 hover:scale-105 active:scale-95
            transition-all duration-300
            flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-wait
          "
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {isLoading ? (
            // LOADING STATE
            <>
              <Loader2 size={18} className="relative z-10 animate-spin text-blue-600" />
              <span className="hidden md:block relative z-10 uppercase tracking-wide text-xs">Loading...</span>
            </>
          ) : (
            // NORMAL STATE
            <>
              <Search size={18} className="relative z-10" />
              <span className="hidden md:block relative z-10 uppercase tracking-wide text-xs">Search</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default FilterBar;