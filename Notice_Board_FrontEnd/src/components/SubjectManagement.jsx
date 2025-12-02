import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { 
  BookOpen, Plus, Pencil, Trash2, X, 
  Loader2, GitBranch, GraduationCap 
} from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';
import GlassCard from './GlassCard';

const SubjectManagement = () => {
  // --- STATE ---
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null); // If null, we are creating. If set, we are editing.
  
  // Delete States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    semester: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      const [subjRes, branchRes, semRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/data/subjects`, authConfig),
        axios.get(`${API_BASE_URL}/api/data/branches`, authConfig),
        axios.get(`${API_BASE_URL}/api/data/semesters`, authConfig)
      ]);
      
      setSubjects(subjRes.data);
      setBranches(branchRes.data);
      setSemesters(semRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ---

  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      branch: subject.branch,
      semester: subject.semester
    });
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingSubject(null);
    setFormData({ name: '', branch: '', semester: '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.branch || !formData.semester) {
      alert("Please fill all fields");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('token');
    const authConfig = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      if (editingSubject) {
        // UPDATE EXISTING
        const res = await axios.put(`${API_BASE_URL}/api/admin/subjects/${editingSubject.id}`, formData, authConfig);
        setSubjects(prev => prev.map(s => s.id === editingSubject.id ? res.data : s));
      } else {
        // CREATE NEW
        const res = await axios.post(`${API_BASE_URL}/api/admin/subjects`, formData, authConfig);
        setSubjects(prev => [...prev, res.data]);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save subject", err);
      alert("Failed to save subject. Name might be duplicate.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSubjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/subjects/${subjectToDelete}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSubjects(prev => prev.filter(s => s.id !== subjectToDelete));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete subject.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 leading-none">Subjects</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{subjects.length} Total</span>
          </div>
        </div>
        <button 
          onClick={handleAddClick}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-500/30 hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {/* --- SUBJECT LIST TABLE --- */}
      <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-1 pl-2">ID</div>
          <div className="col-span-5">Subject Name</div>
          <div className="col-span-3">Branch</div>
          <div className="col-span-2">Semester</div>
          <div className="col-span-1 text-right pr-2">Edit</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>
          ) : subjects.length === 0 ? (
            <div className="p-10 text-center text-slate-500 font-medium">No subjects yet. Create one!</div>
          ) : (
            subjects.map(subject => (
              <div key={subject.id} className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-white/30 hover:bg-white/40 transition-colors items-center group">
                
                {/* ID */}
                <div className="col-span-2 md:col-span-1 pl-2 font-mono text-xs text-slate-400 font-bold">
                  #{subject.id}
                </div>

                {/* Name */}
                <div className="col-span-10 md:col-span-5 font-bold text-slate-700 text-sm truncate">
                  {subject.name}
                </div>

                {/* Branch Badge */}
                <div className="col-span-6 md:col-span-3 flex items-center">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate">
                    <GitBranch size={10} /> {subject.branch}
                  </span>
                </div>

                {/* Semester Badge */}
                <div className="col-span-4 md:col-span-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate w-fit">
                    <GraduationCap size={10} /> {subject.semester}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 md:col-span-1 flex justify-end gap-2 pr-2">
                  <button onClick={() => handleEditClick(subject)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteClick(subject.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          
          <GlassCard className="!max-w-lg w-full relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject Name</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none font-bold text-slate-700"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Branch</label>
                  <select 
                    className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                    value={formData.branch}
                    onChange={e => setFormData({...formData, branch: e.target.value})}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Semester</label>
                  <select 
                    className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                    value={formData.semester}
                    onChange={e => setFormData({...formData, semester: e.target.value})}
                  >
                    <option value="">Select Sem</option>
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={isSaving}
                className="w-full py-3 mt-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : (editingSubject ? "Update Subject" : "Create Subject")}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Subject?"
        message="This will remove the subject from the system. Notices tagged with this subject will remain but lose the tag."
        isLoading={isDeleting}
      />

    </div>
  );
};

export default SubjectManagement;