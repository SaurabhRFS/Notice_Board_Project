import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig'; 
import { auth, googleProvider } from '../firebase'; 
import { signInWithPopup } from 'firebase/auth'; 
import { Mail, Lock, Loader2, Zap, Eye, EyeOff } from 'lucide-react'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      navigate('/'); 
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { token: await result.user.getIdToken() });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      navigate('/'); 
    } catch (err) {
      setError('Google login failed.'); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
      
      {/* --- CHAOTIC BACKGROUND (7 Wandering Blobs) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        
        {/* 1. Purple (Top Left -> Wanders Right) */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-1"></div>
        
        {/* 2. Cyan (Top Right -> Wanders Left) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-2 animation-delay-2000"></div>
        
        {/* 3. Pink (Bottom Left -> Wanders Up) */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-3 animation-delay-4000"></div>
        
        {/* 4. Yellow (Bottom Right -> Wanders Diagonal) */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-1 animation-delay-1000"></div>

        {/* 5. Indigo (Center -> Wanders Wildly) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-2 animation-delay-3000"></div>

        {/* 6. Orange (Random Spot -> Wanders) */}
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-3 animation-delay-500"></div>

        {/* 7. Teal (Random Spot -> Wanders) */}
        <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-wander-1 animation-delay-2500"></div>

      </div>

      {/* Content Grid (Lifted) */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 z-10 relative md:-mt-24">
        
        {/* Left Column (Text) */}
        <div className="flex flex-col justify-center items-start p-8 md:p-16 relative">
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Zap size={32} className="text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">CampusNotice</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-in-up [animation-delay:100ms]">
            Stay updated with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              CampusNotice
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-md animate-fade-in-up [animation-delay:200ms] font-medium leading-relaxed">
            Connect to the grid. Get real-time announcements, grades, and schedules in one synchronized hub.
          </p>
        </div>

        {/* Right Column (Glass Card) */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md bg-white/30 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl p-8 animate-fade-in-up [animation-delay:300ms] relative">
            
            {/* Internal Shine */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-3xl" />

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600 text-sm font-medium">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50/80 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2 animate-shake relative z-10">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input type="email" required className="w-full bg-white/50 border border-white/50 rounded-xl py-3.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:bg-white/70 shadow-inner" placeholder="student@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input type={showPassword ? "text" : "password"} required className="w-full bg-white/50 border border-white/50 rounded-xl py-3.5 pl-10 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:bg-white/70 shadow-inner" placeholder={showPassword ? "YourPassword123" : "••••••••"} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-400/50 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 mt-4">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
              </button>
            </form>

            <div className="relative my-6 z-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-400/30"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-transparent px-2 text-slate-500 uppercase font-bold tracking-widest">Or</span></div>
            </div>

            <button onClick={handleGoogleLogin} className="w-full bg-white/90 border border-white hover:bg-white text-slate-700 font-bold py-3.5 rounded-xl shadow-lg shadow-slate-200/50 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 relative z-10">
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              <span className="text-lg">Sign in with Google</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

