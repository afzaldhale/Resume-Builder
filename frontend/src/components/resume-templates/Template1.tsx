import React from "react";
import { ResumeData } from "./types";
import { getSummaryConfig } from "./templatePolicy";

interface Template1Props {
  data: ResumeData;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-[20px]">
    <div style={{ height: '38px', backgroundColor: '#F58200' }} className="flex items-center">
      <div className="pl-3 text-black uppercase font-bold text-[13px]">{children}</div>
    </div>
  </div>
);

const Template1: React.FC<Template1Props> = ({ data }) => {
  const { summaryText, summaryTitle } = getSummaryConfig(data);

  return (
    <div className="bg-white text-[#222] w-[794px] min-h-[1123px] mx-auto font-sans">
      <div className="max-w-[600px] mx-auto px-10 py-8 text-[12px] leading-[1.6]">
        <header className="flex justify-between items-start gap-8">
          <div>
              <h1 className="text-[38px] font-extrabold uppercase tracking-[4px] leading-tight">{data.fullName || "Your Name"}</h1>
              {data.role && (
                <p className="text-[14px] font-light uppercase tracking-[1px] mt-2 mb-4">{data.role}</p>
              )}
          </div>

          <div className="text-sm text-right space-y-1 min-w-[180px] text-[#444] leading-tight">
            {data.phone && <div className="">Mobile: {data.phone}</div>}
            {data.email && <div className="">Email: {data.email}</div>}
            {data.address && <div className="">Address: {data.address}</div>}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="">{data.socialLinks.map(l => `${l.platform}: ${l.url}`).join(" | ")}</div>
            )}
          </div>
        </header>

        <div className="mt-3 border-t border-gray-200"></div>

        {/* Summary */}
        {summaryText && (
          <section>
            <SectionHeader>{summaryTitle}</SectionHeader>
            <div className="mt-[12px] text-[12px] leading-[1.6]">
              <p>{summaryText}</p>
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <SectionHeader>Skills</SectionHeader>
            <div className="mt-[12px] text-[12px] leading-[1.6]">{[...new Set(data.skills)].join(", ")}</div>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <SectionHeader>Professional Experience</SectionHeader>
            <div className="mt-[12px] space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-[14px] font-bold">{exp.role}{exp.company && ` – ${exp.company}`}</h3>
                  <div className="text-[12px] text-[#666]">{exp.startDate || ""}{exp.endDate && ` – ${exp.endDate}`}</div>
                  {exp.description && (
                    <ul className="list-disc ml-5 mt-1">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="text-[12px]">{line}</li>
                      ))}
                    </ul>
                  )}
                  {exp.impact && <div className="text-[12px] text-[#666] mt-1">Impact: {exp.impact}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <SectionHeader>Projects</SectionHeader>
            <div className="mt-[12px] space-y-4">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-[14px] font-bold">{project.name}</h3>
                  <div className="text-[12px] mt-1">{project.description}</div>
                  {project.impact && <div className="text-[12px] text-[#666] mt-1">Impact: {project.impact}</div>}
                  {project.technologies.length > 0 && <div className="text-[12px] text-[#666] mt-1">Technologies: {project.technologies.join(", ")}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <SectionHeader>Education</SectionHeader>
            <div className="mt-[12px] space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-[16px] font-bold">{edu.degree} – {edu.school}</h3>
                  <div className="text-[14px]"><span className="text-[12px] text-[#666]">{edu.startYear || ""}{edu.endYear && ` – ${edu.endYear}`}</span></div>
                  {edu.gpa && <div className="text-[12px] text-[#666]">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <SectionHeader>Certifications</SectionHeader>
            <div className="mt-[20px]">
              <ul className="list-disc ml-5 space-y-2">
                {data.certifications.map((cert, index) => (
                  <li key={index} className="text-[12px]">
                    <strong>{cert.name}</strong>
                    {cert.issuer && <span className="ml-2">{cert.issuer}</span>}
                    {cert.year && <span className="ml-2 text-[#666]">{cert.year}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <SectionHeader>Languages</SectionHeader>
            <div className="mt-[12px] text-[12px]">{data.languages.map(l => `${l.language} (${l.level})`).join(", ")}</div>
          </section>
        )}

        {/* Strengths */}
        {data.strengths && data.strengths.length > 0 && (
          <section>
            <SectionHeader>Strengths</SectionHeader>
            <div className="mt-[12px] text-[12px]">{data.strengths.join(", ")}</div>
          </section>
        )}

        {/* Hobbies */}
        {data.hobbies && data.hobbies.length > 0 && (
          <section>
            <SectionHeader>Hobbies & Interests</SectionHeader>
            <div className="mt-[12px] text-[12px]">{data.hobbies.join(", ")}</div>
          </section>
        )}

        {/* Spacer removed — using .resume-page-body-offset for multi-page spacing */}
      </div>
    </div>
  );
};

export default Template1;
