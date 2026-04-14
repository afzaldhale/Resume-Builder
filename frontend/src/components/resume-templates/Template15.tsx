import React from "react";
import { ResumeData } from "./types";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template15Props {
  data: ResumeData;
}

const Template15: React.FC<Template15Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher" || data.experience.length === 0;

  return (
    <div className="w-[794px] min-h-[1123px] mx-auto bg-white border border-gray-300 font-sans text-gray-900">
      <div className="grid grid-cols-3">

        {/* LEFT COLUMN */}
        <aside className="col-span-1 bg-slate-100 p-8">
          <h1 className="text-2xl font-bold leading-tight">
            {data.fullName || "Your Name"}
          </h1>

          {data.role && (
            <p className="text-sm text-slate-700 mt-2">
              {data.role}
            </p>
          )}

          <div className="mt-6 space-y-3 text-sm text-gray-700">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} /> {data.email}
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} /> {data.phone}
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {data.address}
              </div>
            )}
          </div>

          {/* SKILLS */}
          {data.skills.length > 0 && (
            <div className="mt-8">
              <h2 className="left-title">SKILLS</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {data.skills.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STRENGTHS */}
          {data.strengths?.length > 0 && (
            <div className="mt-8">
              <h2 className="left-title">STRENGTHS</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {data.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <div className="mt-8">
              <h2 className="left-title">LANGUAGES</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {data.languages.map((lang, i) => (
                  <li key={i}>• {lang.language} ({lang.level})</li>
                ))}
              </ul>
            </div>
          )}

          {/* HOBBIES */}
          {data.hobbies && data.hobbies.length > 0 && (
            <div className="mt-8">
              <h2 className="left-title">HOBBIES</h2>
              <div className="mt-2 text-sm">
                {data.hobbies.join(", ")}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT COLUMN */}
        <main className="col-span-2 p-10 space-y-8">

          {/* SUMMARY */}
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

          {/* EXPERIENCE */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="section-title">WORK EXPERIENCE</h2>
              <div className="mt-3 space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <section>
              <h2 className="section-title">EDUCATION</h2>
              <div className="mt-3 space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-600">
                      {edu.school} | {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="section-title">PROJECTS</h2>
              <div className="mt-3 space-y-3">
                {data.projects.map((p, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-sm">{p.description}</p>
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
          border-bottom: 2px solid #334155;
          padding-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .left-title {
          font-size: 13px;
          font-weight: 700;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Template15;
