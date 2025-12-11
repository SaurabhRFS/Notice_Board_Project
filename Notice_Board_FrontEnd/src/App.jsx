import React, { Suspense } from 'react'; // 1. Import Suspense
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage'; 
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './features/auth/LoginPage';
import AuthCallback from './features/auth/AuthCallback';


// 2. Lazy Load Admin Page
// This tells React: "Don't import this file until we actually need it."
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

const BuySellPage = React.lazy(() => import('./features/marketplace/BuySellPage'));

// Context
import { ToastProvider } from './context/ToastContext';

// 3. Create a simple Loading Spinner for the transition
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);
const LabsPage = React.lazy(() => import('./features/labs/LabsPage')); // New

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
            
            {/* 4. Wrap the Lazy Component in Suspense */}
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPage />
                </Suspense>
              } 
            />
            <Route path="/labs" element={ <Suspense fallback={<PageLoader />}> <LabsPage /> </Suspense>} />
            <Route path="/buy-sell" element={<Suspense fallback={<PageLoader />}> <BuySellPage /> </Suspense>} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;