import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage'; 
import AdminPage from './pages/AdminPage'; 
import NotFoundPage from './pages/NotFoundPage';

// Feature Pages (Auth) -> NEW PATHS
import LoginPage from './features/auth/LoginPage';
import AuthCallback from './features/auth/AuthCallback';

// Context
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="h-screen w-screen overflow-x-hidden bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2/redirect" element={<AuthCallback />} />
            
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;