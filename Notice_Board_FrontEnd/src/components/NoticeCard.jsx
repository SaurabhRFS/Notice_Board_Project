import React, { useState } from 'react';
import { FileText, Download, Paperclip, Pin, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const NoticeCard = ({ notice, userRole, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- HELPER 1: Is it an Image? ---
  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  };

  // --- HELPER 2: Get short filename ---
  const getFileName = (url) => {
    // Splits url by '/' -> takes last part -> removes query params -> truncates
    try {
      return url.split('/').pop().split('?')[0].substring(0, 15) + '...';
    } catch (e) {
      return 'File';
    }
  };

  // --- HELPER 3: Format Date ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  // --- HELPER 4: Days left for expiry ---
  const getExpiryDays = () => {
    if (!notice.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(notice.expiresAt);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const daysLeft = getExpiryDays();

  return (
    // 1. PINNED LOGIC: 'order-first' puts it at the top of the grid automatically
    <div className={`relative group h-full flex flex-col ${notice.isPinned ? 'order-first' : ''}`}>
      
      {/* 2. THE GOLDEN GLOW (Only for Pinned) */}
      {notice.isPinned && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
      )}

      {/* 3. THE CRYSTAL SHEET (Main Container) */}
      <div className={`
        relative flex flex-col flex-grow p-5
        rounded-3xl border-2 backdrop-blur-xl shadow-lg transition-all duration-300
        ${notice.isPinned 
          ? 'bg-amber-50/30 border-amber-200/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]' 
          : 'bg-white/30 border-white/50 hover:bg-white/40 hover:-translate-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]'}
      `}>
        
        {/* --- HEADER: Badges & Date --- */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex flex-wrap gap-2">
            {/* Branch Badge */}
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              notice.isPinned 
                ? 'bg-amber-100/50 border-amber-200 text-amber-800' 
                : 'bg-white/40 border-white/60 text-slate-600'
            }`}>
              {notice.targetBranch || 'General'}
            </span>
            
            {/* Pinned Badge */}
            {notice.isPinned && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Pin size={10} fill="currentColor" /> Pinned
              </span>
            )}
          </div>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {formatDate(notice.createdAt)}
          </span>
        </div>

        {/* --- BODY: Title & Content --- */}
        <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">
          {notice.title}
        </h3>

        <div className="relative mb-4">
          <p className={`text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {notice.content}
          </p>
          
          {/* Read More Trigger */}
          {notice.content.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 focus:outline-none transition-colors"
            >
              {isExpanded ? <>Show Less <ChevronUp size={12} /></> : <>Read More <ChevronDown size={12} /></>}
            </button>
          )}
        </div>

        {/* --- ATTACHMENT TRAY --- */}
        {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
          <div className="mt-auto pt-4 border-t border-slate-500/10 w-full"> {/* Ensure width constraint */}
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
              <Paperclip size={10} /> Attachments
            </div>
            
            {/* Added 'w-full' and ensured standard overflow behavior */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full touch-pan-x"> 
              {notice.attachmentUrls.map((url, idx) => (
                <a 
                  key={idx} 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-shrink-0 group/file relative block transition-transform active:scale-95"
                >
                  {isImage(url) ? (
                    // A. IMAGE THUMBNAIL
                    <div className="w-16 h-16 rounded-xl border border-white/60 bg-white/40 overflow-hidden relative shadow-sm hover:shadow-md transition-all">
                      <img src={url} alt="attachment" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/20 transition-all flex items-center justify-center">
                        <Download size={16} className="text-white opacity-0 group-hover/file:opacity-100 scale-75 group-hover/file:scale-100 transition-all" />
                      </div>
                    </div>
                  ) : (
                    // B. FILE PILL
                    <div className="h-16 w-28 rounded-xl bg-white/40 border border-white/60 p-2 flex flex-col justify-center items-center gap-1 hover:bg-white/70 transition-all shadow-sm">
                      <FileText size={20} className="text-slate-500 group-hover/file:text-blue-500 transition-colors" />
                      <span className="text-[9px] text-slate-500 font-bold truncate w-full text-center">
                        {getFileName(url)}
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- FOOTER: Author & Actions --- */}
        <div className={`flex items-center justify-between ${(!notice.attachmentUrls || notice.attachmentUrls.length === 0) ? 'mt-auto pt-4 border-t border-slate-500/10' : ''}`}>
          
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm border-2 border-white ${
              notice.isPinned ? 'bg-amber-400' : 'bg-slate-300'
            }`}>
              {notice.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-700 leading-none">{notice.author.username}</span>
              <span className="text-[9px] text-slate-400 font-bold tracking-wider">{notice.author.role.replace('ROLE_', '')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Expiry Warning */}
            {daysLeft !== null && daysLeft <= 3 && daysLeft >= 0 && (
               <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-100/50 px-2 py-1 rounded-full border border-orange-200" title={`Expires in ${daysLeft} days`}>
                 <Clock size={10} />
                 <span>{daysLeft}d left</span>
               </div>
            )}

            {/* Delete Button */}
            {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
              <button 
                onClick={() => onDelete(notice.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Delete Notice"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoticeCard;