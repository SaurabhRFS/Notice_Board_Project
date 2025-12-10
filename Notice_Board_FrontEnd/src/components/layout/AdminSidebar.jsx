import React from 'react';
import { Users, BookOpen, Home, LogOut } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, onHome }) => {
  
  const menuItems = [
    { id: 'users', label: 'User Manager', icon: Users },
    { id: 'subjects', label: 'Subject Manager', icon: BookOpen },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 flex flex-col p-4 border-r border-white/40 bg-white/20 backdrop-blur-xl">
      
      {/* Brand */}
      <div className="mb-10 px-4 mt-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
          Admin<span className="text-blue-600">Panel</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Control Center</p>
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-600 hover:bg-white/40 hover:text-blue-600'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-white/30 space-y-2">
        <button 
          onClick={onHome}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-white/40 font-bold text-sm transition-all"
        >
          <Home size={20} /> Back to Home
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

    </div>
  );
};

export default AdminSidebar;