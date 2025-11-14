// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  // --- 1. Read the "wallet" (localStorage) ---
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  // --- 2. "Memory boxes" for Filters ---
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notices, setNotices] = useState([]);

  // --- 3. "Memory boxes" for the "All-in-One" Create Form ---
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeSubject, setNewNoticeSubject] = useState('');
  const [newNoticeSemesters, setNewNoticeSemesters] = useState([]);
  const [newNoticeExpiresAt, setNewNoticeExpiresAt] = useState('');
  const [newNoticeFile, setNewNoticeFile] = useState(null);
  const [createError, setCreateError] = useState('');

  // --- 4. "On Load" function (useEffect) ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    
    // Fetch data for dropdowns
    axios.get('http://localhost:8080/api/data/branches', authConfig).then(res => setBranches(res.data));
    axios.get('http://localhost:8080/api/data/semesters', authConfig).then(res => setSemesters(res.data));
    axios.get('http://localhost:8080/api/data/subjects', authConfig).then(res => setSubjects(res.data));
    handleFilter(); // Load all notices on start
  }, [token, navigate]);

  // --- 5. "Filter" button logic ---
  const handleFilter = () => {
    const authConfig = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        branch: selectedBranch || null,
        semester: selectedSemester || null,
        subjectId: selectedSubject || null
      }
    };
    axios.get('http://localhost:8080/api/notices', authConfig)
      .then(response => setNotices(response.data))
      .catch(error => console.error('Error fetching notices:', error));
  };

  // --- 6. "Logout" button logic ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // --- 7. "Create Notice" logic (All-in-One Form) ---
  const handleCreateNotice = async () => {
    setCreateError('');
    const authConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
    const noticeData = {
      title: newNoticeTitle,
      content: newNoticeContent,
      subjectId: newNoticeSubject || null,
      targetSemesters: newNoticeSemesters,
      expiresAt: newNoticeExpiresAt || null,
      isPinned: false
    };
    const formData = new FormData();
    formData.append('notice', JSON.stringify(noticeData));
    if (newNoticeFile) {
      formData.append('file', newNoticeFile);
    }
    try {
      await axios.post('http://localhost:8080/api/notices', formData, authConfig);
      setIsFormVisible(false);
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setNewNoticeSubject('');
      setNewNoticeSemesters([]);
      setNewNoticeExpiresAt('');
      setNewNoticeFile(null);
      handleFilter(); // Refresh the list!
    } catch (err) {
      console.error('Error creating notice:', err);
      setCreateError('Failed to create notice. Please try again.');
    }
  };

  // --- 8. "Delete Notice" logic ---
  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure?')) return;
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:8080/api/notices/${noticeId}`, authConfig);
      handleFilter(); // Refresh list
    } catch (err) {
      alert('Failed to delete notice.');
    }
  };

  // --- 9. The HTML (JSX) ---
  return (
    <div>
      <h1>Notice Board Home</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* --- THIS IS THE NEW ADMIN BUTTON --- */}
      {/* It only shows if you are an ADMIN */}
      {(userRole === 'ROLE_ADMIN') && (
        <button 
          onClick={() => navigate('/admin')} 
          style={{ marginLeft: '10px', background: 'lightblue' }}
        >
          Admin Panel
        </button>
      )}
      {/* ---------------------------------- */}

      <hr />

      {/* --- The "Smart" 3-Dropdown Filter --- */}
      <div>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="">Select Branch (All)</option>
          {branches.map(branch => (<option key={branch} value={branch}>{branch}</option>))}
        </select>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="">Select Semester (All)</option>
          {semesters.map(sem => (<option key={sem} value={sem}>{sem}</option>))}
        </select>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject (All)</option>
          {subjects.map(subject => (<option key={subject.id} value={subject.id}>{subject.name}</option>))}
        </select>
        <button onClick={handleFilter}>Filter</button>
      </div>
      <hr />

      {/* --- "Create Notice" Section --- */}
      {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
        <div style={{ background: '#eee', padding: '10px', marginBottom: '15px' }}>
          <h3>Teacher / Admin Controls</h3>
          <button onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? 'Cancel' : 'Create New Notice'}
          </button>
          {isFormVisible && (
            <div style={{ marginTop: '15px' }}>
              <h4>New Notice</h4>
              <div><input type="text" placeholder="Title" value={newNoticeTitle} onChange={(e) => setNewNoticeTitle(e.target.value)} /></div>
              <div><textarea placeholder="Content" value={newNoticeContent} onChange={(e) => setNewNoticeContent(e.target.value)} /></div>
              <div>
                <select value={newNoticeSubject} onChange={(e) => setNewNoticeSubject(e.target.value)}>
                  <option value="">Select Subject (General)</option>
                  {subjects.map(subject => (<option key={subject.id} value={subject.id}>{subject.name}</option>))}
                </select>
              </div>
              <div>
                <label>Target Semesters (Hold Cmd to select multiple):</label>
                <select 
                  multiple={true} 
                  value={newNoticeSemesters}
                  onChange={(e) => {
                    const options = [...e.target.selectedOptions];
                    const values = options.map(option => option.value);
                    setNewNoticeSemesters(values);
                  }}
                >
                  {semesters.map(sem => (<option key={sem} value={sem}>{sem}</option>))}
                </select>
              </div>
              <div>
                <label>Auto-delete on:</label>
                <input 
                  type="date"
                  value={newNoticeExpiresAt}
                  onChange={(e) => setNewNoticeExpiresAt(e.target.value)}
                />
              </div>
              <div>
                <label>Attachment:</label>
                <input 
                  type="file"
                  onChange={(e) => setNewNoticeFile(e.target.files[0])}
                />
              </div>
              <button onClick={handleCreateNotice} style={{ marginTop: '10px' }}>Submit Notice</button>
              {createError && <p style={{ color: 'red' }}>{createError}</p>}
            </div>
          )}
        </div>
      )}
      
      {/* --- The "Smart" Notice List --- */}
      <h2>Notices</h2>
      <div>
        {notices.length === 0 ? (
          <p>No notices found for your filter.</p>
        ) : (
          notices.map(notice => (
            <div key={notice.id} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
              <h3>{notice.title}</h3>
              <p>{notice.content}</p>
              <p><b>Posted by:</b> {notice.author.username}</p>
              {notice.subject && <p><b>Subject:</b> {notice.subject.name}</p>}
              
              {notice.attachmentUrls && notice.attachmentUrls.length > 0 && (
                <div>
                  <b>Attachments:</b>
                  <ul>
                    {notice.attachmentUrls.map((url, index) => (
                      <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
                <div style={{ marginTop: '10px' }}>
                  <button 
                    style={{ color: 'red' }} 
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    Delete
                  </button>
                  {/* The upload button is now part of the "Create" form */}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;