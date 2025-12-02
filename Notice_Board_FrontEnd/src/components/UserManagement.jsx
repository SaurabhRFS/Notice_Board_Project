import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { Search, Shield, GraduationCap, User, Loader2, CheckCircle2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotingId, setPromotingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromote = async (userId) => {
    if (!window.confirm("Are you sure you want to promote this user to TEACHER?")) return;

    setPromotingId(userId);
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: 'ROLE_TEACHER' } : user
      ));
      
      alert("Success! User is now a Teacher.");

    } catch (error) {
      console.error("Promotion failed", error);
      alert("Failed to promote user.");
    } finally {
      setPromotingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for Role Badges
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

  // --- REFACTOR: Logic Extracted Here ---
  const renderUserList = () => {
    if (isLoading) {
      return (
        <div className="p-8 flex justify-center text-slate-400">
          <Loader2 className="animate-spin" />
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="p-8 text-center text-slate-500 font-medium">
          No users found.
        </div>
      );
    }

    return filteredUsers.map(user => (
      <div key={user.id} className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-white/30 hover:bg-white/40 transition-colors items-center group">
        
        {/* 1. ID Column */}
        <div className="col-span-2 md:col-span-1 pl-1 md:pl-2">
          <span className="font-mono text-xs text-slate-400 font-bold">#{user.id}</span>
        </div>

        {/* 2. User Info Column */}
        <div className="col-span-6 md:col-span-5 min-w-0 flex flex-col justify-center">
          <div className="text-sm font-bold text-slate-800 truncate leading-tight">
            {user.username}
          </div>
          <div className="text-xs text-slate-500 break-all leading-tight mt-0.5">
            {user.email}
          </div>
          <div className="md:hidden mt-1.5">
            {getRoleBadge(user.role, false)} 
          </div>
        </div>

        {/* 3. Role Column (Desktop) */}
        <div className="hidden md:block col-span-3">
          {getRoleBadge(user.role)}
        </div>

        {/* 4. Actions Column */}
        <div className="col-span-4 md:col-span-3 flex justify-end pr-1 md:pr-2">
          {user.role === 'ROLE_STUDENT' && (
            <button 
              onClick={() => handlePromote(user.id)}
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
      
      {/* Search Bar */}
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

      {/* Glass List Container */}
      <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-1 pl-2">ID</div>
          <div className="col-span-5">User Profile</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right pr-2">Actions</div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden grid grid-cols-12 gap-2 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-2">ID</div>
          <div className="col-span-6">User</div>
          <div className="col-span-4 text-right">Action</div>
        </div>

        {/* List Content (Cleaned Up) */}
        <div className="max-h-[500px] overflow-y-auto">
          {renderUserList()}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;