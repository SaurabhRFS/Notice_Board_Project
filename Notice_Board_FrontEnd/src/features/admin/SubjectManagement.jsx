import React, { useState } from 'react';
import { 
  BookOpen, Plus, Pencil, Trash2, X, 
  Loader2, GitBranch, GraduationCap 
} from 'lucide-react';

import DeleteConfirmModal from '../../components/feedback/DeleteConfirmModal';
import GlassCard from '../../components/ui/GlassCard';
import { useSubjects } from './hooks/useSubjects';
import TableSkeleton from '../../components/feedback/TableSkeleton';

const SubjectManagement = () => {
  // 1. Use Hook
  const { subjects, branches, semesters, isLoading, saveSubject, deleteSubject } = useSubjects();
  
  // 2. UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', branch: '', semester: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Handlers ---
  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, branch: subject.branch, semester: subject.semester });
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
    const success = await saveSubject(formData, !!editingSubject, editingSubject?.id);
    setIsSaving(false);
    if (success) setIsFormOpen(false);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    const success = await deleteSubject(subjectToDelete);
    setIsDeleting(false);
    if (success) setIsDeleteModalOpen(false);
  };

  // --- Helper: Clean Logic for Button Text ---
  const getButtonLabel = () => {
    if (isSaving) return <Loader2 className="animate-spin" />;
    if (editingSubject) return "Update Subject";
    return "Create Subject";
  };

  // --- Helper: Clean Logic for Table Body ---
  const renderTableBody = () => {
    if (isLoading) {
    return <TableSkeleton />; // <--- REPLACED SPINNER
    }

    if (subjects.length === 0) {
      return (
        <div className="p-10 text-center text-slate-500 font-medium">
          No subjects yet. Create one!
        </div>
      );
    }

    return subjects.map(subject => (
      <div key={subject.id} className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-white/30 hover:bg-white/40 transition-colors items-center group">
        <div className="col-span-2 md:col-span-1 pl-2 font-mono text-xs text-slate-400 font-bold">#{subject.id}</div>
        <div className="col-span-10 md:col-span-5 font-bold text-slate-700 text-sm truncate">{subject.name}</div>
        <div className="col-span-6 md:col-span-3 flex items-center">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate">
            <GitBranch size={10} /> {subject.branch}
          </span>
        </div>
        <div className="col-span-4 md:col-span-2">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-bold uppercase tracking-wider truncate w-fit">
            <GraduationCap size={10} /> {subject.semester}
          </span>
        </div>
        <div className="col-span-2 md:col-span-1 flex justify-end gap-2 pr-2">
          <button onClick={() => handleEditClick(subject)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={16} /></button>
          <button onClick={() => { setSubjectToDelete(subject.id); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={24} /></div>
          <div>
            <h3 className="text-lg font-black text-slate-800 leading-none">Subjects</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{subjects.length} Total</span>
          </div>
        </div>
        <button onClick={handleAddClick} className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2">
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {/* List */}
      <div className="bg-white/40 border border-white/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/50 bg-white/20 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-1 pl-2">ID</div>
          <div className="col-span-5">Subject Name</div>
          <div className="col-span-3">Branch</div>
          <div className="col-span-2">Semester</div>
          <div className="col-span-1 text-right pr-2">Edit</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {renderTableBody()}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* FIX: Replaced div with button for accessibility */}
          <button 
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm w-full h-full border-none cursor-default" 
            onClick={() => setIsFormOpen(false)}
            aria-label="Close Modal"
          />

          <GlassCard className="!max-w-lg w-full relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">{editingSubject ? "Edit Subject" : "Create New Subject"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                {/* FIX: Associated label with input using htmlFor and id */}
                <label htmlFor="subjectName" className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Subject Name
                </label>
                <input 
                  id="subjectName"
                  autoFocus 
                  type="text" 
                  placeholder="e.g. Data Structures" 
                  className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {/* FIX: Associated label with select */}
                  <label htmlFor="subjectBranch" className="text-xs font-bold text-slate-500 uppercase ml-1">
                    Branch
                  </label>
                  <select 
                    id="subjectBranch"
                    className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600" 
                    value={formData.branch} 
                    onChange={e => setFormData({...formData, branch: e.target.value})}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  {/* FIX: Associated label with select */}
                  <label htmlFor="subjectSemester" className="text-xs font-bold text-slate-500 uppercase ml-1">
                    Semester
                  </label>
                  <select 
                    id="subjectSemester"
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
                className="w-full py-3 mt-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 flex items-center justify-center gap-2"
              >
                {getButtonLabel()}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} title="Delete Subject?" message="This will remove the subject from the system." isLoading={isDeleting} />
    </div>
  );
};

export default SubjectManagement;