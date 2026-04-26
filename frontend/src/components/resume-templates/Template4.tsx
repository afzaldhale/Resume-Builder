import React from "react";
import { ResumeData } from "./types";

interface Template4Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-4 page-safe">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-800 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px w-full bg-slate-300" />
    </div>
    {children}
  </section>
);

const Template4: React.FC<Template4Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] bg-white mx-auto font-sans text-slate-800 overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="bg-slate-900 text-white px-8 pt-7 pb-6 flex-shrink-0 page-safe">
        <h1 className="text-[34px] font-bold tracking-tight leading-none break-words">
          {data.fullName || "Your Name"}
        </h1>

        <p className="text-[15px] text-slate-300 mt-2 font-medium break-words">
          {data.role || "Professional Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-300">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span>{data.address}</span>}
        </div>

        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
            {data.socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} className="hover:text-white">
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <main className="px-8 py-6 flex-1 overflow-hidden flex flex-col justify-between">
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
            <Section title="Professional Experience">
              <div className="space-y-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="text-[12px] font-bold text-slate-900">
                          {exp.role}
                        </h3>
                        <p className="text-[10px] text-slate-600 mt-0.5">
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
            <Section title="Key Projects">
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
                          className="text-[9px] text-blue-700 hover:underline"
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

            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Strengths">
                <ul className="space-y-1">
                  {data.strengths.map((strength, idx) => (
                    <li key={idx} className="text-[10px] text-slate-700">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* LINKS */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <Section title="Online Presence">
                <div className="space-y-1">
                  {data.socialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="block text-[10px] text-blue-700 hover:underline"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-1">
                  {data.languages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[10px] gap-3"
                    >
                      <span className="font-medium text-slate-900">
                        {lang.language}
                      </span>
                      <span className="text-slate-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* CERTIFICATIONS */}
            {data.certifications &&
              data.certifications.length > 0 && (
                <Section title="Certifications">
                  <div className="space-y-2">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx}>
                        <h3 className="text-[10px] font-semibold text-slate-900">
                          {cert.name}
                        </h3>
                        <p className="text-[9px] text-slate-600">
                          {cert.issuer}
                          {cert.year && ` • ${cert.year}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

            {/* HOBBIES */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <Section title="Interests">
                <ul className="space-y-1">
                  {data.hobbies.map((hobby, idx) => (
                    <li key={idx} className="text-[10px] text-slate-700">
                      • {hobby}
                    </li>
                  ))}
                </ul>
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

export default Template4;