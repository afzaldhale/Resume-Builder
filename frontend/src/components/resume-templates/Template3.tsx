import React from "react";
import { ResumeData } from "./types";

interface Template3Props {
  data: ResumeData;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-4 page-break-inside-avoid">
    <h2 className="text-[14px] font-semibold uppercase tracking-widest text-blue-600 border-b border-gray-200 pb-1 mb-2">
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
    <div className="w-[794px] min-h-[1123px] mx-auto bg-white px-8 py-6 flex flex-col">

      {/* HEADER */}
      <header className="mb-6 pb-3 border-b-2 border-blue-600">
        <h1 className="text-3xl font-bold text-gray-900">{data.fullName || "Your Name"}</h1>
        {data.role && <p className="text-base text-gray-600 font-medium mt-0.5">{data.role}</p>}
        
        {/* Contact Row */}
        <div className="text-[12px] text-gray-600 mt-2 flex flex-wrap gap-x-3">
          {data.email && <span className="break-all">{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
        
        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="text-[11px] text-blue-600 mt-1 flex flex-wrap gap-x-3">
            {data.socialLinks.map((link, i) => (
              <span key={i} className="break-words">
                {link.platform}: {link.url}
              </span>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">

        {/* SUMMARY / CAREER OBJECTIVE */}
        {summaryText && (
          <Section title={summaryTitle}>
            <p className="text-[12px] leading-relaxed text-gray-700">{summaryText}</p>
          </Section>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Section title="Experience">
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-[12px] font-bold text-gray-800">{exp.role}</h3>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap ml-2">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">{exp.company}</p>
                <p className="text-[11px] leading-relaxed text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </Section>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <Section title="Projects">
            {data.projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <h3 className="text-[12px] font-bold text-gray-800">{proj.name}</h3>
                <p className="text-[11px] leading-relaxed text-gray-700">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Tech: {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <h3 className="text-[12px] font-bold text-gray-800">{edu.degree}</h3>
                <p className="text-[11px] text-gray-600">{edu.school}</p>
                <p className="text-[10px] text-gray-500">
                  {edu.startYear} - {edu.endYear}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* LANGUAGES */}
        {data.languages && data.languages.length > 0 && (
          <Section title="Languages">
            <div className="text-[11px] text-gray-700">
              {data.languages.map((lang, i) => (
                <span key={i}>
                  {lang.language} ({lang.level}){i < data.languages.length - 1 ? " • " : ""}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* CERTIFICATIONS */}
        {data.certifications && data.certifications.length > 0 && (
          <Section title="Certifications">
            {data.certifications.map((cert, i) => (
              <div key={i} className="mb-2">
                <p className="text-[11px] font-semibold text-gray-800">{cert.name}</p>
                <p className="text-[10px] text-gray-600">
                  {cert.issuer}{cert.year && ` • ${cert.year}`}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* FRESHER ONLY - STRENGTHS */}
        {isFresher && data.strengths && data.strengths.length > 0 && (
          <Section title="Strengths">
            <ul className="text-[11px] text-gray-700 list-disc ml-4 space-y-1">
              {data.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* FRESHER ONLY - HOBBIES */}
        {isFresher && data.hobbies && data.hobbies.length > 0 && (
          <Section title="Hobbies">
            <ul className="text-[11px] text-gray-700 list-disc ml-4 space-y-1">
              {data.hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* REFERENCES */}
        {data.references && data.references.length > 0 && (
          <Section title="References">
            <ul className="text-[11px] text-gray-700 space-y-1">
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
                  <p className="text-[11px] leading-relaxed text-gray-700 mb-2">{section.description}</p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="text-[11px] text-gray-700 list-disc ml-4 space-y-1">
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

      </main>
    </div>
  );
};

export default Template3;