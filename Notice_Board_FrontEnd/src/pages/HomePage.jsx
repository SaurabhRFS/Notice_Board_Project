import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import NoticeCard from '../components/NoticeCard';
import NoticeCardSkeleton from '../components/NoticeCardSkeleton';
import EmptyState from '../components/EmptyState';
import CreateNoticeModal from '../components/CreateNoticeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import { useToast } from '../context/ToastContext'; // 1. IMPORT HOOK

function HomePage() {
  const navigate = useNavigate();
  const { addToast } = useToast(); // 2. INITIALIZE HOOK
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [username, setUsername] = useState('Student');
  
  const [notices, setNotices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isNoticesLoading, setIsNoticesLoading] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(() => localStorage.getItem('filter_branch') || '');
  const [selectedSemester, setSelectedSemester] = useState(() => localStorage.getItem('filter_semester') || '');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    localStorage.setItem('filter_branch', selectedBranch);
    localStorage.setItem('filter_semester', selectedSemester);
  }, [selectedBranch, selectedSemester]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payloadPart = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadPart));
      const email = decodedPayload.sub;
      const namePart = email.split('@')[0];
      setUsername(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    } catch (e) {
      console.error("Token decode failed", e);
    }

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

    loadNotices(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const filteredSubjects = subjects.filter(subject => {
    const branchMatch = !selectedBranch || subject.branch === selectedBranch;
    const semMatch = !selectedSemester || subject.semester === selectedSemester;
    return branchMatch && semMatch;
  });

  useEffect(() => {
    if (selectedSubject && !filteredSubjects.some(s => s.id === Number.parseInt(selectedSubject, 10))) {
      setSelectedSubject('');
    }
  }, [selectedBranch, selectedSemester, filteredSubjects, selectedSubject]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const loadNotices = () => {
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
      
      // 3. SUCCESS TOAST (Replaces Alert)
      addToast("Notice deleted successfully", "success");
      
      loadNotices(); 
    } catch (err) {
      console.error('Error deleting notice:', err);
      // 4. ERROR TOAST
      addToast("Failed to delete notice", "error");
    } finally {
      setIsDeleting(false); 
    }
  };

  const renderNoticesGrid = () => {
    // 1. Loading State
    // 1. Loading State
    if (isNoticesLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <NoticeCardSkeleton key={`skeleton-${index}`} />
      ));
    }

    if (notices.length === 0) {
      return (
        <EmptyState 
          message={selectedSubject || selectedBranch ? "No Matches Found" : "All Caught Up!"}
          subMessage={selectedSubject || selectedBranch ? "Try adjusting your filters to see more results." : "Check back later for new announcements."}
        />
      );
    }

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
        onCreateClick={() => setIsFormVisible(true)}
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
          onApply={loadNotices}
          isLoading={isNoticesLoading}
        />

        <CreateNoticeModal 
          isOpen={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSuccess={loadNotices}
          branches={branches}
          semesters={semesters}
          subjects={subjects}
        />

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