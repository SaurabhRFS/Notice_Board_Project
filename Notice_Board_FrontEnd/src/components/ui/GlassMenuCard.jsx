import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink, ChevronRight } from 'lucide-react'; // 1. Import ChevronRight

const GlassMenuCard = ({ item, onClick }) => {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      disabled={item.comingSoon}
      className={`
        relative w-full flex items-center justify-between p-4 rounded-2xl
        border-[2px] border-white/50 
        backdrop-blur-xl
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_4px_6px_-1px_rgba(0,0,0,0.05)]
        transition-all duration-300 group
        ${item.comingSoon 
           ? 'bg-white/20 opacity-60 cursor-default grayscale-[0.5]' 
           : 'bg-white/40 hover:bg-white/60 cursor-pointer active:scale-[0.98] hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} shadow-sm ring-1 ring-white/50`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        <span className={`font-bold text-sm tracking-wide ${item.comingSoon ? 'text-slate-500' : 'text-slate-800 group-hover:text-blue-700'}`}>
          {item.label}
        </span>
      </div>
      
      {/* 2. FIX: Correct Badge Logic */}
      {item.comingSoon ? (
        <span className="text-[10px] font-black text-slate-400 bg-white/40 px-2 py-1 rounded-lg border border-white/50 shadow-sm">
          SOON
        </span>
      ) : item.isExternal ? (
        <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
      ) : (
        // Internal Link Indicator
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      )}
    </button>
  );
};

GlassMenuCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string,
    bg: PropTypes.string,
    link: PropTypes.string,
    isExternal: PropTypes.bool,
    comingSoon: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GlassMenuCard;