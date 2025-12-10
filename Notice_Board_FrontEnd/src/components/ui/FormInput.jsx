import React from 'react';

const FormInput = ({ label, type, placeholder, value, onChange, icon: Icon, rightElement }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors">
          <Icon size={18} />
        </div>
        
        <input 
          type={type} 
          required
          className="w-full bg-white/50 border border-white/50 rounded-xl py-3.5 pl-10 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:bg-white/70 shadow-inner"
          placeholder={placeholder}
          value={value} 
          onChange={onChange}
        />
        
        {/* For the Eye Icon toggle */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;