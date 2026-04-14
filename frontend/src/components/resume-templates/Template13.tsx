import React from "react";
import { ResumeData } from "./types";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template13Props {
  data: ResumeData;
}

const Template13: React.FC<Template13Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher" || data.experience.length === 0;

  return (
    <div className="w-[794px] mx-auto min-h-[1123px] bg-purple-50 font-sans text-gray-900 border border-gray-300">
      <div className="flex">

        {/* LEFT ACCENT BAR */}
        <div className="w-6 bg-purple-700"></div>

        {/* CONTENT */}
        <div className="flex-1 p-10 space-y-8 bg-white">

          {/* HEADER */}
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-wide">
              {data.fullName || "Your Name"}
            </h1>

            {data.role && (
              <p className="text-lg text-purple-700 font-medium">
                {data.role}
              </p>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-700 mt-3">
              {data.email && (
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {data.email}
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {data.phone}
                </span>
              )}
              {data.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {data.address}
                </span>
              )}
            </div>
          </header>

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

          {/* SKILLS */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="section-title">SKILLS</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
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

          {/* EDUCATION */}
          {data.education.length > 0 && (
            <section>
              <h2 className="section-title">EDUCATION</h2>
              <div className="space-y-3 mt-2">
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
              <div className="space-y-3 mt-2">
                {data.projects.map((p, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="section-title">LANGUAGES</h2>
              <div className="space-y-2 mt-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang.language}</span>
                    <span className="text-xs text-gray-600 bg-purple-100 px-2 py-1 rounded">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STRENGTHS */}
          {data.strengths && data.strengths.length > 0 && (
            <section>
              <h2 className="section-title">STRENGTHS</h2>
              <ul className="text-sm mt-2 space-y-1">
                {data.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* HOBBIES */}
          {data.hobbies && data.hobbies.length > 0 && (
            <section>
              <h2 className="section-title">HOBBIES</h2>
              <div className="text-sm mt-2">
                {data.hobbies.join(", ")}
              </div>
            </section>
          )}

        </div>
      </div>

      <style>{`
        .section-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #a78bfa;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Template13;
