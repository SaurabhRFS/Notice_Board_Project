import api from './api';

export const fetchNotices = async (filters) => {
  // api.get automatically adds the token!
  const response = await api.get('/api/notices', { params: filters });
  return response.data;
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