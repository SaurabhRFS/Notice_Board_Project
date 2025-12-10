import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, type = 'info', message, onClose, duration = 4000 }) => {
  // Auto-dismiss logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Design Config based on Type
  const styles = {
    success: {
      icon: <CheckCircle size={20} className="text-emerald-500" />,
      bg: "bg-emerald-50/80 border-emerald-200/50",
      text: "text-emerald-900",
      glow: "shadow-emerald-500/20"
    },
    error: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      bg: "bg-red-50/80 border-red-200/50",
      text: "text-red-900",
      glow: "shadow-red-500/20"
    },
    info: {
      icon: <Info size={20} className="text-blue-500" />,
      bg: "bg-blue-50/80 border-blue-200/50",
      text: "text-blue-900",
      glow: "shadow-blue-500/20"
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div 
      className={`
        relative flex items-center gap-3 p-4 pr-10 
        rounded-2xl border backdrop-blur-xl shadow-lg 
        animate-fade-in-up transition-all duration-300
        ${style.bg} ${style.glow}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className="shrink-0">{style.icon}</div>
      
      {/* Message */}
      <p className={`text-sm font-bold ${style.text}`}>{message}</p>
      
      {/* Close Button */}
      <button 
        onClick={() => onClose(id)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default Toast;