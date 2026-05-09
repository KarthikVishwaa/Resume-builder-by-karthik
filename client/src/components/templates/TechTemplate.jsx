import React from "react";
import { Github, Linkedin, Mail, Globe, Code2 } from "lucide-react";

const TechTemplate = ({ data, accentColor = "#059669" }) => {
  return (
    <div
      className="bg-white text-gray-900 mx-auto box-border"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "12mm",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Tech Header */}
      <header className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tighter text-gray-900 mb-2">
            {`> ${data?.personal_info?.full_name}_`}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600">
             {data?.personal_info?.email && (
                 <span className="flex items-center gap-1 hover:text-black hover:underline cursor-pointer">
                    <Mail className="w-3 h-3" /> {data.personal_info.email}
                 </span>
             )}
             {data?.personal_info?.linkedin && (
                 <span className="flex items-center gap-1 hover:text-black hover:underline cursor-pointer">
                    <Linkedin className="w-3 h-3" /> LinkedIn
                 </span>
             )}
              {data?.personal_info?.website && (
                 <span className="flex items-center gap-1 hover:text-black hover:underline cursor-pointer">
                    <Globe className="w-3 h-3" /> Website
                 </span>
             )}
          </div>
        </div>
        <div className="text-right">
             <div className="text-xs font-mono text-gray-500 mb-1">LOCATION</div>
             <div className="font-bold text-sm">{data?.personal_info?.location || "Remote"}</div>
        </div>
      </header>

      {/* Skills (Top Priority for Tech) */}
      {data?.skills?.length > 0 && (
        <section className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-xs font-mono font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-3 h-3" /> Technical Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-mono font-medium text-gray-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
           Experience
           <span className="h-px flex-1 bg-gray-200"></span>
        </h2>
        <div className="space-y-6">
            {data?.experience?.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                        </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-2" style={{ color: accentColor }}>
                        @{exp.company}
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-700">{exp.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Projects */}
      {data?.project?.length > 0 && (
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            Projects
            <span className="h-px flex-1 bg-gray-200"></span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {data.project.map((proj, i) => (
                    <div key={i} className="border border-gray-200 p-4 rounded hover:border-gray-400 transition-colors break-inside-avoid">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                            <Github className="w-3 h-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
                            {proj.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* Education */}
      {data?.education?.length > 0 && (
         <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Education
                <span className="h-px flex-1 bg-gray-200"></span>
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
                {data.education.map((edu, i) => (
                    <div key={i}>
                        <div className="font-bold">{edu.institution}</div>
                        <div className="text-gray-600">{edu.degree}</div>
                        <div className="text-xs text-gray-400 font-mono mt-1">{edu.graduation_date}</div>
                    </div>
                ))}
            </div>
         </section>
      )}
    </div>
  );
};

export default TechTemplate;