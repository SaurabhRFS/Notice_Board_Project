import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebase'; // Adjust path if needed (../../config/firebase)
import { loginUser, googleLoginUser } from '../../../services/authService'; // Adjust path if needed

export const useLogin = () => {
  const navigate = useNavigate();
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Auto-Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // 2. Handle Local Login
  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
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

  // 3. Handle Google Login
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLoginUser(idToken);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google login cancelled.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your internet.");
      } else {
        setError("Google login failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error,
    isLoading,
    handleLocalLogin,
    handleGoogleLogin
  };
};
