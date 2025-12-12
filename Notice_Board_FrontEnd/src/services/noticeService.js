import api from './api';

export const fetchNotices = async (filters) => {
  // 1. We now ask for specific pages (default to page 0, 20 items)
  const response = await api.get('/api/notices', { 
    params: {
      ...filters,
      page: 0,
      size: 20 
    }
  });
  
  // 2. IMPORTANT FIX: The data is now inside '.content'
  // If we don't do this, the app tries to read the whole object as a list and fails.
  return response.data.content || [];
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/api/notices/${id}`);
  return response.data;
};

export const fetchFilters = async () => {
  const [branches, semesters, subjects] = await Promise.all([
    api.get('/api/data/branches'),
    api.get('/api/data/semesters'),
    api.get('/api/data/subjects')
  ]);
  return {
    branches: branches.data,
    semesters: semesters.data,
    subjects: subjects.data
  };
};