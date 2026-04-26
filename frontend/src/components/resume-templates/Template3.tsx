import React from "react";
import { ResumeData } from "./types";

interface Template3Props {
  data: ResumeData;
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mb-4 page-safe">
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-800 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px w-full bg-slate-300" />
    </div>
    {children}
  </section>
);

const Template3: React.FC<Template3Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white px-8 py-7 text-slate-800 overflow-hidden font-sans">
      {/* HEADER */}
      <header className="pb-5 border-b-[2px] border-slate-800 flex-shrink-0 page-safe">
        <h1 className="text-[34px] font-bold tracking-tight leading-none break-words">
          {data.fullName || "Your Name"}
        </h1>

        {data.role && (
          <p className="text-[15px] text-slate-600 font-medium mt-2 break-words">
            {data.role}
          </p>
        )}

        {/* CONTACT */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span>{data.address}</span>}
        </div>

        {/* LINKS */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-700">
            {data.socialLinks.map((link, i) => (
              <a key={i} href={link.url} className="hover:underline">
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <main className="mt-5 h-[calc(100%-120px)] overflow-hidden flex flex-col justify-between">
        <div>
          {/* SUMMARY */}
          {summaryText && (
            <Section title={summaryTitle}>
              <p className="text-[11px] leading-[1.7] text-slate-700 text-justify">
                {summaryText}
              </p>
            </Section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <Section title="Experience">
              <div className="space-y-3">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start gap-3">
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

                    <p className="text-[10px] leading-[1.65] text-slate-700 mt-1 text-justify">
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
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2">
                      <h3 className="text-[12px] font-bold text-slate-900">
                        {proj.name}
                      </h3>

                      {proj.link && (
                        <a
                          href={proj.link}
                          className="text-[9px] text-slate-600 hover:underline"
                        >
                          Link
                        </a>
                      )}
                    </div>

                    <p className="text-[10px] leading-[1.65] text-slate-700 text-justify">
                      {proj.description}
                    </p>

                    {proj.technologies &&
                      proj.technologies.length > 0 && (
                        <p className="text-[9px] text-slate-500 mt-1">
                          Tech: {proj.technologies.join(", ")}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-2 gap-5">
          {/* LEFT */}
          <div>
            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
              <Section title="Education">
                <div className="space-y-2">
                  {data.education.map((edu, i) => (
                    <div key={i}>
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

            {/* LANGUAGES */}
            {data.languages && data.languages.length > 0 && (
              <Section title="Languages">
                <div className="space-y-1">
                  {data.languages.map((lang, i) => (
                    <p key={i} className="text-[10px] text-slate-700">
                      {lang.language}{" "}
                      <span className="text-slate-500">({lang.level})</span>
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* STRENGTHS */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <Section title="Strengths">
                <ul className="space-y-1">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="text-[10px] text-slate-700">
                      • {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* CERTIFICATIONS */}
            {data.certifications &&
              data.certifications.length > 0 && (
                <Section title="Certifications">
                  <div className="space-y-2">
                    {data.certifications.map((cert, i) => (
                      <div key={i}>
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

            {/* HOBBIES */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <Section title="Hobbies">
                <ul className="space-y-1">
                  {data.hobbies.map((h, i) => (
                    <li key={i} className="text-[10px] text-slate-700">
                      • {h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* REFERENCES */}
            {data.references && data.references.length > 0 && (
              <Section title="References">
                <div className="space-y-1">
                  {data.references.map((ref, i) => (
                    <p key={i} className="text-[10px] text-slate-700">
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
            {data.customSections.map((section, i) => (
              <Section key={i} title={section.title}>
                {section.description && (
                  <p className="text-[10px] text-slate-700 leading-[1.65] mb-1">
                    {section.description}
                  </p>
                )}

                {section.items && section.items.length > 0 && (
                  <ul className="space-y-1">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-[10px] text-slate-700">
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

export default Template3;