import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/60 p-4 md:p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:scale-105 transition-transform duration-300">
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mb-2">
        <Icon size={20} />
      </div>
      <span className="text-xl md:text-2xl font-black text-slate-800">
        {value}
      </span>
      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default StatCard;