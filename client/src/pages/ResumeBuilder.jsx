import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  DownloadIcon, 
  EyeIcon, 
  EyeOffIcon, 
  FileText, 
  FolderIcon, 
  GraduationCap, 
  Share2Icon, 
  Sparkles, 
  User,
  Maximize2, 
  Minimize2,
  Save
} from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import ColorPicker from '../components/ColorPicker' // TemplateSelector import removed
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic", // Default template is still needed for the preview to render
    accent_color: "#3B82F6",
    public: false,
  })

  const loadExistingResume = async () => {
   try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: { Authorization: token }})
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title;
    }
   } catch (error) {
    console.log(error.message)
   }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(()=>{
    loadExistingResume()
  },[])

  const changeResumeVisibility = async () => {
    try {
       const formData = new FormData()
       formData.append("resumeId", resumeId)
       formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

       const {data} = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

       setResumeData({...resumeData, public: !resumeData.public})
       toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume", })
    }else{
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Link copied to clipboard!");
    }
  }

  const downloadResume = ()=>{
    window.print();
  }

  const saveResume = async () => {
    setIsSaving(true);
    try {
        let updatedResumeData = structuredClone(resumeData)

        if(typeof resumeData.personal_info.image === 'object'){
        delete updatedResumeData.personal_info.image
        }

        const formData = new FormData();
        formData.append("resumeId", resumeId)
        formData.append('resumeData', JSON.stringify(updatedResumeData))
        removeBackground && formData.append("removeBackground", "yes");
        typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

        const { data } = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

        setResumeData(data.resume)
        toast.success("Resume saved successfully")
    } catch (error) {
        console.error("Error saving resume:", error)
        toast.error("Failed to save changes")
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className={`transition-all duration-500 ease-in-out ${isFullScreen ? "fixed inset-0 z-[100] bg-gray-50 overflow-y-auto" : "min-h-screen bg-[#F9FAFB]"}`}>

      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-[#F9FAFB]/80 backdrop-blur-md">
        <Link to={'/app'} className='group inline-flex gap-2 items-center text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm'>
          <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 transition-colors shadow-sm">
             <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5"/> 
          </div>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
            <button 
                onClick={saveResume}
                disabled={isSaving}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-all active:scale-95 disabled:opacity-50'
            >
                {isSaving ? <Sparkles className="size-4 animate-spin"/> : <Save className="size-4"/>}
                <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
            </button>

            <button 
            onClick={() => setIsFullScreen(!isFullScreen)} 
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95'
            >
            {isFullScreen ? (
                <>
                <Minimize2 className="size-4" /> <span className="hidden sm:inline">Exit Full Screen</span>
                </>
            ) : (
                <>
                <Maximize2 className="size-4" /> <span className="hidden sm:inline">Full Screen</span>
                </>
            )}
            </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 pb-12'>
        <div className='grid lg:grid-cols-12 gap-8 items-start'>
          
          {/* --- LEFT PANEL (FORM) --- */}
          <div className='lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden relative transition-all duration-300 hover:shadow-md'>
              
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                 <div 
                    className="h-full bg-gradient-to-r from-[#ffc700] to-[#ffae00] transition-all duration-500 ease-out" 
                    style={{width: `${(activeSectionIndex + 1) * 100 / sections.length}%`}}
                 />
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className='flex items-center gap-3'>
                  {/* ✅ TemplateSelector REMOVED from here */}
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev => ({...prev, accent_color: color}))}/>
                </div>

                <div className='flex items-center gap-1'>
                  <button 
                    onClick={()=> setActiveSectionIndex((prev)=> Math.max(prev - 1, 0))} 
                    disabled={activeSectionIndex === 0}
                    className='p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent'
                  >
                    <ChevronLeft className="size-5"/>
                  </button>
                  <button 
                    onClick={()=> setActiveSectionIndex((prev)=> Math.min(prev + 1, sections.length - 1))} 
                    disabled={activeSectionIndex === sections.length - 1}
                    className='p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent'
                  >
                      <ChevronRight className="size-5"/>
                    </button>
                </div>
              </div>

              {/* Form Content Area with Slide Animation */}
              <div className='p-6 min-h-[500px]'>
                  <div key={activeSectionIndex} className="animate-slide-in-right">
                      {activeSection.id === 'personal' && (
                        <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                      )}
                      {activeSection.id === 'summary' && (
                        <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                      )}
                      {activeSection.id === 'experience' && (
                        <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))}/>
                      )}
                      {activeSection.id === 'education' && (
                        <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))}/>
                      )}
                      {activeSection.id === 'projects' && (
                        <ProjectForm data={resumeData.project} onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))}/>
                      )}
                      {activeSection.id === 'skills' && (
                        <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))}/>
                      )}
                  </div>
              </div>
              
              {/* Bottom Action Bar */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Step {activeSectionIndex + 1} of {sections.length}
                 </span>
                 {activeSectionIndex < sections.length - 1 ? (
                     <button 
                        onClick={()=> setActiveSectionIndex(prev => prev + 1)}
                        className="text-sm font-semibold text-gray-900 flex items-center gap-1 hover:gap-2 transition-all"
                     >
                        Next Section <ChevronRight className="size-4"/>
                     </button>
                 ) : (
                    <button 
                        onClick={saveResume}
                        className="text-sm font-bold text-[#ffc700] flex items-center gap-1 hover:gap-2 transition-all"
                     >
                        Finish & Save <Sparkles className="size-4"/>
                     </button>
                 )}
              </div>
            </div>
          </div>

          {/* --- RIGHT PANEL (PREVIEW) --- */}
          <div className='lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2 sticky top-24'>
              
              {/* Toolbar */}
              <div className='flex flex-wrap items-center justify-between gap-3 p-2 bg-white border border-gray-200 rounded-2xl shadow-sm animate-fade-in-up'>
                
                <div className="text-sm font-semibold text-gray-500 px-3 hidden sm:block">
                    Live Preview
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {resumeData.public && (
                    <button onClick={handleShare} className='flex items-center justify-center p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95' title="Share Link">
                        <Share2Icon className='size-4'/>
                    </button>
                    )}
                    <button onClick={changeResumeVisibility} className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 border ${resumeData.public ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                        {resumeData.public ? 'Public' : 'Private'}
                    </button>
                    <button onClick={downloadResume} className='flex items-center gap-2 px-5 py-2 text-xs font-bold bg-gray-900 text-white hover:bg-black rounded-xl transition-all shadow-lg shadow-gray-900/20 active:scale-95 active:shadow-none'>
                        <DownloadIcon className='size-4'/> PDF
                    </button>
                </div>
              </div>

              {/* Preview Container */}
              <div className='w-full border border-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 bg-gray-100 h-[800px] lg:h-[calc(100vh-180px)] animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
              </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
    </div>
  )
}

export default ResumeBuilder