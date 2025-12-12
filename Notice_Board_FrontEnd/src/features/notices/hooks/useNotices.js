import { useState, useEffect, useMemo } from 'react';
import { fetchNotices, deleteNotice, fetchFilters } from '../../../services/noticeService';
import { useToast } from '../../../context/ToastContext';

export const useNotices = () => {
  const { addToast } = useToast();
  
  // 1. Load Notices from Session Cache (Instant "Back" button support)
  const [notices, setNotices] = useState(() => {
    try {
      const cached = sessionStorage.getItem('campus_notices_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (e) { return []; }
  });

  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('campus_notices_cache'));
  
  // --- 2. OPTIMIZATION: Load Filters from LocalStorage (0ms Load) ---
  const [filterData, setFilterData] = useState(() => {
    try {
      const cachedFilters = localStorage.getItem('campus_filter_options');
      return cachedFilters ? JSON.parse(cachedFilters) : { branches: [], semesters: [], subjects: [] };
    } catch (e) { return { branches: [], semesters: [], subjects: [] }; }
  });
  
  const [filters, setFilters] = useState({
    branch: localStorage.getItem('filter_branch') || '',
    semester: localStorage.getItem('filter_semester') || '',
    subjectId: ''
  });

  // --- 3. FETCH FILTERS (Only if missing) ---
  useEffect(() => {
    const loadFilters = async () => {
      // If we already have data, don't waste network bandwidth!
      if (filterData.branches.length > 0) return;

      try {
        const data = await fetchFilters();
        setFilterData(data);
        // Save for next time (Persistent Cache)
        localStorage.setItem('campus_filter_options', JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    loadFilters();
  }, [filterData.branches.length]); // Only run if branches are empty

  // 4. Manual Search Logic
  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotices(filters);
      setNotices(data);
      sessionStorage.setItem('campus_notices_cache', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      addToast("Failed to load notices", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Persist user preferences
  useEffect(() => {
    localStorage.setItem('filter_branch', filters.branch);
    localStorage.setItem('filter_semester', filters.semester);
  }, [filters]);

  // Initial Load
  useEffect(() => {
    loadNotices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      addToast("Notice deleted successfully", "success");
      loadNotices(); 
      return true;
    } catch (error) {
      console.error("Delete failed:", error); 
      addToast("Failed to delete notice", "error");
      return false;
    }
  };

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