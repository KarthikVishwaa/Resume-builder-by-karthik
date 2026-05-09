import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutTemplateIcon, 
  CheckIcon, 
  SparklesIcon, 
  ZapIcon,
  ShieldCheckIcon,
  FilterIcon,
  LoaderCircleIcon,
  SearchIcon,
  CrownIcon
} from "lucide-react";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Templates = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [loadingTemplate, setLoadingTemplate] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ Professional Template Metadata
  const templates = [
    {
      id: "classic",
      name: "The Classic",
      description: "Time-tested structure favored by Fortune 500 recruiters.",
      tags: ["Corporate", "Finance", "Law"],
      ats: "High",
      type: "ATS-Friendly",
      layout: "single-col"
    },
    {
      id: "modern",
      name: "Tech Modern",
      description: "Clean typography with a sidebar for skills and projects.",
      tags: ["Software", "Startup", "Product"],
      ats: "Medium",
      type: "Modern",
      layout: "sidebar-left"
    },
    {
      id: "minimal",
      name: "Swiss Minimal",
      description: "Ultra-clean, whitespace-heavy design focused on content.",
      tags: ["Design", "Architecture", "Marketing"],
      ats: "Very High",
      type: "Minimalist",
      layout: "minimal"
    },
    {
      id: "executive",
      name: "Executive Suite",
      description: "Sophisticated layout for leadership and senior roles.",
      tags: ["Management", "C-Level", "Director"],
      ats: "High",
      type: "Professional",
      layout: "header-heavy",
      featured: true
    },
    {
        id: "creative",
        name: "Creative Portfolio",
        description: "Bold header and accent colors for creative professionals.",
        tags: ["Creative", "Media", "Arts"],
        ats: "Medium",
        type: "Creative",
        layout: "creative"
      },
  ];

  const categories = ["All", "ATS-Friendly", "Modern", "Professional", "Creative"];

  // Filter Logic
  const filteredTemplates = activeFilter === "All" 
    ? templates 
    : templates.filter(t => t.type === activeFilter || t.ats === activeFilter);

  // ✅ Apply Template Correctly
  const useTemplate = async (templateId) => {
    try {
      setLoadingTemplate(templateId);
      
      // 1. Create Resume
      const { data } = await api.post(
        "/api/resumes/create",
        { title: `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume` },
        { headers: { Authorization: token } }
      );

      // 2. Apply Template
      await api.put(
        "/api/resumes/update",
        {
          resumeId: data.resume._id,
          resumeData: { template: templateId },
        },
        { headers: { Authorization: token } }
      );

      toast.success("Template applied!", { id: "template" });

      // 3. Redirect Builder
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Template selection failed", { id: "template" });
    } finally {
        setLoadingTemplate(null);
    }
  };

  // ✅ CSS-Only Resume Skeletons (For Previews)
  const renderSkeleton = (layout) => {
    const baseClass = "w-full h-full bg-white shadow-sm p-4 flex flex-col gap-2 text-[4px] overflow-hidden select-none opacity-80 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 group-hover:shadow-md origin-top";
    
    // Abstract Text Lines
    const Lines = ({ count = 3, width = "100%" }) => (
        <div className="flex flex-col gap-1 w-full">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-1 bg-gray-200 rounded-full" style={{ width: i === count -1 ? "60%" : width }}></div>
            ))}
        </div>
    );

    switch(layout) {
        case 'sidebar-left': // Modern
            return (
                <div className={`${baseClass} flex-row`}>
                    <div className="w-1/3 bg-gray-100 h-full rounded-l-sm p-2 flex flex-col gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 mb-2"></div>
                        <Lines count={4} />
                        <div className="mt-4"><Lines count={3} /></div>
                    </div>
                    <div className="w-2/3 p-2 flex flex-col gap-3">
                        <div className="h-3 w-3/4 bg-gray-800 rounded-sm mb-2"></div>
                        <Lines count={5} />
                        <Lines count={5} />
                    </div>
                </div>
            );
        case 'minimal': // Minimal
            return (
                <div className={`${baseClass} items-start`}>
                     <div className="h-2 w-1/2 bg-gray-800 rounded-sm mb-4"></div>
                     <div className="w-full grid grid-cols-2 gap-4 mb-2">
                        <Lines count={2} />
                        <Lines count={2} />
                     </div>
                     <div className="w-full h-px bg-gray-200 my-1"></div>
                     <Lines count={6} />
                     <div className="mt-2"></div>
                     <Lines count={6} />
                </div>
            );
        case 'header-heavy': // Executive
            return (
                <div className={baseClass}>
                    <div className="w-full h-12 bg-gray-800 rounded-sm mb-2 flex items-center px-3">
                        <div className="w-6 h-6 rounded-full bg-white/20"></div>
                    </div>
                    <div className="flex gap-4 p-1">
                        <div className="w-2/3 flex flex-col gap-2">
                             <div className="h-2 w-1/3 bg-gray-400 rounded-sm"></div>
                             <Lines count={4} />
                             <div className="h-2 w-1/3 bg-gray-400 rounded-sm mt-1"></div>
                             <Lines count={4} />
                        </div>
                        <div className="w-1/3 flex flex-col gap-2">
                            <Lines count={10} />
                        </div>
                    </div>
                </div>
            );
        case 'creative': // Creative
            return (
                <div className={baseClass}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#ffc700]"></div>
                        <div className="flex flex-col gap-1 w-2/3">
                            <div className="h-2 w-full bg-gray-900 rounded-full"></div>
                            <div className="h-1 w-1/2 bg-gray-400 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 h-full">
                        <div className="bg-gray-50 rounded p-1"><Lines count={6}/></div>
                        <div className="bg-gray-50 rounded p-1"><Lines count={6}/></div>
                    </div>
                </div>
            );
        default: // Classic
            return (
                <div className={`${baseClass} items-center pt-6`}>
                    <div className="h-3 w-1/2 bg-gray-800 rounded-sm mb-1"></div>
                    <div className="h-1 w-1/3 bg-gray-400 rounded-sm mb-4"></div>
                    <div className="w-full px-2 flex flex-col gap-3">
                        <Lines count={4} />
                        <Lines count={4} />
                        <Lines count={4} />
                    </div>
                </div>
            );
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] animate-fade-in">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc700]/10 text-[#b78100] text-xs font-bold uppercase tracking-wide mb-4 animate-bounce-subtle">
                <SparklesIcon className="w-3 h-3" />
                Premium Collection
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                Choose your foundation.
            </h1>
            <p className="text-lg text-gray-500">
                Professionally designed templates optimized for ATS algorithms and recruiter readability.
            </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                    ${activeFilter === cat 
                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105" 
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl, index) => (
                <div 
                    key={tpl.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group relative bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-gray-300 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-hidden flex flex-col hover:-translate-y-2 animate-stagger-fade"
                >
                    {/* Featured Badge */}
                    {tpl.featured && (
                        <div className="absolute top-4 right-4 z-20 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse-slow">
                            <CrownIcon className="w-3 h-3 text-[#ffc700]" />
                            POPULAR
                        </div>
                    )}

                    {/* Preview Area (Top Half) */}
                    <div className="relative h-72 bg-gray-50/50 p-8 flex items-center justify-center overflow-hidden border-b border-gray-100 group-hover:bg-gray-100/50 transition-colors duration-500">
                        {/* The CSS Resume Skeleton */}
                        <div className="w-48 h-64 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-4 group-hover:scale-105 group-hover:rotate-1 bg-white">
                            {renderSkeleton(tpl.layout)}
                        </div>
                        
                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                                onClick={() => useTemplate(tpl.id)}
                                disabled={loadingTemplate === tpl.id}
                                className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out px-8 py-3.5 bg-gray-900 text-white rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-black hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {loadingTemplate === tpl.id ? (
                                    <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ZapIcon className="w-4 h-4 text-[#ffc700]" fill="currentColor" />
                                        Use Template
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Info Area (Bottom Half) */}
                    <div className="p-6 flex flex-col flex-1 bg-white relative z-10">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{tpl.name}</h3>
                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300
                                ${tpl.ats === 'Very High' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : tpl.ats === 'High'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                ATS: {tpl.ats}
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                            {tpl.description}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-2">
                            {tpl.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FilterIcon className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No templates found</h3>
                <p className="text-gray-500">Try changing the category filter.</p>
                <button 
                    onClick={() => setActiveFilter("All")}
                    className="mt-4 text-[#ffc700] hover:underline text-sm font-semibold transition-colors"
                >
                    Clear filters
                </button>
            </div>
        )}

      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerFade {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-stagger-fade { animation: staggerFade 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulseSlow 3s infinite ease-in-out; }
        .animate-bounce-subtle { animation: bounceSubtle 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Templates;