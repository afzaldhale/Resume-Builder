import React from "react";
import { ResumeData } from "./types";

interface Template12Props {
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

const Template12: React.FC<Template12Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white overflow-hidden font-sans text-slate-800 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[32%] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-7 flex flex-col">
        {/* Name */}
        <div className="mb-7 page-safe">
          <div className="w-14 h-1 bg-cyan-400 rounded-full mb-4" />

          <h1 className="text-[28px] font-bold leading-tight break-words">
            {data.fullName || "Your Name"}
          </h1>

          <p className="text-[13px] text-cyan-300 mt-2 break-words">
            {data.role || "Professional Title"}
          </p>
        </div>

        {/* Contact */}
        <div className="mb-6 page-safe">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
            Contact
          </h2>

          <div className="space-y-2 text-[9px] text-slate-200 leading-relaxed">
            {data.email && <p className="break-words">{data.email}</p>}
            {data.phone && <p className="break-words">{data.phone}</p>}
            {data.address && <p className="break-words">{data.address}</p>}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6 page-safe">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              Skills
            </h2>

            <div className="space-y-2">
              {data.skills.map((skill, idx) => (
                <div key={idx}>
                  <p className="text-[9px] text-white mb-1">{skill}</p>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div className="mb-6 page-safe">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              Languages
            </h2>

            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="flex justify-between gap-2 text-[9px]"
                >
                  <span>{lang.language}</span>
                  <span className="text-slate-300">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="mb-6 page-safe">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              Connect
            </h2>

            <div className="space-y-1">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="block text-[9px] text-slate-200 hover:text-cyan-300 break-words"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Fresher Only */}
        {isFresher && data.strengths && data.strengths.length > 0 && (
          <div className="mb-6 page-safe">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              Strengths
            </h2>

            <div className="space-y-1 text-[9px] text-slate-200">
              {data.strengths.map((item, idx) => (
                <p key={idx}>• {item}</p>
              ))}
            </div>
          </div>
        )}

        {isFresher && data.hobbies && data.hobbies.length > 0 && (
          <div className="page-safe mt-auto">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-2">
              Interests
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {data.hobbies.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[8px] px-2 py-1 rounded-full bg-slate-700 text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="w-[68%] px-7 py-7 overflow-hidden flex flex-col">
        {/* Summary */}
        {summaryText && (
          <Section title={summaryTitle}>
            <p className="text-[10px] text-slate-600 leading-[1.75] text-justify">
              {summaryText}
            </p>
          </Section>
        )}

        {/* Experience */}
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
                  className="border-l-2 border-cyan-400 pl-4"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-900">
                        {exp.role}
                      </h3>
                      <p className="text-[9px] text-cyan-700 font-medium mt-0.5">
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

        {/* Projects */}
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

        {/* Lower Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <Section title="Education">
                <div className="space-y-3">
                  {data.education.map((edu, idx) => (
                    <div key={idx}>
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
            </div>
          )}

          {/* Certifications */}
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

        {/* References */}
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

        {/* Custom Sections */}
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

export default Template12;