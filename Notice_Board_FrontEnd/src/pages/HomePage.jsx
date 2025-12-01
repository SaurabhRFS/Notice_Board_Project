import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

// Icons
import { BookOpen } from 'lucide-react';

// UI Components
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import FilterBar from '../components/FilterBar'; // <-- 1. Import the new component


function HomePage() {
  const navigate = useNavigate();
  
  // --- 1. AUTH STATE ---
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [username, setUsername] = useState('Student');

  const [isNoticesLoading, setIsNoticesLoading] = useState(false);

  // --- 2. FILTER STATE ---
  const [selectedBranch, setSelectedBranch] = useState(() => localStorage.getItem('filter_branch') || '');
  const [selectedSemester, setSelectedSemester] = useState(() => localStorage.getItem('filter_semester') || '');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Data Lists
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);

  // UI State
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Creation Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeSubject, setNewNoticeSubject] = useState('');
  const [newNoticeBranch, setNewNoticeBranch] = useState('GENERAL');
  const [newNoticeSemesters, setNewNoticeSemesters] = useState([]);
  const [newNoticeExpiresAt, setNewNoticeExpiresAt] = useState('');
  const [newNoticeFile, setNewNoticeFile] = useState(null);
  const [createError, setCreateError] = useState('');

  // --- 3. AUTO-SAVE EFFECT ---
  useEffect(() => {
    localStorage.setItem('filter_branch', selectedBranch);
    localStorage.setItem('filter_semester', selectedSemester);
  }, [selectedBranch, selectedSemester]);

  // --- 4. INITIALIZATION ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Decode Username
    try {
      const payloadPart = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadPart));
      const email = decodedPayload.sub;
      const namePart = email.split('@')[0];
      setUsername(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    } catch (e) {
      console.error("Token decode failed", e);
    }

    // Fetch Dropdown Data
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    Promise.all([
      axios.get(`${API_BASE_URL}/api/data/branches`, authConfig),
      axios.get(`${API_BASE_URL}/api/data/semesters`, authConfig),
      axios.get(`${API_BASE_URL}/api/data/subjects`, authConfig)
    ]).then(([branchRes, semRes, subjRes]) => {
      setBranches(branchRes.data);
      setSemesters(semRes.data);
      setSubjects(subjRes.data);
    }).catch(err => console.error("Failed to load filters", err));

    handleFilter(); 
  }, [token, navigate]);

  // --- 5. HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

const handleFilter = () => {
    setIsNoticesLoading(true); // 1. Start Spinning

    const authConfig = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        branch: selectedBranch || null,
        semester: selectedSemester || null,
        subjectId: selectedSubject || null
      }
    };
    
    axios.get(`${API_BASE_URL}/api/notices`, authConfig)
      .then(response => {
        setNotices(response.data);
        // We could stop loading here...
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
        // ...and here...
      })
      .finally(() => {
        // ...but this is the cleaner Professional way.
        // It runs NO MATTER WHAT happens above.
        setIsNoticesLoading(false); 
      });
  };

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
      targetBranch: newNoticeBranch, 
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
      await axios.post(`${API_BASE_URL}/api/notices`, formData, authConfig);
      setIsFormVisible(false);
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setNewNoticeSubject('');
      setNewNoticeBranch('GENERAL');
      setNewNoticeSemesters([]);
      setNewNoticeFile(null);
      handleFilter(); 
    } catch (err) {
      console.error('Error creating notice:', err);
      setCreateError('Failed to create notice.');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure?')) return;
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      await axios.delete(`${API_BASE_URL}/api/notices/${noticeId}`, authConfig);
      handleFilter(); 
    } catch (err) {
      console.error('Error deleting notice:', err);
      const message = err?.response?.data?.message || err?.message || 'Unknown error';
      alert(`Failed to delete notice: ${message}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      
      <AnimatedBackground />

      <Navbar 
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        onCreateClick={() => setIsFormVisible(!isFormVisible)}
        onAdminClick={() => navigate('/admin')}
      />

      <div className="relative z-10 pt-24 md:pt-28 pb-12 px-4 max-w-7xl mx-auto">
        
        {/* --- 2. CLEANER USAGE: JUST THE COMPONENT --- */}
        <FilterBar 
          branches={branches}
          semesters={semesters}
          subjects={subjects}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          onApply={handleFilter}
          isLoading={isNoticesLoading}
        />

        {/* --- Create Notice Modal (Same as before, hidden logic) --- */}
        {isFormVisible && (
          <div className="mb-8 animate-fade-in-up">
            <GlassCard className="!max-w-2xl mx-auto border-blue-200/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Create New Notice</h3>
                <button onClick={() => setIsFormVisible(false)} className="text-slate-400 hover:text-red-500">Close</button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Title" className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={newNoticeTitle} onChange={(e) => setNewNoticeTitle(e.target.value)} />
                <textarea placeholder="Content..." className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-32" value={newNoticeContent} onChange={(e) => setNewNoticeContent(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={newNoticeBranch} onChange={(e) => setNewNoticeBranch(e.target.value)} className="p-3 bg-white/50 rounded-xl border border-slate-200">
                    <option value="GENERAL">GENERAL (All Branches)</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select value={newNoticeSubject} onChange={(e) => setNewNoticeSubject(e.target.value)} className="p-3 bg-white/50 rounded-xl border border-slate-200">
                    <option value="">No Subject (General)</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-bold text-slate-600">Target Semesters (Hold Ctrl/Cmd)</label>
                   <select multiple className="p-3 bg-white/50 rounded-xl border border-slate-200 h-32" value={newNoticeSemesters} onChange={(e) => setNewNoticeSemesters([...e.target.selectedOptions].map(o => o.value))}>
                      {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expires On</label>
                    <input type="date" value={newNoticeExpiresAt} onChange={(e) => setNewNoticeExpiresAt(e.target.value)} className="w-full p-2 bg-white/50 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Attachment</label>
                    <input type="file" onChange={(e) => setNewNoticeFile(e.target.files[0])} className="w-full text-sm text-slate-500"/>
                  </div>
                </div>
                <button onClick={handleCreateNotice} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">Publish Notice</button>
                {createError && <p className="text-red-500 text-center">{createError}</p>}
              </div>
            </GlassCard>
          </div>
        )}

        {/* --- Notices Grid (Same as before) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/40">
              <p className="text-3xl text-slate-300 font-black mb-2">Nothing Here</p>
              <p className="text-slate-500 font-medium">Try adjusting your filters or checking back later.</p>
            </div>
          ) : (
            notices.map(notice => (
              <GlassCard key={notice.id} className="hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    {notice.targetBranch || 'General'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{notice.title}</h3>
                <p className="text-slate-600 mb-6 line-clamp-4 text-sm leading-relaxed flex-grow">{notice.content}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-white flex items-center justify-center text-slate-600 font-bold text-xs shadow-sm">
                      {notice.author.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700 leading-none">{notice.author.username}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{notice.author.role.replace('ROLE_', '')}</span>
                    </div>
                  </div>
                  {notice.attachmentUrls?.length > 0 && (
                    <a href={notice.attachmentUrls[0]} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="Download Attachment">
                      <BookOpen size={16} />
                    </a>
                  )}
                </div>
                {(userRole === 'ROLE_TEACHER' || userRole === 'ROLE_ADMIN') && (
                  <button onClick={() => handleDeleteNotice(notice.id)} className="w-full py-2 mt-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                    Delete
                  </button>
                )}
              </GlassCard>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default HomePage;