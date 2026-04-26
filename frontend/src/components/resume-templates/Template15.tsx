import React from "react";
import { ResumeData } from "./types";

interface Template15Props {
  data: ResumeData;
}

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-3">
    <div className="flex items-center gap-2">
      <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-900">
        {title}
      </h2>
    </div>
  </div>
);

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-5 page-safe">
    <SectionTitle title={title} />
    {children}
  </section>
);

const Template15: React.FC<Template15Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summary = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  return (
    <div className="w-[794px] h-[1123px] bg-white overflow-hidden font-sans flex flex-col">
      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white px-8 pt-8 pb-7 flex-shrink-0 page-safe">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-emerald-400/10 -ml-10 -mb-10" />

        <div className="relative z-10 flex justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-[34px] font-semibold tracking-tight leading-none break-words">
              {data.fullName || "Your Name"}
            </h1>

            <p className="mt-3 text-[12px] uppercase tracking-[0.32em] text-emerald-200 break-words">
              {data.role || "Professional Title"}
            </p>
          </div>

          <div className="min-w-[200px] text-right space-y-1">
            {data.email && (
              <p className="text-[9px] text-slate-200 break-words">
                {data.email}
              </p>
            )}
            {data.phone && (
              <p className="text-[9px] text-slate-200 break-words">
                {data.phone}
              </p>
            )}
            {data.address && (
              <p className="text-[9px] text-slate-200 break-words">
                {data.address}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="grid grid-cols-12 flex-1 min-h-0 overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="col-span-4 bg-slate-50 border-r border-slate-200 px-6 py-6 overflow-y-auto">
          {/* SUMMARY */}
          {summary && (
            <Card
              title={isFresher ? "Career Objective" : "Executive Summary"}
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-[9px] text-slate-700 leading-[1.8] text-justify">
                  {summary}
                </p>
              </div>
            </Card>
          )}

          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <Card title="Core Skills">
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <Card title="Languages">
              <div className="space-y-3">
                {data.languages.map((lang, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] text-slate-800">
                        {lang.language}
                      </span>
                      <span className="text-[8px] text-slate-500">
                        {lang.level}
                      </span>
                    </div>

                    <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
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
            </Card>
          )}

          {/* CERTIFICATIONS */}
          {data.certifications && data.certifications.length > 0 && (
            <Card title="Certifications">
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
            </Card>
          )}

          {/* SOCIAL */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <Card title="Networks">
              <div className="space-y-1.5">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[9px] text-emerald-700 hover:underline break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* FRESHER */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <Card title="Strengths">
              <div className="space-y-1.5">
                {data.strengths.map((item, idx) => (
                  <p
                    key={idx}
                    className="text-[9px] text-slate-700 break-words"
                  >
                    • {item}
                  </p>
                ))}
              </div>
            </Card>
          )}

          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Card title="Interests">
              <div className="flex flex-wrap gap-1.5">
                {data.hobbies.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </aside>

        {/* RIGHT MAIN */}
        <main className="col-span-8 px-7 py-6 overflow-y-auto">
          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <Card
              title={
                isFresher
                  ? "Internships & Experience"
                  : "Professional Experience"
              }
            >
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="text-[11px] font-semibold text-slate-900">
                          {exp.role}
                        </h3>
                        <p className="text-[9px] text-emerald-700 mt-1">
                          {exp.company}
                        </p>
                      </div>

                      <span className="text-[8px] text-slate-500 whitespace-nowrap">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] text-slate-700 leading-[1.75]">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <Card title="Projects">
              <div className="space-y-4">
                {data.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <h3 className="text-[11px] font-semibold text-slate-900">
                        {project.name}
                      </h3>

                      {project.link && (
                        <a
                          href={project.link}
                          className="text-[8px] text-emerald-700 hover:underline"
                        >
                          View →
                        </a>
                      )}
                    </div>

                    <p className="mt-2 text-[9px] text-slate-700 leading-[1.75]">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="text-[7px] px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <Card title="Education">
              <div className="grid grid-cols-2 gap-3">
                {data.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4"
                  >
                    <div className="flex justify-between gap-2">
                      <h3 className="text-[10px] font-semibold text-slate-900">
                        {edu.degree}
                      </h3>
                      <span className="text-[8px] text-slate-500">
                        {edu.startYear} – {edu.endYear}
                      </span>
                    </div>

                    <p className="text-[9px] text-emerald-700 mt-1">
                      {edu.school}
                    </p>

                    {edu.gpa && (
                      <p className="text-[8px] text-slate-500 mt-1">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* REFERENCES */}
          {data.references && data.references.length > 0 && (
            <Card title="References">
              <div className="grid grid-cols-2 gap-3">
                {data.references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <p className="text-[9px] text-slate-700 break-words">
                      {ref}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CUSTOM */}
          {data.customSections &&
            data.customSections.length > 0 &&
            data.customSections.map((section, idx) => (
              <Card key={idx} title={section.title}>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  {section.description && (
                    <p className="text-[9px] text-slate-700 leading-[1.75] mb-2">
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
                    <p className="text-[8px] text-slate-500 mt-2">
                      {section.date}
                    </p>
                  )}
                </div>
              </Card>
            ))}
        </main>
      </div>
    </div>
  );
};

export default Template15;