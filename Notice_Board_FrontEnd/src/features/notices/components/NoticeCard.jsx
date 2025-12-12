import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Pin, Trash2, 
  ChevronDown, ChevronUp, File, ClockAlert 
} from 'lucide-react';

// 1. OPTIMIZATION: Wrap in React.memo to prevent unnecessary re-renders
const NoticeCard = React.memo(({ notice, userRole, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. OPTIMIZATION: Cloudinary "On-the-fly" Transformation
  // This reduces image size by ~90% (e.g., 2MB -> 200KB)
  const getOptimizedUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Insert transformations: f_auto (best format), q_auto (best quality/size), w_800 (resize)
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/'); 
  };

  // 3. OPTIMIZATION: Memoize Heavy Logic
  // Only recalculate this if 'notice.attachmentUrls' actually changes
  const { visuals, documents } = useMemo(() => {
    const getFileType = (url) => {
        try {
            const extension = url.split('.').pop().split('?')[0].toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
            if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'video';
            if (['pdf'].includes(extension)) return 'pdf';
            return 'file';
        } catch (e) { return 'file'; }
    };

    const attachments = notice.attachmentUrls || [];
    const visuals = attachments.filter(url => ['image', 'video'].includes(getFileType(url)));
    const documents = attachments.filter(url => ['pdf', 'file'].includes(getFileType(url)));
    
    return { visuals, documents };
  }, [notice.attachmentUrls]);

  // 4. OPTIMIZATION: Memoize Date Math
  const daysLeft = useMemo(() => {
    if (!notice.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(notice.expiresAt);
    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [notice.expiresAt]);

  const formattedDate = useMemo(() => {
      if (!notice.createdAt) return '';
      return new Date(notice.createdAt).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric'
      });
  }, [notice.createdAt]);

  const getFileName = (url) => {
    try { return decodeURIComponent(url.split('/').pop().split('?')[0]); } 
    catch (e) { return 'Attachment'; }
  };

  // Helper for file type (used in render for icon selection)
  const getFileTypeForIcon = (url) => {
    try {
      const extension = url.split('.').pop().split('?')[0].toLowerCase();
      if (['pdf'].includes(extension)) return 'pdf';
      return 'file';
    } catch (e) { return 'file'; }
  };

  return (
    // 5. OPTIMIZATION: 'will-change-transform' prepares the browser for layout changes
    <div className={`relative group w-full h-fit flex flex-col ${notice.isPinned ? 'order-first' : ''} will-change-transform`}>
      
      {/* Golden Glow for Pinned Items */}
      {notice.isPinned && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000 pointer-events-none"></div>
      )}

      {/* --- MAIN CARD CONTAINER --- */}
      <div className={`
        relative flex flex-col p-5 overflow-hidden
        rounded-3xl border shadow-sm transition-all duration-300
        ${notice.isPinned 
          ? 'bg-amber-50/90 border-amber-200/60 backdrop-blur-md' 
          : 'bg-white/60 border-white/60 hover:bg-white/80 hover:shadow-md backdrop-blur-md'}
      `}>
        
        {/* --- SHINE EFFECT (Pinned Only) --- */}
        {notice.isPinned && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/40 to-transparent animate-shine transform rotate-12"></div>
          </div>
        )}

        {/* --- A. HEADER --- */}
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm border-2 border-white ${
              notice.isPinned ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gradient-to-br from-slate-400 to-slate-500'
            }`}>
              {notice.author?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">
                {notice.author?.username}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {notice.author?.role?.replace('ROLE_', '')}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
             <div className="flex gap-1">
                {notice.isPinned && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-widest border border-amber-200/50">
                    <Pin size={8} fill="currentColor" /> Pinned
                  </span>
                )}
                {daysLeft !== null && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      daysLeft < 0 ? 'bg-gray-100 text-gray-400' : daysLeft <= 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <ClockAlert size={10} />
                    {daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Ends Today" : `${daysLeft} days left`}
                  </div>
                )}
             </div>
            <span className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mt-0.5">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* --- B. CONTENT --- */}
        <div className="mb-4 relative z-10">
          <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight">
            {notice.title}
          </h3>
          <div className={`text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[1000px]' : 'max-h-20 mask-bottom'}`}>
            {notice.content}
          </div>
          {notice.content.length > 100 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1 transition-colors"
            >
              {isExpanded ? <>Show Less <ChevronUp size={12} strokeWidth={3} /></> : <>Read More <ChevronDown size={12} strokeWidth={3} /></>}
            </button>
          )}
        </div>

        {/* --- C. MEDIA GALLERY (Optimized) --- */}
        {visuals.length > 0 && (
          <div className={`
            mb-4 overflow-hidden rounded-2xl border border-white/50 shadow-inner bg-slate-50/50
            grid gap-0.5 relative z-10
            ${visuals.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}
          `}>
            {visuals.map((url, idx) => {
              const optimizedSrc = getOptimizedUrl(url); 
              const type = optimizedSrc.includes('.mp4') || optimizedSrc.includes('.webm') ? 'video' : 'image';
              
              return (
                <div key={idx} className="relative group/media overflow-hidden aspect-video bg-slate-100">
                  {type === 'video' ? (
                    <video src={url} controls className="w-full h-full object-cover" preload="metadata" />
                  ) : (
                    <img 
                      src={optimizedSrc} 
                      alt="attachment" 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105 cursor-pointer"
                      onClick={() => window.open(url, '_blank')}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- D. DOCUMENTS --- */}
        {documents.length > 0 && (
          <div className="flex flex-col gap-2 mb-4 relative z-10">
            {documents.map((url, idx) => (
              <a 
                key={idx}
                href={`${url}?fl_attachment`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/60 hover:bg-blue-50/80 hover:border-blue-200 hover:scale-[1.01] transition-all group/file shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-red-100 text-red-500 rounded-lg">
                    {getFileTypeForIcon(url) === 'pdf' ? <FileText size={18} /> : <File size={18} />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate block">
                      {getFileName(url)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {getFileTypeForIcon(url).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-slate-300 group-hover/file:text-blue-500 transition-colors">
                  <Download size={18} />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* --- E. FOOTER --- */}
        {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
          <div className="mt-auto pt-3 border-t border-slate-200/50 flex justify-end relative z-10">
            <button 
              onClick={() => onDelete(notice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash2 size={14} /> <span>Delete</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
});

export default NoticeCard;