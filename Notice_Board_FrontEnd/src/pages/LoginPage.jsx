import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';

import { loginUser, googleLoginUser } from '../services/authService';
import GlassCard from '../components/GlassCard';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import GoogleButton from '../components/GoogleButton';
import AnimatedBackground from '../components/AnimatedBackground';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- FIX 1: Auto-Redirect if already logged in ---
  // If a user presses "Back" to get here, this kicks them forward immediately.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      
      // --- FIX 2: Use 'replace: true' ---
      // This deletes the Login Page from history so "Back" closes the app (or goes to Google)
      navigate('/', { replace: true });
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Wrong email or password");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLoginUser(idToken);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      
      // --- FIX 2: Use 'replace: true' here too ---
      navigate('/', { replace: true });
      
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google login cancelled.");
      } 
      else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your internet.");
      }
      else if (err.response?.status === 500) {
        setError("Server error during Google login.");
      } else {
        setError("Google login failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-start pt-1 md:items-center md:pt-0 justify-center relative overflow-hidden">
      
      <AnimatedBackground />

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 z-10 relative md:-mt-24">
        
        {/* Left Column */}
        <div className="flex flex-col justify-center items-start p-6 md:p-16 relative">
          
          <div className="flex items-center gap-3 mb-2 md:mb-6 animate-fade-in-up">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Zap size={28} className="text-white md:w-8 md:h-8" fill="currentColor" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">CampusNotice</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-none md:leading-tight mb-3 md:mb-6 animate-fade-in-up [animation-delay:100ms]">
            Stay updated with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
              CampusNotice
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-slate-600 max-w-md animate-fade-in-up [animation-delay:200ms] font-medium leading-normal md:leading-relaxed">
            Connect to the grid. Get real-time announcements, grades, and schedules in one synchronized hub.
          </p>
        </div>

        {/* Right Column (Glass Form) */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <GlassCard>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2 animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <FormInput 
                label="Email" 
                type="email" 
                placeholder="student@college.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
              />

              <FormInput 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-blue-500 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <PrimaryButton type="submit" isLoading={isLoading}>Sign In</PrimaryButton>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white/80 backdrop-blur px-2 text-slate-400 uppercase font-bold tracking-widest">Or</span></div>
            </div>

            <GoogleButton onClick={handleGoogleLogin} isLoading={isLoading} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;