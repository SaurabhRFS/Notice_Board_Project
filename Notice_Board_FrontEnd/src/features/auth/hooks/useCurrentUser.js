import { useState, useEffect } from 'react';

export const useCurrentUser = () => {
  const [username, setUsername] = useState('Student');
  const [userRole, setUserRole] = useState('ROLE_STUDENT');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (token) {
      try {
        // --- THE LOGIC YOU WERE LOOKING FOR ---
        const payloadPart = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadPart));
        const email = decodedPayload.sub || "";
        
        // Extract name from email (e.g., "john" from "john@example.com")
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        
        setUsername(formattedName);
      } catch (e) {
        console.error("Failed to extract username from token", e);
      }
    }
  }, []);

  return { username, userRole };
};