import React from "react";
import { ResumeData } from "./types";

interface Template3Props {
  data: ResumeData;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-3 page-safe">
    <h2 className="text-[13px] font-semibold uppercase tracking-widest text-blue-600 border-b border-gray-200 pb-1 mb-2">
      {title}
    </h2>
    {children}
  </section>
);

const Template3: React.FC<Template3Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white px-8 py-6 flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="pb-3 border-b-2 border-blue-600 page-safe flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 break-words">{data.fullName || "Your Name"}</h1>
        {data.role && <p className="text-base text-gray-600 font-medium mt-0.5 break-words">{data.role}</p>}
        
        {/* Contact Row */}
        <div className="text-[11px] text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-0.5">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
        
        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-[10px] text-blue-600 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
            {data.socialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url}
                className="break-words hover:underline"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto mt-4 min-h-0">
        {/* SUMMARY / CAREER OBJECTIVE */}
        {summaryText && (
          <Section title={summaryTitle}>
            <p className="text-[11px] leading-relaxed text-gray-700 break-words">{summaryText}</p>
          </Section>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-2">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <h3 className="text-[12px] font-bold text-gray-800 break-words">{exp.role}</h3>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600 break-words">{exp.company}</p>
                  <p className="text-[10px] leading-relaxed text-gray-700 mt-0.5 break-words">{exp.description}</p>
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
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="text-[12px] font-bold text-gray-800 break-words">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-[9px] text-blue-600 hover:underline break-words">
                        Link
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-700 break-words">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[9px] text-gray-500 mt-0.5 break-words">
                      Tech: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Two Column Layout for remaining sections */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <Section title="Education">
                <div className="space-y-2">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="text-[12px] font-bold text-gray-800 break-words">{edu.degree}</h3>
                      <p className="text-[10px] text-gray-600 break-words">{edu.school}</p>
                      <p className="text-[9px] text-gray-500">
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
                <div className="text-[10px] text-gray-700 space-y-0.5">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="break-words">
                      {lang.language} <span className="text-gray-500">({lang.level})</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* FRESHER ONLY - STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Strengths">
                <ul className="text-[10px] text-gray-700 list-disc ml-4 space-y-0.5">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="break-words">{s}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="text-[9px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded break-words">
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* CERTIFICATIONS */}
            {data.certifications && data.certifications.length > 0 && (
              <Section title="Certifications">
                <div className="space-y-1.5">
                  {data.certifications.map((cert, i) => (
                    <div key={i}>
                      <p className="text-[11px] font-semibold text-gray-800 break-words">{cert.name}</p>
                      <p className="text-[9px] text-gray-600 break-words">
                        {cert.issuer}{cert.year && ` • ${cert.year}`}
                      </p>
                      {cert.credentialId && (
                        <p className="text-[8px] text-gray-400">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* FRESHER ONLY - HOBBIES */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <Section title="Hobbies">
                <ul className="text-[10px] text-gray-700 list-disc ml-4 space-y-0.5">
                  {data.hobbies.map((h, i) => (
                    <li key={i} className="break-words">{h}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* REFERENCES */}
            {data.references && data.references.length > 0 && (
              <Section title="References">
                <ul className="text-[10px] text-gray-700 space-y-0.5">
                  {data.references.map((ref, i) => (
                    <li key={i} className="break-words">{ref}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>

        {/* CUSTOM SECTIONS */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section, i) => (
              <Section key={i} title={section.title}>
                {section.description && (
                  <p className="text-[10px] leading-relaxed text-gray-700 mb-1 break-words">{section.description}</p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="text-[10px] text-gray-700 list-disc ml-4 space-y-0.5">
                    {section.items.map((item, j) => (
                      <li key={j} className="break-words">{item}</li>
                    ))}
                  </ul>
                )}
                {section.date && (
                  <p className="text-[9px] text-gray-500 mt-0.5">{section.date}</p>
                )}
              </Section>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Template3;