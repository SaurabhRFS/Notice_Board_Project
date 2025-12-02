import React, { useState } from 'react';
import { 
  FileText, Download, Pin, Trash2, 
  ChevronDown, ChevronUp, File, ClockAlert 
} from 'lucide-react';

const NoticeCard = ({ notice, userRole, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- 1. SMART CLASSIFICATION ---
  const getFileType = (url) => {
    try {
      const extension = url.split('.').pop().split('?')[0].toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
      if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'video';
      if (['pdf'].includes(extension)) return 'pdf';
      return 'file';
    } catch (e) {
      return 'file';
    }
  };

  const attachments = notice.attachmentUrls || [];
  const visuals = attachments.filter(url => ['image', 'video'].includes(getFileType(url)));
  const documents = attachments.filter(url => ['pdf', 'file'].includes(getFileType(url)));

  // --- HELPER: Format Date ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // --- HELPER: Get Filename ---
  const getFileName = (url) => {
    try {
      return decodeURIComponent(url.split('/').pop().split('?')[0]);
    } catch (e) {
      return 'Attachment';
    }
  };

  // --- HELPER: Expiry Logic ---
  const getDaysLeft = () => {
    if (!notice.expiresAt) return null;

    // 1. Create Date objects
    const now = new Date();
    const expiry = new Date(notice.expiresAt);

    // 2. Reset time to midnight for accurate calculation
    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    // 3. Calculate difference
    const diffTime = expiry.getTime() - now.getTime();
    
    // 4. Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysLeft = getDaysLeft();

  return (
    // 1. DYNAMIC HEIGHT: 'h-fit' lets it grow when expanded
    // 'order-first' keeps pinned items at top
    <div className={`relative group w-full h-fit flex flex-col ${notice.isPinned ? 'order-first' : ''}`}>
      
      {/* Golden Glow for Pinned Items (Outer Blur) */}
      {notice.isPinned && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000 pointer-events-none"></div>
      )}

      {/* --- MAIN CARD CONTAINER --- */}
      <div className={`
        relative flex flex-col p-5 overflow-hidden
        rounded-3xl border backdrop-blur-2xl shadow-sm transition-all duration-300
        ${notice.isPinned 
          ? 'bg-amber-50/40 border-amber-200/60' 
          : 'bg-white/40 border-white/60 hover:bg-white/60 hover:shadow-md'}
      `}>
        
        {/* --- SHINE EFFECT (Only for Pinned) --- */}
        {notice.isPinned && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* The Beam: Wide diagonal sweep */}
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/40 to-transparent animate-shine transform rotate-12"></div>
          </div>
        )}

        {/* --- A. HEADER (Author & Badges) --- */}
        {/* 'relative z-10' ensures text sits ON TOP of the shine */}
        <div className="flex justify-between items-start mb-3 relative z-10">
          
          {/* Left: Author Info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm border-2 border-white ${
              notice.isPinned ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gradient-to-br from-slate-400 to-slate-500'
            }`}>
              {notice.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">
                {notice.author.username}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {notice.author.role.replace('ROLE_', '')}
              </span>
            </div>
          </div>

          {/* Right: Badges & Date Stack */}
          <div className="flex flex-col items-end gap-1">
             
             <div className="flex gap-1">
                {/* Pinned Badge */}
                {notice.isPinned && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-widest border border-amber-200/50">
                    <Pin size={8} fill="currentColor" /> Pinned
                  </span>
                )}

                {/* EXPIRY BADGE (Updated Colors) */}
                {daysLeft !== null && (
                  <div 
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      daysLeft < 0 
                        ? 'bg-gray-100 text-gray-400 border-gray-200' // Expired
                        : daysLeft <= 2 
                          ? 'bg-orange-100 text-orange-600 border-orange-200' // Warning (<= 2 days)
                          : 'bg-green-100 text-green-600 border-green-200' // Safe (> 2 days)
                  }`}
                    title={`Expires on ${formatDate(notice.expiresAt)}`}
                  >
                    <ClockAlert size={10} />
                    {daysLeft < 0 
                      ? "Expired" 
                      : daysLeft === 0 
                        ? "Ends Today" 
                        : `${daysLeft} days left`
                    }
                  </div>
                )}
             </div>
            
            {/* Created Date (Always Visible) */}
            <span className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mt-0.5">
              {formatDate(notice.createdAt)}
            </span>
          </div>
        </div>

        {/* --- B. CONTENT BODY --- */}
        <div className="mb-4 relative z-10">
          <h3 className="text-lg font-black text-slate-800 mb-1 leading-tight">
            {notice.title}
          </h3>
          
          <div className={`text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[1000px]' : 'max-h-20 mask-bottom'}`}>
            {notice.content}
          </div>

          {/* Read More Toggle */}
          {notice.content.length > 100 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp size={12} strokeWidth={3} /></>
              ) : (
                <>Read More <ChevronDown size={12} strokeWidth={3} /></>
              )}
            </button>
          )}
        </div>

        {/* --- C. MEDIA GALLERY (Images & Videos) --- */}
        {visuals.length > 0 && (
          <div className={`
            mb-4 overflow-hidden rounded-2xl border border-white/50 shadow-inner bg-slate-50/50
            grid gap-0.5 relative z-10
            ${visuals.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}
          `}>
            {visuals.map((url, idx) => {
              const type = getFileType(url);
              return (
                <div key={idx} className="relative group/media overflow-hidden aspect-video">
                  {type === 'video' ? (
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt="notice-attachment" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105 cursor-pointer"
                      onClick={() => window.open(url, '_blank')}
                    />
                  )}
                  {/* Download Overlay for Images */}
                  {type === 'image' && (
                    <a 
                      href={url} 
                      target="_blank" 
                      download 
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity backdrop-blur-md hover:bg-black/70"
                    >
                      <Download size={14} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}




        {/* --- D. DOCUMENT STACK (PDFs) --- */}
       {/* --- D. DOCUMENT STACK (PDFs) --- */}
        {documents.length > 0 && (
          <div className="flex flex-col gap-2 mb-4 relative z-10">
            {documents.map((url, idx) => (
              <a 
                key={idx}
                // THE FIX: Add '?fl_attachment' to force download
                // This bypasses the buggy browser preview and saves the file directly.
                href={`${url}?fl_attachment`} 
                
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/60 hover:bg-blue-50/80 hover:border-blue-200 hover:scale-[1.01] transition-all group/file shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-red-100 text-red-500 rounded-lg">
                    {getFileType(url) === 'pdf' ? <FileText size={18} /> : <File size={18} />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate block">
                      {getFileName(url)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {getFileType(url).toUpperCase()}
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





        {/* --- E. FOOTER ACTIONS --- */}
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
};

export default NoticeCard;