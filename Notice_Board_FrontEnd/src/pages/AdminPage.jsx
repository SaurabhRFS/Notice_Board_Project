import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // <-- 1. NEW IMPORTS
import AnimatedBackground from '../components/AnimatedBackground';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../components/UserManagement'; 
import SubjectManagement from '../components/SubjectManagement';

function AdminPage() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'subjects'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- 2. NEW STATE
  
  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'ROLE_ADMIN') {
      navigate('/'); // Kick non-admins out
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Helper to close menu when a tab is selected (mobile UX)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative overflow-hidden">
      
      <AnimatedBackground />

      {/* --- 3. MOBILE HEADER (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 p-4 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 tracking-tighter">
          Admin<span className="text-blue-600">Panel</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white/40 rounded-full text-slate-700 shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* --- 4. MOBILE DRAWER (Overlay + Sidebar) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Slide-out Sidebar */}
          <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-2xl animate-fade-in-up">
             <div className="absolute top-4 right-4 z-50">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-red-500">
                 <X size={24} />
               </button>
             </div>
             {/* Reuse the Sidebar Component */}
             <AdminSidebar 
               activeTab={activeTab} 
               setActiveTab={handleTabChange} 
               onLogout={handleLogout} 
               onHome={() => navigate('/')} 
             />
          </div>
        </div>
      )}

      {/* 5. DESKTOP SIDEBAR (Hidden on mobile) */}
      <div className="relative z-20 hidden md:block">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout}
          onHome={() => navigate('/')}
        />
      </div>

      {/* 6. MAIN CONTENT AREA (Adjusted padding for mobile header) */}
      <div className="flex-1 relative z-10 h-screen overflow-y-auto pt-20 md:pt-0">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              {activeTab === 'users' ? 'User Management' : 'Subject Management'}
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
              {activeTab === 'users' 
                ? 'Manage roles, promote students, and oversee accounts.' 
                : 'Create new subjects and assign them to branches.'}
            </p>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          <div className="animate-fade-in-up">
            {activeTab === 'users' ? (
              
              // --- PLACEHOLDER: USER TAB ---
              <UserManagement />

            ) : (
              // --- PLACEHOLDER: SUBJECT TAB ---
              <SubjectManagement />

            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default AdminPage;