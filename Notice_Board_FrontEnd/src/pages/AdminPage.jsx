// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig'; // <-- 1. ADDED THIS IMPORT

function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- "Memory boxes" for the new subject form ---
  const [subjectName, setSubjectName] = useState('');
  const [subjectBranch, setSubjectBranch] = useState('');
  const [subjectSemester, setSubjectSemester] = useState('');
  const [error, setError] = useState('');

  // --- "Memory boxes" for the dropdowns ---
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // --- "Memory box" for the user list ---
  const [users, setUsers] = useState([]);

  // --- "On Load" function (useEffect) ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    
    // --- 2. RE-WIRED THESE URLS ---
    axios.get(`${API_BASE_URL}/api/data/branches`, authConfig).then(res => setBranches(res.data));
    axios.get(`${API_BASE_URL}/api/data/semesters`, authConfig).then(res => setSemesters(res.data));

    // Load the list of all users
    fetchUsers();
  }, [token, navigate]);

  // --- Function to get all users ---
  const fetchUsers = () => {
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    // --- 3. RE-WIRED THIS URL ---
    axios.get(`${API_BASE_URL}/api/admin/users`, authConfig)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Could not fetch users", err));
  };

  // --- "Create Subject" button logic ---
  const handleCreateSubject = async () => {
    setError('');
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    const subjectData = {
      name: subjectName,
      branch: subjectBranch,
      semester: subjectSemester
    };
    try {
      // --- 4. RE-WIRED THIS URL ---
      await axios.post(`${API_BASE_URL}/api/admin/subjects`, subjectData, authConfig);
      alert('Subject created successfully!');
      navigate('/'); // Redirect back to the Home page
    } catch (err) {
      console.error('Error creating subject:', err);
      setError('Failed to create subject. Are you an Admin?');
    }
  };

  // --- "PROMOTE USER" LOGIC ---
  const handlePromoteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to TEACHER?')) {
      return;
    }
    
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      // --- 5. RE-WIRED THIS URL ---
      await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {}, authConfig);
      
      // Success!
      alert('User promoted to Teacher!');
      fetchUsers(); // Refresh the user list to show the new role
    
    } catch (err) {
      console.error('Error promoting user:', err);
      alert('Failed to promote user.');
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/')}>Back to Home</button>
      <hr />
      <h1>Admin Panel</h1>

      {/* --- "Create Subject" Form --- */}
      <div style={{ background: '#eee', padding: '10px' }}>
        <h3>Create New Subject</h3>
        <div>
          <input 
            type="text" 
            placeholder="Subject Name (e.g., DSA)"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </div>
        <div>
          <select value={subjectBranch} onChange={(e) => setSubjectBranch(e.target.value)}>
            <option value="">Select Branch...</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div>
          <select value={subjectSemester} onChange={(e) => setSubjectSemester(e.target.value)}>
            <option value="">Select Semester...</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
        <button onClick={handleCreateSubject} style={{ marginTop: '10px' }}>
          Create Subject
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <hr />

      {/* --- "USER MANAGEMENT" SECTION --- */}
      <div style={{ background: '#f9f9f9', padding: '10px', marginTop: '20px' }}>
        <h3>User Management</h3>
        <table border="1" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {/* Only show the button if they are a STUDENT */}
                  {user.role === 'ROLE_STUDENT' && (
                    <button onClick={() => handlePromoteUser(user.id)}>
                      Promote to Teacher
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;