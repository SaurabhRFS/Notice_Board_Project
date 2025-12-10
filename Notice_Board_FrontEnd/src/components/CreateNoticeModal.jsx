import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { X, Pin, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config/apiConfig';
import GlassCard from './GlassCard';
import { useToast } from '../context/ToastContext';

const CreateNoticeModal = ({ isOpen, onClose, onSuccess, branches, semesters, subjects }) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [branch, setBranch] = useState('GENERAL');
  const [targetSemesters, setTargetSemesters] = useState([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [files, setFiles] = useState([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and Content are required.");
      return;
    }

    setIsCreating(true);
    setError('');

    const token = localStorage.getItem('token');
    const authConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const noticeData = {
      title,
      content,
      subjectId: subjectId || null,
      targetBranch: branch,
      targetSemesters,
      expiresAt: expiresAt || null,
      isPinned
    };

    const formData = new FormData();
    formData.append('notice', JSON.stringify(noticeData));

    if (files.length > 0) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    try {
      await axios.post(`${API_BASE_URL}/api/notices`, formData, authConfig);
      
      addToast("Notice published successfully!", "success");
      
      // Reset
      setTitle('');
      setContent('');
      setFiles([]);
      setSubjectId('');
      setBranch('GENERAL');
      setTargetSemesters([]);
      setExpiresAt('');
      setIsPinned(false);
      
      onSuccess(); 
      onClose();   

    } catch (err) {
      console.error(err);
      addToast("Failed to create notice.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    // FIX: Changed 'items-center' to 'items-start' and added 'pt-24' to push it down below the navbar
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24">
      
      {/* Backdrop */}
      <button 
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-default w-full h-full border-none block" 
        onClick={onClose}
        aria-label="Close Modal" 
      />

      {/* Modal Card */}
      <GlassCard className="!max-w-xl w-full relative z-10 animate-fade-in-up border-blue-200/50 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">New Announcement</h3>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Notice Title</label>
            <input 
              type="text" 
              className="w-full p-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold text-slate-800 placeholder:text-slate-400" 
              placeholder="Enter title..."
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Content</label>
            <textarea 
              className="w-full p-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none h-40 font-medium text-slate-700 placeholder:text-slate-400 resize-none" 
              placeholder="What's happening?"
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
            />
          </div>

          {/* Branch & Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Branch</label>
              <select 
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="GENERAL">GENERAL (All)</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
              <select 
                value={subjectId} 
                onChange={(e) => setSubjectId(e.target.value)} 
                className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none"
              >
                <option value="">None</option>
                {subjects
                  .filter(s => branch === 'GENERAL' || s.branch === branch)
                  .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                }
              </select>
            </div>
          </div>

          {/* Semesters & Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Semesters</label>
               <select 
                 multiple 
                 className="w-full p-2 bg-white/50 rounded-xl border border-slate-200 text-xs font-medium h-32" 
                 value={targetSemesters} 
                 onChange={(e) => setTargetSemesters([...e.target.selectedOptions].map(o => o.value))}
               >
                  {semesters.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>

             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Expires On</label>
                  <input 
                    type="date" 
                    value={expiresAt} 
                    onChange={(e) => setExpiresAt(e.target.value)} 
                    className="w-full p-3 bg-white/50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700" 
                  />
                </div>

                <button 
                  onClick={() => setIsPinned(!isPinned)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${isPinned ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white/50 border-slate-200 text-slate-500'}`}
                >
                  <Pin size={16} className={isPinned ? "fill-current" : ""} />
                  <span className="text-sm font-bold">{isPinned ? "Pinned" : "Pin?"}</span>
                </button>

                {/* File Input */}
                <div className="relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="w-full p-3 bg-blue-50/50 border border-blue-100 border-dashed rounded-xl text-center text-sm font-bold text-blue-600 hover:bg-blue-100 transition-colors">
                    + Add Files
                  </div>
                </div>
             </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-600 max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button 
            onClick={handleSubmit} 
            disabled={isCreating}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isCreating ? <Loader2 size={20} className="animate-spin" /> : "Publish Notice"}
          </button>

          {error && <p className="text-red-500 text-center text-sm font-bold">{error}</p>}
        </div>
      </GlassCard>
    </div>
  );
};

CreateNoticeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  branches: PropTypes.arrayOf(PropTypes.string).isRequired,
  semesters: PropTypes.arrayOf(PropTypes.string).isRequired,
  subjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    branch: PropTypes.string
  })).isRequired,
};

export default CreateNoticeModal;