// src/features/admin/hooks/useSubjects.js
import { useState, useEffect } from 'react';
import { fetchSubjectsData, createSubject, updateSubject, deleteSubject } from '../services/adminService';
import { useToast } from '../../../context/ToastContext'; // Adjust path if needed (../../context/ToastContext)

export const useSubjects = () => {
  const { addToast } = useToast();
  
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubjectsData();
      setSubjects(data.subjects);
      setBranches(data.branches);
      setSemesters(data.semesters);
    } catch (err) {
      console.error(err);
      addToast("Failed to load subject data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actions
  const handleSave = async (subjectData, isEditing = false, id = null) => {
    try {
      if (isEditing) {
        await updateSubject(id, subjectData);
        addToast("Subject updated successfully", "success");
      } else {
        await createSubject(subjectData);
        addToast("Subject created successfully", "success");
      }
      loadData(); // Refresh list
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to save subject", "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      addToast("Subject deleted successfully", "success");
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to delete subject", "error");
      return false;
    }
  };

  return {
    subjects,
    branches,
    semesters,
    isLoading,
    saveSubject: handleSave,
    deleteSubject: handleDelete
  };
};