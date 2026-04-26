import React from "react";
import { ResumeData } from "./types";

interface Template11Props {
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
      <div className="h-px w-full bg-slate-200" />
    </div>
    {children}
  </section>
);

const Template11: React.FC<Template11Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] bg-white mx-auto overflow-hidden font-sans text-slate-800 flex flex-col">
      {/* HEADER */}
      <header className="px-7 pt-7 pb-5 border-b border-slate-200 flex-shrink-0">
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-[32px] font-bold tracking-tight leading-none break-words">
              {data.fullName || "Your Name"}
            </h1>

            <p className="text-[14px] text-blue-700 font-medium mt-2 break-words">
              {data.role || "Professional Title"}
            </p>
          </div>

          <div className="text-right space-y-1 text-[10px] text-slate-600 min-w-[180px]">
            {data.email && <p>{data.email}</p>}
            {data.phone && <p>{data.phone}</p>}
            {data.address && <p>{data.address}</p>}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="grid grid-cols-[1fr_2fr] gap-6 px-7 py-5 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="overflow-hidden flex flex-col justify-between">
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="space-y-2">
                  {data.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-[9px] mb-1">
                        <span className="font-medium text-slate-800">
                          {skill}
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full w-4/5 rounded-full bg-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-1.5">
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
                  {data.strengths.map((item, idx) => (
                    <p key={idx} className="text-[9px] text-slate-700">
                      • {item}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* SOCIAL */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <Section title="Connect">
                <div className="space-y-1">
                  {data.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="block text-[9px] text-blue-700 hover:underline"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* HOBBIES */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Section title="Interests">
              <div className="flex flex-wrap gap-1.5">
                {data.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] px-2 py-1 rounded-full bg-slate-100 text-slate-700"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="overflow-hidden flex flex-col justify-between">
          <div>
            {/* SUMMARY */}
            {summaryText && (
              <Section title={summaryTitle}>
                <p className="text-[10px] text-slate-700 leading-[1.7] text-justify">
                  {summaryText}
                </p>
              </Section>
            )}

            {/* EXPERIENCE TIMELINE */}
            {data.experience && data.experience.length > 0 && (
              <Section
                title={
                  isFresher
                    ? "Internships"
                    : "Experience Timeline"
                }
              >
                <div className="relative pl-5">
                  <div className="absolute left-[6px] top-1 bottom-1 w-px bg-slate-200" />

                  <div className="space-y-4">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm" />

                        <div>
                          <div className="flex justify-between gap-3">
                            <div>
                              <h3 className="text-[11px] font-bold text-slate-900">
                                {exp.role}
                              </h3>

                              <p className="text-[9px] text-blue-700 mt-0.5 font-medium">
                                {exp.company}
                              </p>
                            </div>

                            <span className="text-[8px] text-slate-500 whitespace-nowrap">
                              {exp.startDate} - {exp.endDate}
                            </span>
                          </div>

                          <p className="text-[9px] text-slate-700 leading-[1.65] mt-1 text-justify">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
          </div>

          {/* LOWER GRID */}
          <div className="grid grid-cols-2 gap-5">
            {/* EDUCATION */}
            <div>
              {data.education && data.education.length > 0 && (
                <Section title="Education">
                  <div className="space-y-2">
                    {data.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-blue-200 pl-3"
                      >
                        <h3 className="text-[10px] font-bold text-slate-900">
                          {edu.degree}
                        </h3>

                        <p className="text-[9px] text-slate-600">
                          {edu.school}
                        </p>

                        <p className="text-[8px] text-slate-500 mt-0.5">
                          {edu.startYear} - {edu.endYear}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* CERTIFICATIONS */}
            <div>
              {data.certifications &&
                data.certifications.length > 0 && (
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
            </div>
          </div>

          {/* REFERENCES */}
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

export default Template11;