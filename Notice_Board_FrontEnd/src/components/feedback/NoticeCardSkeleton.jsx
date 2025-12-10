import React from 'react';

const NoticeCardSkeleton = () => {
  return (
    <div className="w-full h-fit p-5 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm animate-pulse">
      
      {/* 1. Header: Avatar + User Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar: Solid Slate */}
          <div className="w-10 h-10 rounded-full bg-slate-300"></div>
          <div className="flex flex-col gap-2">
            {/* Username: Darker Line */}
            <div className="h-3 w-24 bg-slate-400/50 rounded-full"></div>
            {/* Role: Lighter Line */}
            <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
          </div>
        </div>
        {/* Date Badge */}
        <div className="h-5 w-20 bg-slate-200 rounded-lg"></div>
      </div>

      {/* 2. Body: Title + Content */}
      <div className="space-y-4 mb-6">
        {/* Title Bar (Thick & Visible) */}
        <div className="h-6 w-3/4 bg-slate-400/40 rounded-lg"></div>
        
        {/* Content Lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-300 rounded-full"></div>
          <div className="h-3 w-11/12 bg-slate-300 rounded-full"></div>
          <div className="h-3 w-4/5 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* 3. Media Placeholder (Big Block) */}
      <div className="w-full h-40 bg-slate-200/80 rounded-2xl mb-4 border border-white/50"></div>

      {/* 4. Footer Actions */}
      <div className="flex justify-end pt-3 border-t border-slate-200/30">
        <div className="h-8 w-24 bg-slate-300 rounded-xl"></div>
      </div>
    </div>
  );
};

export default NoticeCardSkeleton;