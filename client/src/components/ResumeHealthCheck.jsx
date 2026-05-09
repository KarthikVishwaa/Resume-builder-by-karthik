import React, { useMemo, useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  ClipboardCheck, 
  Lightbulb, 
  XCircle 
} from 'lucide-react';

const ResumeHealthCheck = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- ANALYSIS ENGINE ---
  const analysis = useMemo(() => {
    let score = 0;
    const issues = [];
    const passed = [];

    // 1. Personal Info (20 pts)
    const info = data.personal_info || {};
    if (info.full_name && info.email && info.phone) {
      score += 15;
      passed.push("Contact information is complete");
    } else {
      issues.push({ id: "personal", severity: "critical", msg: "Missing contact details (Name, Email, or Phone)" });
    }
    
    if (info.linkedin || info.website) {
      score += 5;
      passed.push("Links (LinkedIn/Portfolio) added");
    } else {
      issues.push({ id: "personal", severity: "suggestion", msg: "Add a LinkedIn or Portfolio link" });
    }

    // 2. Professional Summary (15 pts)
    if (data.professional_summary && data.professional_summary.length > 50) {
      score += 15;
      passed.push("Professional summary is strong");
    } else if (data.professional_summary) {
      score += 5;
      issues.push({ id: "summary", severity: "warning", msg: "Summary is too short (aim for 2-3 sentences)" });
    } else {
      issues.push({ id: "summary", severity: "critical", msg: "Professional summary is missing" });
    }

    // 3. Experience (35 pts)
    if (data.experience && data.experience.length > 0) {
      score += 15; // Base points for having experience
      
      // Check for descriptions
      const hasDetailedDesc = data.experience.every(exp => exp.description && exp.description.length > 30);
      if (hasDetailedDesc) {
        score += 20;
        passed.push("Experience descriptions are detailed");
      } else {
        score += 5;
        issues.push({ id: "experience", severity: "warning", msg: "Expand your job descriptions with achievements" });
      }
    } else {
      issues.push({ id: "experience", severity: "critical", msg: "No work experience listed" });
    }

    // 4. Skills (15 pts)
    if (data.skills && data.skills.length >= 5) {
      score += 15;
      passed.push("Good number of skills listed");
    } else if (data.skills && data.skills.length > 0) {
      score += 5;
      issues.push({ id: "skills", severity: "suggestion", msg: "Add more skills (aim for 5+)" });
    } else {
      issues.push({ id: "skills", severity: "critical", msg: "No skills listed" });
    }

    // 5. Education (10 pts)
    if (data.education && data.education.length > 0) {
      score += 10;
      passed.push("Education section included");
    } else {
      issues.push({ id: "education", severity: "warning", msg: "Education section is missing" });
    }

    // 6. Projects (5 pts - Bonus)
    if (data.project && data.project.length > 0) {
      score += 5;
      passed.push("Projects included");
    }

    return { score: Math.min(score, 100), issues, passed };
  }, [data]);

  // Color logic based on score
  const getScoreColor = (s) => {
    if (s >= 80) return "text-green-600 ring-green-500";
    if (s >= 50) return "text-orange-500 ring-orange-400";
    return "text-red-500 ring-red-400";
  };

  const getProgressColor = (s) => {
    if (s >= 80) return "#16a34a"; // Green
    if (s >= 50) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header - Always Visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-gray-50 to-white"
      >
        <div className="flex items-center gap-3">
          {/* Circular Progress */}
          <div className="relative size-12 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="transition-all duration-1000 ease-out"
                strokeDasharray={`${analysis.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getProgressColor(analysis.score)}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className={`absolute text-xs font-bold ${getScoreColor(analysis.score).split(' ')[0]}`}>
              {analysis.score}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              Resume Strength
              {analysis.score >= 80 && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase rounded-full">Strong</span>}
            </h3>
            <p className="text-xs text-gray-500">
               {analysis.issues.length} improvements found
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          
          {/* 1. Improvements List */}
          {analysis.issues.length > 0 && (
            <div className="p-4 space-y-3 bg-red-50/30">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="size-3.5" /> Action Required
              </h4>
              <div className="space-y-2">
                {analysis.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                    {issue.severity === 'critical' ? (
                       <XCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
                    ) : issue.severity === 'warning' ? (
                       <AlertTriangle className="size-4 text-orange-500 mt-0.5 shrink-0" />
                    ) : (
                       <Lightbulb className="size-4 text-blue-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{issue.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Success List */}
          {analysis.passed.length > 0 && (
            <div className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> What looks good
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {analysis.passed.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Tip */}
          <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100">
             <span className="font-semibold text-gray-700">Pro Tip:</span> Aim for a score of 80+ to pass most ATS filters.
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHealthCheck;