import { Mail, Phone, MapPin } from "lucide-react";

const ExecutiveTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white text-zinc-900 font-serif">
      <div className="grid grid-cols-3 min-h-screen">

        {/* ✅ LEFT EXECUTIVE SIDEBAR */}
        <aside
          className="col-span-1 px-7 py-10 border-r"
          style={{
            borderColor: accentColor + "50",
            background: accentColor + "08",
          }}
        >
          {/* Profile Image */}
          {data.personal_info?.image &&
          typeof data.personal_info.image === "string" ? (
            <div className="mb-8 flex justify-center">
              <img
                src={data.personal_info.image}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-xl shadow-md"
                style={{ border: `3px solid ${accentColor}` }}
              />
            </div>
          ) : data.personal_info?.image &&
            typeof data.personal_info.image === "object" ? (
            <div className="mb-8 flex justify-center">
              <img
                src={URL.createObjectURL(data.personal_info.image)}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-xl shadow-md"
                style={{ border: `3px solid ${accentColor}` }}
              />
            </div>
          ) : null}

          {/* Contact */}
          <section className="mb-10">
            <h2
              className="text-xs font-bold tracking-[3px] uppercase mb-4"
              style={{ color: accentColor }}
            >
              Contact
            </h2>

            <div className="space-y-3 text-sm text-zinc-700">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: accentColor }} />
                  {data.personal_info.phone}
                </div>
              )}

              {data.personal_info?.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail size={14} style={{ color: accentColor }} />
                  {data.personal_info.email}
                </div>
              )}

              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  {data.personal_info.location}
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education?.length > 0 && (
            <section className="mb-10">
              <h2
                className="text-xs font-bold tracking-[3px] uppercase mb-4"
                style={{ color: accentColor }}
              >
                Education
              </h2>

              <div className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold text-zinc-900">
                      {edu.degree}
                    </p>
                    <p className="text-zinc-600">{edu.institution}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold tracking-[3px] uppercase mb-4"
                style={{ color: accentColor }}
              >
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full border"
                    style={{
                      borderColor: accentColor + "60",
                      color: accentColor,
                      background: accentColor + "10",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* ✅ RIGHT MAIN EXECUTIVE CONTENT */}
        <main className="col-span-2 px-10 py-10">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              {data.personal_info?.full_name || "Your Name"}
            </h1>

            <p
              className="uppercase font-semibold tracking-[4px] text-sm mt-2"
              style={{ color: accentColor }}
            >
              {data.personal_info?.profession || "Executive Role"}
            </p>

            <div
              className="mt-6 h-[2px] w-full"
              style={{ background: accentColor }}
            />
          </header>

          {/* Summary */}
          {data.professional_summary && (
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-[3px] mb-3">
                Executive Summary
              </h2>
              <p className="text-zinc-700 leading-relaxed text-sm">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-[3px] mb-5">
                Professional Experience
              </h2>

              <div className="space-y-7">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-zinc-900">
                        {exp.position}
                      </h3>

                      <span className="text-xs text-zinc-500">
                        {formatDate(exp.start_date)} –{" "}
                        {exp.is_current
                          ? "Present"
                          : formatDate(exp.end_date)}
                      </span>
                    </div>

                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: accentColor }}
                    >
                      {exp.company}
                    </p>

                    {exp.description && (
                      <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
                        {exp.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.project?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[3px] mb-5">
                Key Projects
              </h2>

              <div className="space-y-6">
                {data.project.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-zinc-900">
                      {proj.name}
                    </h3>

                    <p className="text-sm text-zinc-600 mb-2">
                      {proj.type}
                    </p>

                    {proj.description && (
                      <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
                        {proj.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
