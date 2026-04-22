import React from "react";
import { ResumeData } from "./types";

interface Template1Props {
  data: ResumeData;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-4 page-safe">
    <h2 className="text-[13px] font-semibold uppercase tracking-wide text-blue-600 border-b border-gray-200 pb-1 mb-2">
      {title}
    </h2>
    {children}
  </section>
);

const Template1: React.FC<Template1Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white text-gray-800 flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-600 text-white p-6 rounded-b-lg page-safe">
        <h1 className="text-2xl font-bold break-words">{data.fullName || "Your Name"}</h1>
        {data.role && <p className="text-sm opacity-90 break-words">{data.role}</p>}

        <div className="text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1 opacity-90">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>

        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1 opacity-90">
            {data.socialLinks.map((link, i) => (
              <span key={i} className="break-words">{link.platform}: {link.url}</span>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <div className="flex flex-1 px-6 pb-6 gap-6 min-h-0">
        {/* LEFT COLUMN - 65% */}
        <div className="w-[65%] flex flex-col overflow-y-auto">
          {/* SUMMARY / CAREER OBJECTIVE */}
          {summaryText && (
            <Section title={summaryTitle}>
              <p className="text-xs leading-relaxed break-words">{summaryText}</p>
            </Section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-3">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <span className="text-sm font-semibold break-words">{exp.role}</span>
                      <span className="text-[10px] text-gray-500">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 break-words">{exp.company}</p>
                    <p className="text-[11px] leading-snug mt-1 break-words">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <Section title="Projects">
              <div className="space-y-2">
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold break-words">{proj.name}</p>
                    <p className="text-[11px] leading-snug break-words">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-500 mt-1 break-words">
                        Tech: {proj.technologies.join(", ")}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} className="text-[10px] text-blue-600 hover:underline break-words">
                        {proj.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT COLUMN - 35% */}
        <div className="w-[35%] flex flex-col overflow-y-auto">
          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded break-words">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <Section title="Education">
              <div className="space-y-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold break-words">{edu.degree}</p>
                    <p className="text-[10px] text-gray-600 break-words">{edu.school}</p>
                    <p className="text-[10px] text-gray-500">
                      {edu.startYear} - {edu.endYear}
                      {edu.gpa && <span className="ml-2">GPA: {edu.gpa}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <Section title="Languages">
              <ul className="text-[11px] list-disc ml-4 space-y-0.5">
                {data.languages.map((lang, i) => (
                  <li key={i} className="break-words">{lang.language} - {lang.level}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold break-words">{cert.name}</p>
                    <p className="text-[10px] text-gray-600 break-words">{cert.issuer}</p>
                    {cert.year && <p className="text-[10px] text-gray-500">{cert.year}</p>}
                    {cert.credentialId && (
                      <p className="text-[9px] text-gray-400">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* SOCIAL LINKS */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <Section title="Links">
              <div className="space-y-1">
                {data.socialLinks.map((link, i) => (
                  <a 
                    key={i}
                    href={link.url}
                    className="block text-[11px] text-blue-600 hover:underline break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* FRESHER ONLY - STRENGTHS */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <Section title="Strengths">
              <ul className="text-[11px] list-disc ml-4 space-y-0.5">
                {data.strengths.map((s, i) => (
                  <li key={i} className="break-words">{s}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* FRESHER ONLY - HOBBIES */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Section title="Hobbies">
              <ul className="text-[11px] list-disc ml-4 space-y-0.5">
                {data.hobbies.map((h, i) => (
                  <li key={i} className="break-words">{h}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* REFERENCES */}
          {data.references && data.references.length > 0 && (
            <Section title="References">
              <ul className="text-[11px] list-disc ml-4 space-y-0.5">
                {data.references.map((ref, i) => (
                  <li key={i} className="break-words">{ref}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* CUSTOM SECTIONS */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, i) => (
                <Section key={i} title={section.title}>
                  {section.description && (
                    <p className="text-[11px] leading-relaxed mb-2 break-words">{section.description}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="text-[11px] list-disc ml-4 space-y-0.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="break-words">{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.date && (
                    <p className="text-[9px] text-gray-500 mt-1">{section.date}</p>
                  )}
                </Section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template1;