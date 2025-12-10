import React from 'react';
import { Loader2 } from 'lucide-react';

const PrimaryButton = ({ children, isLoading, onClick, type = "button" }) => {
  return (
    <button 
      type={type} 
      disabled={isLoading}
      onClick={onClick}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-400/50 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;