// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig'; // Ensures we point to your Render backend

// Import the Firebase tools (using Popup)
import { auth, googleProvider } from '../firebase'; 
import { signInWithPopup } from 'firebase/auth'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- 1. Local Login (Email/Password) ---
  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: email,
        password: password
      });
      
      // Save the "wristband" (token) and role
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      
      // Go to Home
      navigate('/'); 

    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  // --- 2. Google Login (Popup Flow) ---
  const handleGoogleLogin = async () => {
    setError('');
    
    try {
      // A. Open the Firebase Popup
      // (This works now because we removed the strict headers from vite.config.js)
      const result = await signInWithPopup(auth, googleProvider);
      
      // B. Get the "Firebase wristband"
      const idToken = await result.user.getIdToken();

      // C. Send it to our Backend "Handshake" Endpoint
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: idToken 
      });

      // D. Backend sends back OUR app's token
      const { token, role } = response.data;

      // E. Save and Navigate
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      navigate('/'); 

    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.'); 
    }
  };

  return (
    <div>
      <h1>Notice Board Login</h1>
      
      {/* Email/Pass Form */}
      <div>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <hr /> 

      {/* Google Popup Button */}
      <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', color: 'white' }}>
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginPage;