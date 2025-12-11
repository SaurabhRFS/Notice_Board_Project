import React, { useState } from 'react';
import { Search, Shield, GraduationCap, User, Loader2, CheckCircle2 } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import TableSkeleton from '../../components/feedback/TableSkeleton';

const UserManagement = () => {
  // 1. Use Hook
  const { users, isLoading, promoteUser } = useUsers();
  
  // 2. UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [promotingId, setPromotingId] = useState(null);

  // --- Handlers ---
  const handlePromoteClick = async (userId) => {
    setPromotingId(userId);
    await promoteUser(userId);
    setPromotingId(null);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role, compact = false) => {
    const baseClasses = "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border w-fit";
    switch(role) {
      case 'ROLE_ADMIN':
        return <span className={`${baseClasses} bg-purple-100 text-purple-700 border-purple-200`}><Shield size={8} /> {compact ? 'ADM' : 'Admin'}</span>;
      case 'ROLE_TEACHER':
        return <span className={`${baseClasses} bg-blue-100 text-blue-700 border-blue-200`}><User size={8} /> {compact ? 'TCH' : 'Teacher'}</span>;
      default:
        return <span className={`${baseClasses} bg-slate-100 text-slate-600 border-slate-200`}><GraduationCap size={8} /> {compact ? 'STD' : 'Student'}</span>;
    }
  };

  const renderUserList = () => {
    if (isLoading) return <TableSkeleton />; // <--- REPLACED SPINNER;
    if (filteredUsers.length === 0) return <div className="p-8 text-center text-slate-500 font-medium">No users found.</div>;

    return filteredUsers.map(user => (
      <div key={user.id} className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-white/30 hover:bg-white/40 transition-colors items-center group">
        <div className="col-span-2 md:col-span-1 pl-1 md:pl-2">
          <span className="font-mono text-xs text-slate-400 font-bold">#{user.id}</span>
        </div>
        <div className="col-span-6 md:col-span-5 min-w-0 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-800 truncate leading-tight">{user.username}</div>
          <div className="text-xs text-slate-500 break-all leading-tight mt-0.5">{user.email}</div>
          <div className="md:hidden mt-1.5">{getRoleBadge(user.role, false)}</div>
        </div>
        <div className="hidden md:block col-span-3">{getRoleBadge(user.role)}</div>
        <div className="col-span-4 md:col-span-3 flex justify-end pr-1 md:pr-2">
          {user.role === 'ROLE_STUDENT' && (
            <button 
              onClick={() => handlePromoteClick(user.id)}
              disabled={promotingId === user.id}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] md:text-xs font-bold text-slate-600 shadow-sm hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all flex items-center gap-1.5"
            >
              {promotingId === user.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>Promote</span>
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white/60 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-700 font-bold placeholder:text-slate-400 backdrop-blur-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-1 pl-2">ID</div>
          <div className="col-span-5">User Profile</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right pr-2">Actions</div>
        </div>
        <div className="md:hidden grid grid-cols-12 gap-2 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-2">ID</div>
          <div className="col-span-6">User</div>
          <div className="col-span-4 text-right">Action</div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {renderUserList()}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;