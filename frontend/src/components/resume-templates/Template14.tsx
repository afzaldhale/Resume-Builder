import React from "react";
import { ResumeData } from "./types";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template14Props {
  data: ResumeData;
}

const Template14: React.FC<Template14Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher" || data.experience.length === 0;

  return (
    <div className="w-[794px] min-h-[1123px] mx-auto bg-gray-100 border border-gray-300 font-sans text-gray-900">
      <div className="p-10 bg-white m-6">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{data.fullName || "Your Name"}</h1>

          {data.role && (
            <p className="text-lg text-teal-700 mt-1">
              {data.role}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-sm text-gray-700 mt-4">
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

        {/* TIMELINE WRAPPER */}
        <div className="relative border-l-2 border-teal-600 pl-8 space-y-10">

          {/* SUMMARY */}
          {(data.summary || data.careerObjective) && (
            <section className="relative">
              <TimelineDot />
              <h2 className="section-title">
                {isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed">
                {isFresher
                  ? data.careerObjective || data.summary
                  : data.summary || data.careerObjective}
              </p>
            </section>
          )}

          {/* SKILLS */}
          {data.skills.length > 0 && (
            <section className="relative">
              <TimelineDot />
              <h2 className="section-title">SKILLS</h2>
              <ul className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                {data.skills.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience.length > 0 && (
            <section className="relative">
              <TimelineDot />
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
            <section className="relative">
              <TimelineDot />
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
            <section className="relative">
              <TimelineDot />
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

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <section className="relative">
              <TimelineDot />
              <h2 className="section-title">LANGUAGES</h2>
              <div className="mt-3 space-y-2">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang.language}</span>
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STRENGTHS */}
          {data.strengths && data.strengths.length > 0 && (
            <section className="relative">
              <TimelineDot />
              <h2 className="section-title">STRENGTHS</h2>
              <ul className="mt-3 space-y-1 text-sm">
                {data.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* HOBBIES */}
          {data.hobbies && data.hobbies.length > 0 && (
            <section className="relative">
              <TimelineDot />
              <h2 className="section-title">HOBBIES</h2>
              <div className="mt-3 text-sm">
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
          border-bottom: 2px solid #0f766e;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

const TimelineDot = () => (
  <span className="absolute -left-[13px] top-1 w-3 h-3 bg-teal-600 rounded-full"></span>
);

export default Template14;
