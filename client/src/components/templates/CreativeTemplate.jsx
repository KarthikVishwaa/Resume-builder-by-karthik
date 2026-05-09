import React from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const CreativeTemplate = ({ data, accentColor = "#2563eb" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month] = dateStr.split("-");
      return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric" }); // Just Year looks cleaner for creative
    } catch (e) { return dateStr; }
  };

  return (
    <div
      className="bg-white text-gray-800 mx-auto box-border flex min-h-[297mm]"
      style={{
        width: "210mm",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Sidebar (Left) */}
      <aside className="w-[75mm] bg-gray-50 p-8 flex flex-col gap-10 border-r border-gray-100">
        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact</h3>
          <div className="space-y-3 text-sm font-medium text-gray-600 break-all">
            {data?.personal_info?.email && (
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 shrink-0" /> {data.personal_info.email}
              </div>
            )}
            {data?.personal_info?.phone && (
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 shrink-0" /> {data.personal_info.phone}
              </div>
            )}
            {data?.personal_info?.location && (
              <div className="flex gap-3 items-center">
                <MapPin className="w-4 h-4 shrink-0" /> {data.personal_info.location}
              </div>
            )}
             {data?.personal_info?.website && (
              <div className="flex gap-3 items-center text-blue-600">
                <ExternalLink className="w-4 h-4 shrink-0" /> Portfolio
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {data?.education?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
            <div className="space-y-6">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold text-gray-900">{edu.institution}</div>
                  <div className="text-sm text-gray-600 mt-1">{edu.degree}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(edu.graduation_date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data?.skills?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-sm font-medium text-gray-700 pb-1 border-b border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content (Right) */}
      <main className="flex-1 p-10 pt-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 leading-none mb-4">
            {data?.personal_info?.full_name?.split(" ")[0]}
            <br />
            <span style={{ color: accentColor }}>
                {data?.personal_info?.full_name?.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          {data?.professional_summary && (
            <p className="text-base text-gray-600 leading-relaxed max-w-md">
                {data.professional_summary}
            </p>
          )}
        </header>

        {/* Experience */}
        {data?.experience?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <span className="w-8 h-1 bg-gray-900 rounded-full"></span> Experience
            </h2>
            <div className="space-y-10 border-l-2 border-gray-100 pl-8 ml-3 relative">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative">
                   <span 
                        className="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: accentColor }}
                   ></span>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{formatDate(exp.start_date)} - {exp.is_current ? "Now" : formatDate(exp.end_date)}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-3">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

         {/* Projects */}
         {data?.project?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <span className="w-8 h-1 bg-gray-900 rounded-full"></span> Selected Works
            </h2>
            <div className="grid grid-cols-1 gap-6">
                {data.project.map((proj, i) => (
                    <div key={i} className="bg-gray-50 p-5 rounded-xl">
                        <h3 className="font-bold text-gray-900 mb-1">{proj.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                    </div>
                ))}
            </div>
          </section>
         )}
      </main>
    </div>
  );
};

export default CreativeTemplate;