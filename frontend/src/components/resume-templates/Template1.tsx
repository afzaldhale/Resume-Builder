import React from "react";
import { ResumeData } from "./types";

interface Template1Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  grow?: boolean;
}> = ({ title, children, grow = false }) => (
  <section className={`page-safe ${grow ? "flex-1 flex flex-col" : ""}`}>
    <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-blue-700 border-b border-gray-300 pb-1 mb-2">
      {title}
    </h2>

    <div className={grow ? "flex-1" : ""}>{children}</div>
  </section>
);

const Template1: React.FC<Template1Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white text-gray-800 overflow-hidden font-sans">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-7 pt-6 pb-5">
        <h1 className="text-[30px] font-bold leading-tight break-words">
          {data.fullName || "Your Name"}
        </h1>

        {data.role && (
          <p className="text-[15px] mt-1 text-blue-100 font-medium break-words">
            {data.role}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-blue-50">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span>{data.address}</span>}
        </div>

        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-blue-100">
            {data.socialLinks.map((link, i) => (
              <span key={i}>
                {link.platform}: {link.url}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <div className="h-[calc(1123px-154px)] px-7 py-5 grid grid-cols-[2fr_1fr] gap-6">
        {/* LEFT SIDE */}
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            {/* SUMMARY */}
            {summaryText && (
              <Section title={summaryTitle}>
                <p className="text-[12px] leading-[1.65] text-gray-700 text-justify">
                  {summaryText}
                </p>
              </Section>
            )}

            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
              <Section title="Experience">
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[15px] font-semibold leading-tight">
                            {exp.role}
                          </p>
                          <p className="text-[12px] text-gray-600 mt-0.5">
                            {exp.company}
                          </p>
                        </div>

                        <p className="text-[10px] text-gray-500 whitespace-nowrap mt-1">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>

                      {exp.description && (
                        <p className="text-[11px] leading-[1.55] text-gray-700 mt-1.5 text-justify">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* PROJECTS */}
            {data.projects && data.projects.length > 0 && (
              <Section title="Projects" grow>
                <div className="space-y-3">
                  {data.projects.map((proj, i) => (
                    <div key={i}>
                      <p className="text-[14px] font-semibold">{proj.name}</p>

                      {proj.description && (
                        <p className="text-[11px] text-gray-700 leading-[1.55] mt-1 text-justify">
                          {proj.description}
                        </p>
                      )}

                      {proj.technologies &&
                        proj.technologies.length > 0 && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            Tech: {proj.technologies.join(", ")}
                          </p>
                        )}

                      {proj.link && (
                        <a
                          href={proj.link}
                          className="text-[10px] text-blue-700 mt-1 inline-block"
                        >
                          {proj.link}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <Section title="Education">
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <p className="text-[12px] font-semibold leading-snug">
                        {edu.degree}
                      </p>
                      <p className="text-[11px] text-gray-600">{edu.school}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {edu.startYear} - {edu.endYear}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-1.5">
                  {data.languages.map((lang, i) => (
                    <p key={i} className="text-[11px] text-gray-700">
                      {lang.language} — {lang.level}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* CERTIFICATIONS */}
            {data.certifications && data.certifications.length > 0 && (
              <Section title="Certifications">
                <div className="space-y-2.5">
                  {data.certifications.map((cert, i) => (
                    <div key={i}>
                      <p className="text-[11px] font-semibold leading-snug">
                        {cert.name}
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {cert.issuer}
                      </p>
                      {cert.year && (
                        <p className="text-[10px] text-gray-500">
                          {cert.year}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* LINKS */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <Section title="Links">
                <div className="space-y-1">
                  {data.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      className="block text-[10px] text-blue-700"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {/* FRESHER EXTRA */}
            {isFresher &&
              data.strengths &&
              data.strengths.length > 0 && (
                <Section title="Strengths">
                  <ul className="space-y-1">
                    {data.strengths.map((s, i) => (
                      <li key={i} className="text-[11px]">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <Section title="Hobbies">
                <ul className="space-y-1">
                  {data.hobbies.map((h, i) => (
                    <li key={i} className="text-[11px]">
                      • {h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* REFERENCES */}
            {data.references && data.references.length > 0 && (
              <Section title="References">
                <ul className="space-y-1">
                  {data.references.map((ref, i) => (
                    <li key={i} className="text-[11px]">
                      • {ref}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* CUSTOM */}
            {data.customSections &&
              data.customSections.length > 0 &&
              data.customSections.map((section, i) => (
                <Section key={i} title={section.title}>
                  {section.description && (
                    <p className="text-[11px] leading-[1.55] text-gray-700">
                      {section.description}
                    </p>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j} className="text-[11px]">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.date && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      {section.date}
                    </p>
                  )}
                </Section>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;