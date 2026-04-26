import React from "react";
import { ResumeData } from "./types";

interface Template5Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-4 page-safe">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-indigo-700 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px w-full bg-indigo-200" />
    </div>
    {children}
  </section>
);

const Template5: React.FC<Template5Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] bg-white mx-auto overflow-hidden font-sans text-slate-800 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-[31%] bg-gradient-to-b from-indigo-700 via-indigo-800 to-slate-900 text-white px-6 py-7 flex flex-col justify-between">
        <div>
          {/* NAME */}
          <div className="mb-6">
            <h1 className="text-[30px] font-bold leading-tight break-words">
              {data.fullName || "Your Name"}
            </h1>

            {data.role && (
              <p className="text-[13px] text-indigo-200 mt-2 font-medium break-words">
                {data.role}
              </p>
            )}
          </div>

          {/* CONTACT */}
          <div className="mb-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-indigo-200 mb-2 font-semibold">
              Contact
            </h3>

            <div className="space-y-1 text-[10px] text-slate-100 leading-relaxed">
              {data.email && <p>{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
              {data.address && <p>{data.address}</p>}
            </div>
          </div>

          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-indigo-200 mb-2 font-semibold">
                Skills
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-1 rounded-md bg-white/10 border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-indigo-200 mb-2 font-semibold">
                Languages
              </h3>

              <div className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <p key={idx} className="text-[10px]">
                    {lang.language} — {lang.level}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* LINKS */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-indigo-200 mb-2 font-semibold">
                Profiles
              </h3>

              <div className="space-y-1">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[10px] text-white hover:text-indigo-200"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM */}
        {isFresher && data.hobbies && data.hobbies.length > 0 && (
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-indigo-200 mb-2 font-semibold">
              Interests
            </h3>

            <div className="space-y-1">
              {data.hobbies.map((hobby, idx) => (
                <p key={idx} className="text-[10px]">
                  • {hobby}
                </p>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="w-[69%] px-7 py-7 overflow-hidden flex flex-col justify-between">
        <div>
          {/* SUMMARY */}
          {summaryText && (
            <Section title={summaryTitle}>
              <p className="text-[11px] text-slate-700 leading-[1.7] text-justify">
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
                        <h3 className="text-[12px] font-bold text-slate-900">
                          {exp.role}
                        </h3>
                        <p className="text-[10px] text-slate-600 mt-0.5 italic">
                          {exp.company}
                        </p>
                      </div>

                      <span className="text-[9px] text-slate-500 whitespace-nowrap mt-0.5">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-700 leading-[1.65] mt-1 text-justify">
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
                      <h3 className="text-[12px] font-bold text-slate-900">
                        {project.name}
                      </h3>

                      {project.link && (
                        <a
                          href={project.link}
                          className="text-[9px] text-indigo-700 hover:underline"
                        >
                          Link
                        </a>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-700 leading-[1.65] text-justify">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <p className="text-[9px] text-slate-500 mt-1">
                          Tech: {project.technologies.join(" • ")}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT */}
          <div>
            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <Section title="Education">
                <div className="space-y-2">
                  {data.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-[11px] font-bold text-slate-900">
                        {edu.degree}
                      </h3>
                      <p className="text-[10px] text-slate-600">
                        {edu.school}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        {edu.startYear} - {edu.endYear}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Core Strengths">
                <div className="space-y-1">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[10px] text-slate-700">
                      • {strength}
                    </p>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* CERTIFICATIONS */}
            {data.certifications &&
              data.certifications.length > 0 && (
                <Section title="Certifications">
                  <div className="space-y-2">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx}>
                        <p className="text-[10px] font-semibold text-slate-900">
                          {cert.name}
                        </p>
                        <p className="text-[9px] text-slate-600">
                          {cert.issuer}
                          {cert.year && ` • ${cert.year}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

            {/* REFERENCES */}
            {data.references && data.references.length > 0 && (
              <Section title="References">
                <div className="space-y-1">
                  {data.references.map((ref, idx) => (
                    <p key={idx} className="text-[10px] text-slate-700">
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
                  <p className="text-[10px] text-slate-700 leading-[1.65] mb-1">
                    {section.description}
                  </p>
                )}

                {section.items && section.items.length > 0 && (
                  <ul className="space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.date && (
                  <p className="text-[9px] text-slate-500 mt-1">
                    {section.date}
                  </p>
                )}
              </Section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Template5;