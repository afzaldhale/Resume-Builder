import React from "react";
import { ResumeData } from "./types";

interface Template14Props {
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

const Template14: React.FC<Template14Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] bg-white font-sans overflow-hidden flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[30%] bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white px-6 py-7 flex flex-col">
        {/* NAME */}
        <div className="mb-7 page-safe">
          <h1 className="text-[28px] font-bold leading-tight break-words">
            {data.fullName || "Your Name"}
          </h1>

          <p className="text-[12px] text-blue-200 mt-2 break-words">
            {data.role || "Professional Title"}
          </p>

          <div className="w-14 h-1 rounded-full bg-cyan-400 mt-4" />
        </div>

        {/* CONTACT */}
        <Section title="Contact">
          <div className="space-y-2 text-[9px] text-slate-200">
            {data.email && <p className="break-words">{data.email}</p>}
            {data.phone && <p className="break-words">{data.phone}</p>}
            {data.address && <p className="break-words">{data.address}</p>}
          </div>
        </Section>

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <Section title="Skills">
            <div className="space-y-2">
              {data.skills.map((skill, idx) => (
                <div key={idx}>
                  <p className="text-[9px] text-slate-100 mb-1">{skill}</p>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
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
                    <span className="text-[9px] text-slate-100">
                      {lang.language}
                    </span>
                    <span className="text-[8px] text-slate-300">
                      {lang.level}
                    </span>
                  </div>

                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{
                        width:
                          lang.level === "Native"
                            ? "100%"
                            : lang.level === "Fluent"
                            ? "85%"
                            : lang.level === "Intermediate"
                            ? "65%"
                            : "45%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* SOCIAL */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <Section title="Connect">
            <div className="space-y-1.5">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="block text-[9px] text-cyan-300 hover:text-white break-words"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* FRESHER */}
        {isFresher && data.hobbies && data.hobbies.length > 0 && (
          <Section title="Interests">
            <div className="flex flex-wrap gap-1.5">
              {data.hobbies.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[8px] px-2 py-1 rounded-full bg-white/10 text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>
        )}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="w-[70%] px-7 py-7 overflow-y-auto">
        {/* SUMMARY */}
        {summaryText && (
          <div className="mb-6 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-4 page-safe">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 mb-2">
              {summaryTitle}
            </h2>

            <p className="text-[10px] text-slate-700 leading-[1.7] text-justify">
              {summaryText}
            </p>
          </div>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <Section
            title={
              isFresher ? "Internships" : "Professional Experience"
            }
          >
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-cyan-500 pl-4"
                >
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

                  <p className="text-[9px] text-slate-600 leading-[1.65] mt-1">
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
                        className="text-[8px] text-cyan-700 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-600 leading-[1.65] mt-1">
                    {project.description}
                  </p>

                  {project.technologies &&
                    project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
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

        {/* GRID LOWER */}
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

                      <p className="text-[9px] text-blue-700 mt-0.5">
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
  );
};

export default Template14;