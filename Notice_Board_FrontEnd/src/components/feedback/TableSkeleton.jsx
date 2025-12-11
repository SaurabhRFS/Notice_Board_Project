import React from 'react';

const TableSkeleton = () => {
  // Create 5 rows of shimmering lines
  return (
    <div className="w-full animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-white/30">
          {/* ID Column */}
          <div className="col-span-1">
            <div className="h-4 w-8 bg-slate-300/50 rounded-md"></div>
          </div>
          {/* Main Info Column */}
          <div className="col-span-5">
            <div className="h-4 w-32 bg-slate-300/50 rounded-md mb-2"></div>
            <div className="h-3 w-20 bg-slate-200/50 rounded-md"></div>
          </div>
          {/* Badge Column */}
          <div className="col-span-3">
            <div className="h-6 w-16 bg-slate-200/50 rounded-full"></div>
          </div>
          {/* Actions Column */}
          <div className="col-span-3 flex justify-end gap-2">
            <div className="h-8 w-8 bg-slate-300/50 rounded-lg"></div>
            <div className="h-8 w-8 bg-slate-300/50 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;