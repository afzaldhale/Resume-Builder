import React from "react";
import { ResumeData } from "./types";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template11Props {
  data: ResumeData;
}

const Template11: React.FC<Template11Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher" || data.experience.length === 0;

  return (
    <div className="w-[794px] mx-auto bg-gray-200 font-sans text-gray-900 border border-gray-300">
      <div className="flex min-h-[1123px]">

        {/* LEFT SIDEBAR */}
        <aside className="w-1/3 bg-slate-800 text-white p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <p className="text-sm text-slate-300 mt-1">
                {data.role}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {data.email && (
              <p className="flex items-center gap-2">
                <Mail size={14} /> {data.email}
              </p>
            )}
            {data.phone && (
              <p className="flex items-center gap-2">
                <Phone size={14} /> {data.phone}
              </p>
            )}
            {data.address && (
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {data.address}
              </p>
            )}
          </div>

          {data.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                SKILLS
              </h2>
              <ul className="text-sm space-y-1">
                {data.skills.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                LANGUAGES
              </h2>
              <ul className="text-sm space-y-1">
                {data.languages.map((lang, i) => (
                  <li key={i}>• {lang.language} ({lang.level})</li>
                ))}
              </ul>
            </div>
          )}

          {data.strengths && data.strengths.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                STRENGTHS
              </h2>
              <ul className="text-sm space-y-1">
                {data.strengths.map((strength, i) => (
                  <li key={i}>• {strength}</li>
                ))}
              </ul>
            </div>
          )}

          {data.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                HOBBIES
              </h2>
              <div className="text-sm">
                {data.hobbies.join(", ")}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="w-2/3 bg-white p-10 space-y-8">

          {(data.summary || data.careerObjective) && (
            <section>
              <h2 className="section-title">
                {isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
              </h2>
              <p className="text-sm mt-2 leading-relaxed">
                {isFresher
                  ? data.careerObjective || data.summary
                  : data.summary || data.careerObjective}
              </p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h2 className="section-title">WORK EXPERIENCE</h2>
              <div className="space-y-4 mt-2">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-sm mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className="section-title">EDUCATION</h2>
              <div className="space-y-3 mt-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{edu.degree}</p>
                    <p className="text-sm text-gray-600">
                      {edu.school} | {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      <style>{`
        .section-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #cbd5f5;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Template11;
