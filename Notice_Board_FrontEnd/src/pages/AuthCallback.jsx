// src/pages/AuthCallback.jsx

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AuthCallback() {
  // 1. Get the "tools"
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 2. This runs *one time* when the page loads
  useEffect(() => {
    // 3. "Catch" the token and role from the URL
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token && role) {
      // 4. Save them to the "wallet" (localStorage)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      
      // 5. Redirect to the home page!
      navigate('/');
    } else {
      // If something went wrong, send back to login
      navigate('/login');
    }
  }, [searchParams, navigate]); // The dependencies

  // 6. This page shows nothing, just a "loading" message
  return (
    <div>Loading...</div>
  );
}

export default AuthCallback;