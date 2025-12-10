import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 1. FIX: Added BrowserRouter

// Page Imports
import LoginPage from './pages/LoginPage.jsx';    
import HomePage from './pages/HomePage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Context Imports
import { ToastProvider } from './context/ToastContext'; // 2. FIX: Correct path (./ instead of ../)

// Component Imports
// import Cursor from './components/Cursor.jsx'; 

function App() {
  return (
    <BrowserRouter> {/* 3. FIX: Router MUST be the top-level wrapper */}
      <ToastProvider> {/* Provider wraps the app inside the Router */}
        
        <div className="h-screen w-screen overflow-x-hidden bg-slate-50 text-slate-900 font-sans">
          
          {/* <Cursor /> */}
          
          <Routes>
            {/* Home page destinations */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Login page destination */}
            <Route path="/login" element={<LoginPage />} />

            {/* Google "catcher" route */}
            <Route path="/oauth2/redirect" element={<AuthCallback />} />

            {/* Admin Route */}
            <Route path="/admin" element={<AdminPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </div>

      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;