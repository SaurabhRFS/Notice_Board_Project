// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios'; // 1. Import our new "messenger"
import { useNavigate } from 'react-router-dom'; // 2. Import the "redirect" tool

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 3. A "memory box" for error messages
  const navigate = useNavigate(); // 4. Get the "redirect" tool

  // This is the URL of our backend's login "door"
  const LOGIN_URL = 'http://localhost:8080/api/auth/login';
  const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

  // 5. This function is now "smart"
  const handleLogin = async () => {
    setError(''); // Clear any old errors

    try {
      // 6. Use the "messenger" to call our API
      const response = await axios.post(LOGIN_URL, {
        email: email,
        password: password
      });

      // 7. If the login is a SUCCESS:
      console.log('Success:', response.data);
      
      // 8. Get the "wristband" (token) and "role" from the response
      const token = response.data.token;
      const role = response.data.role;

      // 9. Save them to the browser's "wallet" (localStorage)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);

      // 10. Redirect to the home page!
      navigate('/'); 

    } catch (err) {
      // 11. If the login is a FAILURE:
      console.error('Login failed:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Notice Board Login</h1>
      
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

      {/* 12. Show an error message if one exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr /> 

      <div>
        <a href={GOOGLE_AUTH_URL}>
          <button>Sign in with Google</button>
        </a>
      </div>
    </div>
  );
}

export default LoginPage;