import React from "react";
import { ResumeData } from "./types";

interface Template8Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-4 page-safe">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-800 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px w-full bg-slate-300" />
    </div>
    {children}
  </section>
);

const Template8: React.FC<Template8Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] bg-white mx-auto overflow-hidden font-sans text-slate-800 flex flex-col">
      {/* HEADER */}
      <header className="px-7 pt-7 pb-5 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 flex-shrink-0">
        <div className="border-l-4 border-blue-700 pl-4">
          <h1 className="text-[32px] font-bold tracking-tight leading-none break-words">
            {data.fullName || "Your Name"}
          </h1>

          <p className="text-[14px] text-blue-700 font-medium mt-2 break-words">
            {data.role || "Professional Title"}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-slate-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.address && <span>{data.address}</span>}
          </div>

          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-blue-700">
              {data.socialLinks.map((link, idx) => (
                <a key={idx} href={link.url} className="hover:underline">
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="grid grid-cols-[1fr_2fr] gap-0 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="bg-slate-50 border-r border-slate-200 px-6 py-5 overflow-hidden flex flex-col justify-between">
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-1">
                  {data.languages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between gap-2 text-[9px]"
                    >
                      <span className="font-medium text-slate-900">
                        {lang.language}
                      </span>
                      <span className="text-slate-500">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Strengths">
                <div className="space-y-1">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[9px] text-slate-700">
                      • {strength}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* INTERESTS */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <Section title="Interests">
                <div className="space-y-1">
                  {data.hobbies.map((hobby, idx) => (
                    <p key={idx} className="text-[9px] text-slate-700">
                      • {hobby}
                    </p>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* BOTTOM LEFT */}
          {data.certifications && data.certifications.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx}>
                    <p className="text-[9px] font-semibold text-slate-900">
                      {cert.name}
                    </p>
                    <p className="text-[8px] text-slate-500">
                      {cert.issuer}
                      {cert.year && ` • ${cert.year}`}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="px-7 py-5 overflow-hidden flex flex-col justify-between">
          <div>
            {/* SUMMARY */}
            {summaryText && (
              <Section title={summaryTitle}>
                <p className="text-[10px] text-slate-700 leading-[1.7] text-justify">
                  {summaryText}
                </p>
              </Section>
            )}

            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
              <Section title="Experience">
                <div className="space-y-3">
                  {data.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="text-[11px] font-bold text-slate-900">
                            {exp.role}
                          </h3>
                          <p className="text-[9px] text-blue-700 mt-0.5 font-medium">
                            {exp.company}
                          </p>
                        </div>

                        <span className="text-[8px] text-slate-500 whitespace-nowrap mt-0.5">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>

                      <p className="text-[9px] text-slate-700 leading-[1.65] mt-1 text-justify">
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
                <div className="space-y-3">
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
                            Link
                          </a>
                        )}
                      </div>

                      <p className="text-[9px] text-slate-700 leading-[1.65] text-justify">
                        {project.description}
                      </p>

                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="text-[8px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
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
          </div>

          {/* LOWER */}
          <div className="grid grid-cols-2 gap-6">
            {/* EDUCATION */}
            <div>
              {data.education && data.education.length > 0 && (
                <Section title="Education">
                  <div className="space-y-2">
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

                        <p className="text-[9px] text-slate-600">
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
              )}
            </div>

            {/* REFERENCES */}
            <div>
              {data.references && data.references.length > 0 && (
                <Section title="References">
                  <div className="space-y-1">
                    {data.references.map((ref, idx) => (
                      <p key={idx} className="text-[9px] text-slate-700">
                        {ref}
                      </p>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>

          {/* CUSTOM */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="mt-1">
              {data.customSections.map((section, idx) => (
                <Section key={idx} title={section.title}>
                  {section.description && (
                    <p className="text-[9px] text-slate-700 leading-[1.65] mb-1">
                      {section.description}
                    </p>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-[9px] text-slate-700"
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Template8;