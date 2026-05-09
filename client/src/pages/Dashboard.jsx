import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  SparklesIcon,
  ClockIcon,
  FileTextIcon,
  LayoutGridIcon,
  SearchIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  AlertTriangleIcon, // Import Alert Icon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

// --- SUB-COMPONENT: Delete Confirmation Modal ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with Fade In */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content with Spring Animation */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 transform transition-all animate-spring-modal text-center border border-gray-100">
        
        {/* Animated Icon Container */}
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
           <div className="p-3 bg-red-100 rounded-full">
              <TrashIcon className="size-6 text-red-600" />
           </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Delete Resume?
        </h3>
        
        <p className="text-gray-500 text-sm mb-1">
          Are you sure you want to delete <span className="font-semibold text-gray-700">"{title}"</span>?
        </p>
        <p className="text-gray-400 text-xs mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button 
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors active:scale-95 text-sm"
          >
              Cancel
          </button>
          <button 
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95 text-sm flex items-center justify-center gap-2"
          >
              <TrashIcon className="size-4" />
              Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // State for Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const navigate = useNavigate();

  // Load Resumes
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Create Resume
  const createResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload Resume
  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }

    setIsLoading(false);
  };

  // Edit Resume Title
  const editTitle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: token } }
      );

      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      );

      toast.success(data.message);
      setTitle("");
      setEditResumeId("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Delete Confirmation
  const confirmDelete = (resume) => {
      setResumeToDelete(resume);
      setDeleteModalOpen(true);
  };

  // Actual Delete Logic
  const executeDelete = async () => {
    if (!resumeToDelete) return;

    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeToDelete._id}`, {
        headers: { Authorization: token },
      });

      setAllResumes((prev) => prev.filter((r) => r._id !== resumeToDelete._id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
        setDeleteModalOpen(false);
        setResumeToDelete(null);
    }
  };

  // Filter resumes
  const filteredResumes = allResumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] animate-fade-in">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              Welcome back, <span className="font-semibold text-gray-900">{user?.name?.split(" ")[0]}</span>.
            </p>
          </div>
          
          {/* Quick Stats Pill */}
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">
                    {allResumes.length} {allResumes.length === 1 ? 'Resume' : 'Resumes'}
                </span>
             </div>
             <div className="h-4 w-px bg-gray-200" />
             <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-[#ffc700]" />
                <span className="text-sm font-medium text-gray-600">Pro Plan</span>
             </div>
          </div>
        </div>

        {/* Action Cards (Create / Upload) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Create New */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 text-left transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <FilePenLineIcon className="w-32 h-32 -rotate-12 text-gray-900 transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 ease-out">
                <PlusIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Resume</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Start from scratch using our AI-powered builder. tailored to your industry.
              </p>
              <div className="inline-flex items-center text-sm font-semibold text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                Start Building <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>

          {/* Upload */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-white border border-gray-200 p-8 text-left transition-all duration-300 hover:shadow-xl hover:border-[#ffc700]/50 hover:-translate-y-1 active:scale-[0.98]"
          >
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <UploadCloudIcon className="w-32 h-32 -rotate-12 text-[#ffc700] transition-transform duration-500 group-hover:scale-110" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#ffc700] text-black mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 ease-out">
                <UploadCloudIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import Existing</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Upload your current PDF resume and let our AI reformat and enhance it instantly.
              </p>
              <div className="inline-flex items-center text-sm font-semibold text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                Upload PDF <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>
        </div>

        {/* Toolbar (Search & Toggle) */}
        <div className="sticky top-[80px] z-30 bg-[#F9FAFB]/90 backdrop-blur-md py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#ffc700] transition-colors duration-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc700]/50 focus:border-[#ffc700] transition-all duration-200 sm:text-sm shadow-sm hover:shadow-md"
              placeholder="Search your resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutGridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <FileTextIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 animate-pop-in">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                <FileTextIcon className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No resumes found</h3>
             <p className="text-gray-500 mt-1">
                {searchQuery ? "Try adjusting your search terms." : "Create your first resume to get started."}
             </p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
            {filteredResumes.map((resume, index) => (
              <div
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`group relative bg-white border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden animate-stagger-fade
                    ${viewMode === 'grid' ? 'rounded-2xl p-6 flex flex-col h-[280px]' : 'rounded-xl p-4 flex items-center gap-6'}`}
              >
                 {/* Visual Decorator for Grid */}
                 {viewMode === 'grid' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110" />
                 )}

                 <div className="relative z-10 flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`rounded-lg flex items-center justify-center transition-colors duration-300 ${viewMode === 'grid' ? 'w-12 h-12 bg-gray-50 group-hover:bg-gray-100' : 'w-10 h-10 bg-gray-50'}`}>
                            <FileTextIcon className="w-6 h-6 text-gray-700 transition-colors duration-300 group-hover:text-black" />
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditResumeId(resume._id);
                                    setTitle(resume.title);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            
                            {/* 🔥 Delete Button - Triggers Modal */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(resume); // <-- Using new handler
                                }}
                                className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h4 className={`font-bold text-gray-900 mb-2 transition-colors duration-200 group-hover:text-[#ffc700] ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-base'}`}>
                        {resume.title}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-auto">
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {new Date(resume.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        {viewMode === 'grid' && (
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2Icon className="w-3.5 h-3.5 text-green-500" />
                                Ready
                            </div>
                        )}
                    </div>
                 </div>
                 
                 {/* Open CTA */}
                 {viewMode === 'grid' && (
                     <div className="relative z-10 mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ATS Friendly</span>
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                            Open <ChevronRightIcon className="w-4 h-4" />
                        </div>
                     </div>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Modal with Spring Animation */}
      {(showCreateResume || showUploadResume || editResumeId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => {
                setShowCreateResume(false);
                setShowUploadResume(false);
                setEditResumeId("");
            }}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-spring-modal">
             <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    {showCreateResume ? "New Resume" : showUploadResume ? "Upload Resume" : "Rename Resume"}
                </h3>
                <button 
                    onClick={() => {
                        setShowCreateResume(false);
                        setShowUploadResume(false);
                        setEditResumeId("");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-transform hover:rotate-90 duration-200"
                >
                    <XIcon className="w-5 h-5" />
                </button>
             </div>

             <form onSubmit={showCreateResume ? createResume : showUploadResume ? uploadResume : editTitle} className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume Title</label>
                        <input 
                            autoFocus
                            type="text" 
                            required
                            placeholder="e.g. Frontend Developer 2024"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ffc700] focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                        />
                    </div>

                    {showUploadResume && (
                        <div className="animate-slide-up">
                             <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                             <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:bg-gray-50 hover:border-[#ffc700] transition-all duration-300 relative group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    required 
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {resume ? (
                                    <div className="flex items-center gap-2 text-[#ffc700] font-medium animate-pop-in">
                                        <FileTextIcon className="w-5 h-5" />
                                        {resume.name}
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Click to upload PDF</p>
                                    </>
                                )}
                             </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <button 
                        type="button"
                        onClick={() => {
                            setShowCreateResume(false);
                            setShowUploadResume(false);
                            setEditResumeId("");
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-[#ffc700] hover:bg-[#ffae00] text-black font-bold rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <LoaderCircleIcon className="w-4 h-4 animate-spin" />}
                        {showCreateResume ? "Create" : showUploadResume ? "Upload" : "Save"}
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={executeDelete} 
        title={resumeToDelete?.title}
      />

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes springModal {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes staggerFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.4s ease-out forwards; }
        .animate-spring-modal { animation: springModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-stagger-fade { animation: staggerFade 0.5s ease-out forwards; opacity: 0; }
        .animate-bounce-subtle { animation: bounceSubtle 2s infinite ease-in-out alternate; }
      `}</style>
    </div>
  );
};

export default Dashboard;