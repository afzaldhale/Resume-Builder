import React from "react";
import { ResumeData } from "./types";

interface Template9Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  icon?: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="mb-4 page-safe">
    <div className="flex items-center gap-2 mb-2">
      {icon && (
        <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
          {icon}
        </div>
      )}
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-800">
        {title}
      </h2>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
    {children}
  </section>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
    {children}
  </div>
);

const Template9: React.FC<Template9Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden font-sans text-slate-800 flex flex-col">
      {/* HEADER */}
      <header className="px-7 pt-7 pb-5 flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-3xl px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-5">
            <div className="flex-1">
              <h1 className="text-[32px] font-bold tracking-tight leading-none break-words">
                {data.fullName || "Your Name"}
              </h1>

              <p className="text-[14px] text-blue-700 font-medium mt-2 break-words">
                {data.role || "Aspiring Professional"}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-slate-600">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.address && <span>{data.address}</span>}
              </div>

              {data.socialLinks && data.socialLinks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-blue-700">
                  {data.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="hover:underline"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
              {(data.fullName || "Y")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="px-7 pb-7 grid grid-cols-[1fr_2fr] gap-5 flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="overflow-hidden flex flex-col justify-between">
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Card>
                <Section title="Skills" icon="★">
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Section>
              </Card>
            )}

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <div className="mt-4">
                <Card>
                  <Section title="Languages" icon="A">
                    <div className="space-y-1.5">
                      {data.languages.map((lang, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-[9px]"
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
                </Card>
              </div>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <div className="mt-4">
                <Card>
                  <Section title="Strengths" icon="+">
                    <div className="space-y-1">
                      {data.strengths.map((item, idx) => (
                        <p key={idx} className="text-[9px] text-slate-700">
                          • {item}
                        </p>
                      ))}
                    </div>
                  </Section>
                </Card>
              </div>
            )}

            {/* INTERESTS */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <div className="mt-4">
                <Card>
                  <Section title="Interests" icon="♥">
                    <div className="flex flex-wrap gap-1.5">
                      {data.hobbies.map((hobby, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] px-2 py-1 rounded-full bg-purple-50 text-purple-700"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </Section>
                </Card>
              </div>
            )}
          </div>

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <Card>
              <Section title="Certifications" icon="✓">
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
            </Card>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="overflow-hidden flex flex-col justify-between">
          <div>
            {/* SUMMARY */}
            {summaryText && (
              <Card>
                <Section title={summaryTitle} icon="i">
                  <p className="text-[10px] text-slate-700 leading-[1.7] text-justify">
                    {summaryText}
                  </p>
                </Section>
              </Card>
            )}

            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
              <div className="mt-4">
                <Card>
                  <Section
                    title={
                      isFresher
                        ? "Internships"
                        : "Professional Experience"
                    }
                    icon="↗"
                  >
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
                </Card>
              </div>
            )}

            {/* PROJECTS */}
            {data.projects && data.projects.length > 0 && (
              <div className="mt-4">
                <Card>
                  <Section title="Projects" icon="□">
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
                                View
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
                </Card>
              </div>
            )}
          </div>

          {/* LOWER GRID */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* EDUCATION */}
            <Card>
              <Section title="Education" icon="⌂">
                <div className="space-y-2">
                  {data.education?.map((edu, idx) => (
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
                        <p className="text-[8px] text-slate-500">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </Card>

            {/* REFERENCES */}
            <Card>
              <Section title="References" icon="◎">
                <div className="space-y-1">
                  {data.references?.map((ref, idx) => (
                    <p key={idx} className="text-[9px] text-slate-700">
                      {ref}
                    </p>
                  ))}
                </div>
              </Section>
            </Card>
          </div>

          {/* CUSTOM */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="mt-4">
              <Card>
                {data.customSections.map((section, idx) => (
                  <Section
                    key={idx}
                    title={section.title}
                    icon="•"
                  >
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
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Template9;