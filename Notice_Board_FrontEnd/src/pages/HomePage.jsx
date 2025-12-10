import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

// Icons
import { X, Loader2, Pin } from 'lucide-react';

// UI Components
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import FilterBar from '../components/FilterBar';
import NoticeCard from '../components/NoticeCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import NoticeCardSkeleton from '../components/NoticeCardSkeleton';
import EmptyState from '../components/EmptyState';

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
  const [isCreating, setIsCreating] = useState(false);
  
  // --- DELETE MODAL STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Creation Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeSubject, setNewNoticeSubject] = useState('');
  const [newNoticeBranch, setNewNoticeBranch] = useState('GENERAL');
  const [newNoticeSemesters, setNewNoticeSemesters] = useState([]);
  const [newNoticeExpiresAt, setNewNoticeExpiresAt] = useState('');
  const [newNoticePinned, setNewNoticePinned] = useState(false); 
  const [newNoticeFiles, setNewNoticeFiles] = useState([]);
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

  // --- SMART SUBJECT FILTERING LOGIC ---
  const filteredSubjects = subjects.filter(subject => {
    const branchMatch = !selectedBranch || subject.branch === selectedBranch;
    const semMatch = !selectedSemester || subject.semester === selectedSemester;
    return branchMatch && semMatch;
  });

  // --- FIX 2 & 3: .some() and Number.parseInt() ---
  useEffect(() => {
    // Check if the selected subject actually exists in the filtered list
    if (selectedSubject && !filteredSubjects.some(s => s.id === Number.parseInt(selectedSubject, 10))) {
      setSelectedSubject('');
    }
  }, [selectedBranch, selectedSemester, filteredSubjects, selectedSubject]);

  // --- 5. HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleFilter = () => {
    setIsNoticesLoading(true);
    const authConfig = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        branch: selectedBranch || null,
        semester: selectedSemester || null,
        subjectId: selectedSubject || null
      }
    };
    axios.get(`${API_BASE_URL}/api/notices`, authConfig)
      .then(response => setNotices(response.data))
      .catch(error => console.error('Error fetching notices:', error))
      .finally(() => setIsNoticesLoading(false));
  };

  const removeFile = (indexToRemove) => {
    setNewNoticeFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      setCreateError("Title and Content are required.");
      return;
    }

    setCreateError('');
    setIsCreating(true);

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
      isPinned: newNoticePinned 
    };

    const formData = new FormData();
    formData.append('notice', JSON.stringify(noticeData));

    // --- FIX 1: Use for...of loop ---
    if (newNoticeFiles && newNoticeFiles.length > 0) {
      for (const file of newNoticeFiles) {
        formData.append('files', file);
      }
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/notices`, formData, authConfig);
      
      // Reset Form
      setIsFormVisible(false);
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setNewNoticeSubject('');
      setNewNoticeBranch('GENERAL');
      setNewNoticeSemesters([]);
      setNewNoticeExpiresAt('');
      setNewNoticePinned(false);
      setNewNoticeFiles([]);
      
      handleFilter(); 

    } catch (err) {
      console.error('Error creating notice:', err);
      setCreateError('Failed to create notice.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (noticeId) => {
    setNoticeToDelete(noticeId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    
    setIsDeleting(true); 
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };
    
    try {
      await axios.delete(`${API_BASE_URL}/api/notices/${noticeToDelete}`, authConfig);
      setIsDeleteModalOpen(false);
      setNoticeToDelete(null);
      handleFilter(); 
    } catch (err) {
      console.error('Error deleting notice:', err);
      alert('Failed to delete notice.');
    } finally {
      setIsDeleting(false); 
    }
  };

  // --- HELPER: Logic Extraction (Fixes Nested Ternary Warning) ---
  const renderNoticesGrid = () => {
    
    // CASE 1: LOADING
    if (isNoticesLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <NoticeCardSkeleton key={index} />
      ));
    }

    // CASE 2: EMPTY
    if (notices.length === 0) {
      return (
        <EmptyState 
          message={selectedSubject || selectedBranch ? "No Matches Found" : "Nothing Here Yet"}
          subMessage={selectedSubject || selectedBranch ? "Try adjusting your filters to see more results." : "Relax! You're all caught up on campus updates."}
        />
      );
    }

    // CASE 3: DATA (The Waterfall)
    return notices.map((notice, index) => (
      <div 
        key={notice.id}
        className="animate-fade-in-up opacity-0"
        style={{ 
          animationDelay: `${index * 300}ms`, 
          animationFillMode: 'forwards'
        }}
      >
        <NoticeCard 
          notice={notice} 
          userRole={userRole} 
          onDelete={handleDeleteClick} 
        />
      </div>
    ));
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
        
        <FilterBar 
          branches={branches}
          semesters={semesters}
          subjects={filteredSubjects} 
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          onApply={handleFilter}
          isLoading={isNoticesLoading}
        />

        {isFormVisible && (
          <div className="mb-8 animate-fade-in-up">
            <GlassCard className="!max-w-xl mx-auto border-blue-200/50 relative z-50">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">New Announcement</h3>
                <button onClick={() => setIsFormVisible(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Notice Title" 
                  className="w-full p-4 bg-white/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold text-slate-800 placeholder:text-slate-400" 
                  value={newNoticeTitle} 
                  onChange={(e) => setNewNoticeTitle(e.target.value)} 
                />

                <textarea 
                  placeholder="What's happening? (You can use markdown-like spacing)" 
                  className="w-full p-4 bg-white/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none h-40 font-medium text-slate-700 placeholder:text-slate-400 resize-none" 
                  value={newNoticeContent} 
                  onChange={(e) => setNewNoticeContent(e.target.value)} 
                />

                {/* --- FIX 4: Associated Labels (id + htmlFor) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="targetBranch" className="text-xs font-bold text-slate-500 uppercase ml-1">Target Branch</label>
                    <select 
                      id="targetBranch"
                      value={newNoticeBranch} 
                      onChange={(e) => setNewNoticeBranch(e.target.value)} 
                      className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="GENERAL">GENERAL (All Branches)</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="relatedSubject" className="text-xs font-bold text-slate-500 uppercase ml-1">Related Subject</label>
                    <select 
                      id="relatedSubject"
                      value={newNoticeSubject} 
                      onChange={(e) => setNewNoticeSubject(e.target.value)} 
                      className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">None (General Notice)</option>
                      {subjects
                        .filter(s => newNoticeBranch === 'GENERAL' || s.branch === newNoticeBranch)
                        .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                      }
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label htmlFor="targetSemesters" className="text-xs font-bold text-slate-500 uppercase ml-1">Target Semesters</label>
                     <select 
                        id="targetSemesters"
                        multiple 
                        className="w-full p-2 bg-white/50 rounded-xl border border-slate-200 text-xs font-medium h-32 focus:ring-2 focus:ring-blue-500/50" 
                        value={newNoticeSemesters} 
                        onChange={(e) => setNewNoticeSemesters([...e.target.selectedOptions].map(o => o.value))}
                     >
                        {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     <p className="text-[10px] text-slate-400 pl-1">Hold Ctrl/Cmd to select multiple</p>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                        <label htmlFor="expiresOn" className="text-xs font-bold text-slate-500 uppercase ml-1">Expires On</label>
                        <input 
                          id="expiresOn"
                          type="date" 
                          value={newNoticeExpiresAt} 
                          onChange={(e) => setNewNoticeExpiresAt(e.target.value)} 
                          className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700" 
                        />
                      </div>

                      <button 
                        onClick={() => setNewNoticePinned(!newNoticePinned)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          newNoticePinned 
                            ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm' 
                            : 'bg-white/50 border-slate-200 text-slate-500 hover:bg-white'
                        }`}
                      >
                        <Pin size={16} className={newNoticePinned ? "fill-current" : ""} />
                        <span className="text-sm font-bold">{newNoticePinned ? "Notice is Pinned" : "Pin this Notice?"}</span>
                      </button>

                      <div className="space-y-1">
                        <div className="relative">
                          <input 
                            type="file" 
                            multiple 
                            onChange={(e) => setNewNoticeFiles([...newNoticeFiles, ...Array.from(e.target.files)])} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-full p-3 bg-blue-50/50 border border-blue-100 border-dashed rounded-xl text-center text-sm font-bold text-blue-600 hover:bg-blue-100 transition-colors">
                            + Add Files (PDF, Images, Video)
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* --- FIX 6: Use unique keys instead of index --- */}
                {newNoticeFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    {newNoticeFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold text-slate-600 max-w-[150px] truncate">{file.name}</span>
                        <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={handleCreateNotice} 
                  disabled={isCreating}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    "Publish Notice"
                  )}
                </button>

                {createError && <p className="text-red-500 text-center text-sm font-bold">{createError}</p>}
              </div>
            </GlassCard>
          </div>
        )}

        {/* --- CLEAN Notice GRID RENDER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {renderNoticesGrid()}
        </div>

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Notice?"
          message="This notice will be permanently removed from the student feed."
          isLoading={isDeleting}
        />

      </div>
    </div>
  );
}

export default HomePage;