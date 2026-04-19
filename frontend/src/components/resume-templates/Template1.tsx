import React from "react";
import { ResumeData } from "./types";

interface Template1Props {
  data: ResumeData;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-4">
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
    <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="bg-blue-600 text-white p-6 rounded-b-lg mb-4">
        <h1 className="text-2xl font-bold">{data.fullName || "Your Name"}</h1>
        {data.role && <p className="text-sm opacity-90">{data.role}</p>}

        <div className="text-xs mt-2 flex flex-wrap gap-x-4 opacity-90">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span>{data.address}</span>}
        </div>

        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-xs mt-1 flex flex-wrap gap-x-4 opacity-90">
            {data.socialLinks.map((link, i) => (
              <span key={i}>{link.platform}: {link.url}</span>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <div className="flex flex-grow px-6 pb-6 gap-6">

        {/* LEFT COLUMN - 65% */}
        <div className="w-[65%]">

          {/* SUMMARY / CAREER OBJECTIVE */}
          {summaryText && (
            <Section title={summaryTitle}>
              <p className="text-xs leading-relaxed">{summaryText}</p>
            </Section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <Section title="Experience">
              {data.experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{exp.role}</span>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{exp.company}</p>
                  <p className="text-xs leading-snug mt-1">{exp.description}</p>
                </div>
              ))}
            </Section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <Section title="Projects">
              {data.projects.map((proj, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-semibold">{proj.name}</p>
                  <p className="text-xs leading-snug">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Tech: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

        </div>

        {/* RIGHT COLUMN - 35% */}
        <div className="w-[35%]">

          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <Section title="Education">
              {data.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-semibold">{edu.degree}</p>
                  <p className="text-[11px] text-gray-600">{edu.school}</p>
                  <p className="text-[11px] text-gray-500">
                    {edu.startYear} - {edu.endYear}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <Section title="Languages">
              <ul className="text-xs list-disc ml-4">
                {data.languages.map((lang, i) => (
                  <li key={i}>{lang.language} - {lang.level}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <Section title="Certifications">
              {data.certifications.map((cert, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-[11px] text-gray-600">{cert.issuer}</p>
                  {cert.year && <p className="text-[11px] text-gray-500">{cert.year}</p>}
                </div>
              ))}
            </Section>
          )}

          {/* SOCIAL LINKS */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <Section title="Links">
              {data.socialLinks.map((link, i) => (
                <div key={i} className="text-xs text-blue-600 mb-1">
                  {link.platform}: {link.url}
                </div>
              ))}
            </Section>
          )}

          {/* FRESHER ONLY - STRENGTHS */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <Section title="Strengths">
              <ul className="text-xs list-disc ml-4 space-y-1">
                {data.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* FRESHER ONLY - HOBBIES */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Section title="Hobbies">
              <ul className="text-xs list-disc ml-4 space-y-1">
                {data.hobbies.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* REFERENCES */}
          {data.references && data.references.length > 0 && (
            <Section title="References">
              <ul className="text-xs list-disc ml-4 space-y-1">
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
                    <p className="text-xs leading-relaxed mb-2">{section.description}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="text-xs list-disc ml-4 space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.date && (
                    <p className="text-[10px] text-gray-500 mt-1">{section.date}</p>
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