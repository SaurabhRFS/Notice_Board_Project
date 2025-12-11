import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, MessageCircle, Users, TrendingUp, 
  ExternalLink, ShieldCheck, Camera, HandCoins, UserCheck 
} from 'lucide-react';

import Navbar from '../../components/layout/Navbar';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import GlassCard from '../../components/ui/GlassCard';
// 1. IMPORT THE NEW COMPONENT
import StatCard from './components/StatCard'; 
import { useCurrentUser } from '../auth/hooks/useCurrentUser';

const BuySellPage = () => {
  const navigate = useNavigate();
  const { username, userRole } = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const stats = [
    { icon: ShieldCheck, label: "Trusted Since", value: "2023" },
    { icon: Users, label: "Active Students", value: "Verified" },
    { icon: TrendingUp, label: "Total Volume", value: "₹26,000+" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      <AnimatedBackground />
      
      <Navbar 
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        onCreateClick={() => navigate('/')} 
        onAdminClick={() => navigate('/admin')}
      />

      <div className="relative z-10 pt-24 md:pt-32 pb-12 px-4 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <ShoppingBag size={12} /> Campus Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
            Buy & Sell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Campus Gear
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            The official student-to-student trading hub. <br/>
            Turn your old drafter into cash, or find cheap books for next sem.
          </p>
        </div>

        {/* 2. REFACTORED STATS GRID */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-3xl mb-16">
          {stats.map((stat, idx) => (
            <StatCard 
              key={idx}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

        {/* ... (Rest of "How It Works" and Action Card remains the same) ... */}
        
        {/* --- HOW IT WORKS (Existing Section) --- */}
        <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
          {/* ... Seller Guide & Buyer Guide ... */}
          {/* (I am omitting the long code here since it didn't change, just keep it as is) */}
           {/* SELLER GUIDE */}
           <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Camera size={100} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-emerald-500">#</span> To Sell
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800">Click & Post</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Take a clear photo of your item. Post it in the group with <span className="text-emerald-600">Product Name, Condition, and Price.</span></p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-800">Wait for DMs</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Interested students will Direct Message (DM) you. Negotiate and fix a time.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-800">Deal & Delete</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Meet on campus, exchange cash/UPI. <span className="text-red-500">Delete your post</span> once sold to stop calls.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* BUYER GUIDE */}
          <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <HandCoins size={100} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-blue-500">#</span> To Buy
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800">Browse Listings</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Scroll through the chat media or recent messages to find what you need.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-800">Verify Condition</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">DM the seller. Ask for more photos or details if needed. Verify before you pay.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-800">Meet & Pay</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Meet in a public spot (Canteen/Library). Check the item, pay via UPI/Cash, and it's yours!</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Card */}
        <GlassCard className="!max-w-md w-full border-emerald-200 shadow-2xl shadow-emerald-900/10 scale-105">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <UserCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Ready to Trade?</h2>
            <p className="text-slate-500 text-sm mb-6 font-medium">
              Join the official group now. <br/> Spamming allows instant ban.
            </p>
            
            <a 
              href="https://chat.whatsapp.com/Gp6IXSTnDUPKDLdoFH8KxK"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={20} className="fill-current" />
              <span>Join WhatsApp Group</span>
              <ExternalLink size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
              By joining, you agree to group rules
            </p>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default BuySellPage;