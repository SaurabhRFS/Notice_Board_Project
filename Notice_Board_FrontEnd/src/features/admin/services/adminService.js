import api from '../../../services/api'; // Import the centralized instance

// --- SUBJECTS ---
export const fetchSubjectsData = async () => {
  const [subjects, branches, semesters] = await Promise.all([
    api.get('/api/data/subjects'),
    api.get('/api/data/branches'),
    api.get('/api/data/semesters')
  ]);
  return { 
    subjects: subjects.data, 
    branches: branches.data, 
    semesters: semesters.data 
  };
};

export const createSubject = async (data) => {
  const response = await api.post('/api/admin/subjects', data);
  return response.data;
};

export const updateSubject = async (id, data) => {
  const response = await api.put(`/api/admin/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/api/admin/subjects/${id}`);
  return response.data;
};

// --- USERS ---
export const fetchUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const promoteUser = async (userId) => {
  const response = await api.put(`/api/admin/users/${userId}/promote`);
  return response.data;
};