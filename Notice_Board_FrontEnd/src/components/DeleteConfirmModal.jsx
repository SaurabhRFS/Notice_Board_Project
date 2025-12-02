import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item?", 
  message = "This action cannot be undone.",
  isLoading = false 
}) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? null : onClose}
      ></div>

      {/* The Glass Alert Box */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in-up">
        
        <div className="flex flex-col items-center text-center gap-4">
          
          {/* Danger Icon Circle */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 shadow-inner">
            <Trash2 size={32} />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-xl font-black text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {message}
            </p>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-3 w-full mt-2">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;