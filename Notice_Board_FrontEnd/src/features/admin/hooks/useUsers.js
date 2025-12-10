// src/features/admin/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { fetchUsers, promoteUser } from '../services/adminService';
import { useToast } from '../../../context/ToastContext';

export const useUsers = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId);
      addToast("User promoted to Teacher", "success");
      loadUsers(); // Refresh
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to promote user", "error");
      return false;
    }
  };

  return {
    users,
    isLoading,
    promoteUser: handlePromote
  };
};