// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout & UI
import AnimatedBackground from '../components/layout/AnimatedBackground';
import Navbar from '../components/layout/Navbar';
import EmptyState from '../components/feedback/EmptyState';
import NoticeCardSkeleton from '../components/feedback/NoticeCardSkeleton';
import DeleteConfirmModal from '../components/feedback/DeleteConfirmModal';

// Feature Components
import FilterBar from '../features/notices/components/FilterBar';
import NoticeCard from '../features/notices/components/NoticeCard';
import CreateNoticeModal from '../features/notices/components/CreateNoticeModal';

// Hooks
import { useNotices } from '../features/notices/hooks/useNotices';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';

// ---------------------------------------
// Create a stable array of IDs for the skeletons
const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => i);
// ---------------------------------------

function HomePage() {
  const navigate = useNavigate();
  
  // Auth Hook
  const { username, userRole } = useCurrentUser();

  // Notice Hook
  const { 
    notices, isLoading, filterOptions,
    filters, setFilters, refreshNotices, handleDelete 
  } = useNotices();

  // Local UI State
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete Handler
  const confirmDelete = async () => {
    setIsDeleting(true);
    await handleDelete(deleteModal.id);
    setIsDeleting(false);
    setDeleteModal({ isOpen: false, id: null });
  };

  // ---------------------------------------
  // 4. Render Logic
  const renderContent = () => {
    // FIX: Map over the stable array instead of generating on the fly
    if (isLoading) {
      return SKELETON_IDS.map((id) => (
        <NoticeCardSkeleton key={`skeleton-${id}`} />
      ));
    }

    if (notices.length === 0) {
      return (
        <EmptyState 
          message={filters.subjectId || filters.branch ? "No Matches Found" : "All Caught Up!"}
          subMessage="Check your filters or come back later."
        />
      );
    }

    return notices.map((notice, index) => (
      <div 
        key={notice.id} 
        className="animate-fade-in-up" 
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <NoticeCard 
          notice={notice}
          userRole={userRole}
          onDelete={(id) => setDeleteModal({ isOpen: true, id })}
        />
      </div>
    ));
  };
  // ---------------------------------------

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      <AnimatedBackground />
      
      <Navbar 
        username={username}
        userRole={userRole}
        onLogout={() => { localStorage.clear(); navigate('/login'); }}
        onCreateClick={() => setIsFormVisible(true)}
        onAdminClick={() => navigate('/admin')}
      />

      <div className="relative z-10 pt-24 md:pt-28 pb-12 px-4 max-w-7xl mx-auto">
        <FilterBar 
          branches={filterOptions.branches}
          semesters={filterOptions.semesters}
          subjects={filterOptions.subjects}
          selectedBranch={filters.branch}
          setSelectedBranch={(val) => setFilters(prev => ({...prev, branch: val}))}
          selectedSemester={filters.semester}
          setSelectedSemester={(val) => setFilters(prev => ({...prev, semester: val}))}
          selectedSubject={filters.subjectId}
          setSelectedSubject={(val) => setFilters(prev => ({...prev, subjectId: val}))}
          onApply={refreshNotices}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {renderContent()}
        </div>
      </div>

      <CreateNoticeModal 
        isOpen={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSuccess={refreshNotices}
        branches={filterOptions.branches}
        semesters={filterOptions.semesters}
        subjects={filterOptions.subjects}
      />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default HomePage;