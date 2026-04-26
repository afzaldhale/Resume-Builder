import React from "react";
import { ResumeData } from "./types";

interface Template13Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-5 page-safe">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px w-full bg-slate-200" />
    </div>
    {children}
  </section>
);

const Template13: React.FC<Template13Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white overflow-hidden font-sans text-slate-800 flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white px-7 py-7 flex-shrink-0">
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-[34px] font-bold leading-none tracking-tight break-words">
              {data.fullName || "Your Name"}
            </h1>

            <p className="text-[14px] text-blue-200 font-medium mt-2 break-words">
              {data.role || "Professional Title"}
            </p>

            <div className="w-16 h-1 rounded-full bg-cyan-400 mt-4" />
          </div>

          <div className="text-right space-y-1 text-[10px] text-slate-200 min-w-[190px]">
            {data.email && <p>{data.email}</p>}
            {data.phone && <p>{data.phone}</p>}
            {data.address && <p>{data.address}</p>}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="grid grid-cols-[1fr_2fr] gap-7 px-7 py-6 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="overflow-hidden flex flex-col justify-between">
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="space-y-2.5">
                  {data.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[9px] font-medium text-slate-800">
                          {skill}
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-2">
                  {data.languages.map((lang, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[9px] font-medium text-slate-900">
                          {lang.language}
                        </span>

                        <span className="text-[8px] text-slate-500">
                          {lang.level}
                        </span>
                      </div>

                      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                          style={{
                            width:
                              lang.level === "Native"
                                ? "100%"
                                : lang.level === "Fluent"
                                ? "90%"
                                : lang.level === "Intermediate"
                                ? "70%"
                                : "50%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Strengths">
                <div className="space-y-1">
                  {data.strengths.map((item, idx) => (
                    <p
                      key={idx}
                      className="text-[9px] text-slate-700 flex items-start gap-2"
                    >
                      <span className="text-blue-600 mt-[1px]">•</span>
                      {item}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* CONNECT */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <Section title="Connect">
                <div className="space-y-1">
                  {data.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="block text-[9px] text-blue-700 hover:underline break-words"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* INTERESTS */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Section title="Interests">
              <div className="flex flex-wrap gap-1.5">
                {data.hobbies.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] px-2 py-1 rounded-full bg-slate-100 text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="overflow-hidden flex flex-col">
          {/* SUMMARY */}
          {summaryText && (
            <div className="mb-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-900 mb-2">
                {summaryTitle}
              </h2>

              <p className="text-[10px] text-slate-700 leading-[1.75] text-justify">
                {summaryText}
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <Section
              title={
                isFresher
                  ? "Internships"
                  : "Professional Experience"
              }
            >
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-blue-500 pl-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-900">
                          {exp.role}
                        </h3>

                        <p className="text-[9px] text-indigo-700 font-medium mt-0.5">
                          {exp.company}
                        </p>
                      </div>

                      <span className="text-[8px] text-slate-500 whitespace-nowrap">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    <p className="text-[9px] text-slate-600 leading-[1.65] mt-1 text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <Section title="Projects">
              <div className="space-y-4">
                {data.projects.map((project, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between gap-2">
                      <h3 className="text-[11px] font-bold text-slate-900">
                        {project.name}
                      </h3>

                      {project.link && (
                        <a
                          href={project.link}
                          className="text-[8px] text-blue-700 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>

                    <p className="text-[9px] text-slate-600 leading-[1.65] mt-1 text-justify">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[7px] px-2 py-1 rounded-md bg-slate-100 text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* LOWER GRID */}
          <div className="grid grid-cols-2 gap-6">
            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <div>
                <Section title="Education">
                  <div className="space-y-3">
                    {data.education.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between gap-2">
                          <h3 className="text-[10px] font-bold text-slate-900">
                            {edu.degree}
                          </h3>

                          <span className="text-[8px] text-slate-500">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>

                        <p className="text-[9px] text-indigo-700 mt-0.5">
                          {edu.school}
                        </p>

                        {edu.gpa && (
                          <p className="text-[8px] text-slate-500 mt-0.5">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {data.certifications &&
              data.certifications.length > 0 && (
                <div>
                  <Section title="Certifications">
                    <div className="space-y-3">
                      {data.certifications.map((cert, idx) => (
                        <div key={idx}>
                          <p className="text-[9px] font-semibold text-slate-900">
                            {cert.name}
                          </p>

                          <p className="text-[8px] text-slate-500">
                            {cert.issuer}
                            {cert.year && ` • ${cert.year}`}
                          </p>

                          {cert.credentialId && (
                            <p className="text-[7px] text-slate-400">
                              ID: {cert.credentialId}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}
          </div>

          {/* REFERENCES */}
          {data.references && data.references.length > 0 && (
            <Section title="References">
              <div className="grid grid-cols-2 gap-2">
                {data.references.map((ref, idx) => (
                  <p
                    key={idx}
                    className="text-[9px] text-slate-600 break-words"
                  >
                    {ref}
                  </p>
                ))}
              </div>
            </Section>
          )}

          {/* CUSTOM */}
          {data.customSections &&
            data.customSections.length > 0 &&
            data.customSections.map((section, idx) => (
              <Section key={idx} title={section.title}>
                {section.description && (
                  <p className="text-[9px] text-slate-600 leading-[1.65] mb-1">
                    {section.description}
                  </p>
                )}

                {section.items && section.items.length > 0 && (
                  <ul className="space-y-1">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-[9px] text-slate-600"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.date && (
                  <p className="text-[8px] text-slate-500 mt-1">
                    {section.date}
                  </p>
                )}
              </Section>
            ))}
        </main>
      </div>
    </div>
  );
};

export default Template13;