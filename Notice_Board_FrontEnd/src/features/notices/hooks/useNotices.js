// src/features/notices/hooks/useNotices.js
import { useState, useEffect, useMemo } from 'react';
import { fetchNotices, deleteNotice, fetchFilters } from '../../../services/noticeService';
import { useToast } from '../../../context/ToastContext';

export const useNotices = () => {
  const { addToast } = useToast();
  
  // Notice State
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter Data State
  const [filterData, setFilterData] = useState({ branches: [], semesters: [], subjects: [] });
  
  // Active Filter State
  const [filters, setFilters] = useState({
    branch: localStorage.getItem('filter_branch') || '',
    semester: localStorage.getItem('filter_semester') || '',
    subjectId: ''
  });

  // --- Actions ---

  // 1. Load Filter Options (Branches, etc.)
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchFilters();
        setFilterData(data);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    loadFilters();
  }, []);

  // 2. Load Notices (Triggers when filters change)
  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotices(filters);
      setNotices(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load notices", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Persist filters & Reload notices
  useEffect(() => {
    localStorage.setItem('filter_branch', filters.branch);
    localStorage.setItem('filter_semester', filters.semester);
    loadNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // 3. Delete Logic
  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      addToast("Notice deleted successfully", "success");
      // If loadNotices is available in scope, call it. 
      // If this is inside the hook, use the function responsible for refreshing.
      loadNotices(); 
      return true;
    } catch (error) {
      // FIX: Log the error to the console so it is "handled"
      console.error("Delete failed:", error); 
      addToast("Failed to delete notice", "error");
      return false;
    }
  };

  // 4. Computed Subjects (Dependent on active filters)
  const availableSubjects = useMemo(() => {
    return filterData.subjects.filter(subject => {
      const branchMatch = !filters.branch || subject.branch === filters.branch;
      const semMatch = !filters.semester || subject.semester === filters.semester;
      return branchMatch && semMatch;
    });
  }, [filterData.subjects, filters.branch, filters.semester]);

  return {
    notices,
    isLoading,
    filterOptions: { ...filterData, subjects: availableSubjects },
    filters,
    setFilters,
    refreshNotices: loadNotices,
    handleDelete
  };
};