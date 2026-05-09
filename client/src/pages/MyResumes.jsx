import React, { useEffect, useState } from "react";
import { 
  FileTextIcon, 
  ClockIcon, 
  SearchIcon, 
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  FilterIcon,
  ChevronDownIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { useSelector } from "react-redux";

const MyResumes = () => {
  const { token } = useSelector((state) => state.auth);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  const loadResumes = async () => {
    try {
        const { data } = await api.get("/api/users/resumes", {
            headers: { Authorization: token },
        });
        setResumes(data.resumes);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const filterByDate = (resume) => {
    if (dateFilter === "All Time") return true;

    const date = new Date(resume.updatedAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const resumeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    switch (dateFilter) {
        case "Today":
            return resumeDate.getTime() === today.getTime();
        case "Yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return resumeDate.getTime() === yesterday.getTime();
        case "Last 7 Days":
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            return resumeDate >= last7Days;
        case "Last Month":
            const lastMonth = new Date(today);
            lastMonth.setMonth(today.getMonth() - 1);
            return resumeDate >= lastMonth;
        default:
            return true;
    }
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) && filterByDate(r)
  );

  const filterOptions = ["All Time", "Today", "Yesterday", "Last 7 Days", "Last Month"];

  const ResumeSkeleton = () => (
    <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
            <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-6 bg-gray-100 rounded-md w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded-md w-1/2 mt-auto"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] animate-fade-in" onClick={() => setIsFilterOpen(false)}>
      
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header & Actions */}
        <div className="relative z-30 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-slide-up">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <FileTextIcon className="size-8 text-[#ffc700]" />
                    My Resumes
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Manage and organize your professional documents.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-64 group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-gray-900 transition-colors"/>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ffc700] focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
                        className="flex items-center justify-between w-full sm:w-44 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm active:scale-95 text-sm font-medium text-gray-700"
                    >
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-500" />
                            {dateFilter}
                        </div>
                        <ChevronDownIcon className={`size-4 text-gray-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => { setDateFilter(option); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                                            ${dateFilter === option ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                        `}
                                    >
                                        {option}
                                        {dateFilter === option && <div className="w-1.5 h-1.5 rounded-full bg-[#ffc700]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Grid Content */}
        <div className="relative z-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Loading State */}
            {isLoading && [...Array(4)].map((_, i) => <ResumeSkeleton key={i} />)}

            {/* Resume Cards */}
            {!isLoading && filteredResumes.map((resume, index) => (
                <div
                    key={resume._id}
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="group relative bg-white rounded-3xl border border-gray-200 p-6 cursor-pointer shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 animate-stagger-fade flex flex-col h-[260px] overflow-hidden"
                >
                    {/* ✅ Watermark Background Icon */}
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-all duration-500 rotate-12 group-hover:rotate-6 group-hover:scale-110 pointer-events-none">
                        <FileTextIcon className="size-48 text-gray-900" />
                    </div>

                    {/* Gradient Decorator (Top Right) */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110 opacity-60" />

                    {/* Card Content */}
                    <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-[#ffc700]/30 group-hover:shadow-md transition-all duration-300">
                            <FileTextIcon className="size-6 text-gray-400 group-hover:text-[#ffc700] transition-colors duration-300" />
                        </div>
                    </div>

                    <div className="relative z-10 flex-1">
                        <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#b78100] transition-colors">
                            {resume.title}
                        </h2>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-100 mt-auto bg-white/50 backdrop-blur-[2px]">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 group-hover:text-gray-500 transition-colors">
                            <ClockIcon className="size-3.5" />
                            {new Date(resume.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                            Open <ArrowRightIcon className="size-3.5" />
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {!isLoading && filteredResumes.length === 0 && (
                <div 
                    className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-3xl hover:border-gray-400 hover:bg-gray-50 transition-all group animate-fade-in"
                >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FilterIcon className="size-8 text-gray-400 group-hover:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No resumes found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-1">
                        Try adjusting your search or date filters.
                    </p>
                    <button 
                        onClick={() => { setSearchQuery(""); setDateFilter("All Time"); }}
                        className="mt-4 text-[#ffc700] hover:underline text-sm font-semibold"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerFade {
          from { opacity: 0; transform: translateY(15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-stagger-fade { animation: staggerFade 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default MyResumes;