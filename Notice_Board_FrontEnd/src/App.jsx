// src/App.jsx

import { Routes, Route } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage.jsx';    
import HomePage from './pages/HomePage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import AdminPage from './pages/AdminPage.jsx'; // 1. Import our new AdminPage

function App() {
  return (
    <div>
      <Routes>
        
        {/* Home page destinations */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Login page destination */}
        <Route path="/login" element={<LoginPage />} />

        {/* Google "catcher" route */}
        <Route path="/oauth2/redirect" element={<AuthCallback />} />

        {/* 2. THIS IS THE NEW "ADMIN" ROUTE */}
        <Route path="/admin" element={<AdminPage />} />
        
      </Routes>
    </div>
  );
}

export default App;