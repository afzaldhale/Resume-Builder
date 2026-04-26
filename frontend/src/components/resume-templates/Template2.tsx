import React, { useRef, useEffect, useState } from "react";
import { ResumeData } from "./types";

interface Template2Props {
  data: ResumeData;
}

type LayoutMode = "expand" | "normal" | "compact";

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  sidebar?: boolean;
  layoutMode?: LayoutMode;
}> = ({ title, children, sidebar, layoutMode = "normal" }) => {
  const titleSize =
    layoutMode === "expand"
      ? sidebar
        ? "text-[13px]"
        : "text-[14px]"
      : layoutMode === "compact"
      ? sidebar
        ? "text-[10px]"
        : "text-[11px]"
      : sidebar
      ? "text-[11px]"
      : "text-[12px]";

  const spacing =
    layoutMode === "expand"
      ? "mb-4"
      : layoutMode === "compact"
      ? "mb-2"
      : "mb-3";

  return (
    <section className={`${spacing} page-safe`}>
      <h2
        className={`uppercase tracking-[0.14em] font-bold text-blue-700 border-b border-gray-300 pb-1 mb-2 ${titleSize}`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

const Template2: React.FC<Template2Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("normal");

  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  useEffect(() => {
    if (!containerRef.current) return;

    const checkHeight = () => {
      const height = containerRef.current?.scrollHeight || 0;

      if (height < 930) {
        setLayoutMode("expand");
      } else if (height > 1123) {
        setLayoutMode("compact");
      } else {
        setLayoutMode("normal");
      }
    };

    setTimeout(checkHeight, 30);
  }, [data]);

  const nameSize =
    layoutMode === "expand"
      ? "text-[30px]"
      : layoutMode === "compact"
      ? "text-[22px]"
      : "text-[26px]";

  const roleSize =
    layoutMode === "expand"
      ? "text-[14px]"
      : layoutMode === "compact"
      ? "text-[11px]"
      : "text-[13px]";

  const bodySize =
    layoutMode === "expand"
      ? "text-[12px]"
      : layoutMode === "compact"
      ? "text-[10px]"
      : "text-[11px]";

  const smallSize =
    layoutMode === "expand"
      ? "text-[10px]"
      : layoutMode === "compact"
      ? "text-[8px]"
      : "text-[9px]";

  const sideSize =
    layoutMode === "expand"
      ? "text-[11px]"
      : layoutMode === "compact"
      ? "text-[9px]"
      : "text-[10px]";

  return (
    <div
      ref={containerRef}
      className="w-[794px] h-[1123px] mx-auto bg-white overflow-hidden text-gray-800"
    >
      <div className="flex h-full">
        {/* LEFT SIDEBAR */}
        <aside className="w-[31%] bg-gradient-to-b from-slate-100 to-gray-50 border-r border-gray-200 px-5 py-6 flex flex-col justify-between">
          <div>
            {/* Name */}
            <div className="mb-5">
              <h1 className={`${nameSize} font-bold leading-tight break-words`}>
                {data.fullName || "Your Name"}
              </h1>

              {data.role && (
                <p
                  className={`${roleSize} text-gray-600 mt-1 font-medium break-words`}
                >
                  {data.role}
                </p>
              )}
            </div>

            {/* Contact */}
            <Section title="Contact" sidebar layoutMode={layoutMode}>
              <div className={`${sideSize} text-gray-700 space-y-1`}>
                {data.email && <p>{data.email}</p>}
                {data.phone && <p>{data.phone}</p>}
                {data.address && <p>{data.address}</p>}
              </div>
            </Section>

            {/* Skills */}
            {data.skills?.length > 0 && (
              <Section title="Skills" sidebar layoutMode={layoutMode}>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`${smallSize} px-2 py-1 rounded-md bg-white border border-gray-300 text-gray-700`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
              <Section title="Languages" sidebar layoutMode={layoutMode}>
                <div className="space-y-1">
                  {data.languages.map((lang, i) => (
                    <p key={i} className={sideSize}>
                      {lang.language} — {lang.level}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* Links */}
            {data.socialLinks?.length > 0 && (
              <Section title="Links" sidebar layoutMode={layoutMode}>
                <div className="space-y-1">
                  {data.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      className={`${smallSize} block text-blue-700`}
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {/* Fresher */}
            {isFresher && data.strengths?.length > 0 && (
              <Section title="Strengths" sidebar layoutMode={layoutMode}>
                <ul className="space-y-1">
                  {data.strengths.map((s, i) => (
                    <li key={i} className={sideSize}>
                      • {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {isFresher && data.hobbies?.length > 0 && (
              <Section title="Hobbies" sidebar layoutMode={layoutMode}>
                <ul className="space-y-1">
                  {data.hobbies.map((h, i) => (
                    <li key={i} className={sideSize}>
                      • {h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Bottom Sidebar Fill */}
          {data.certifications?.length > 0 && (
            <Section title="Certifications" sidebar layoutMode={layoutMode}>
              <div className="space-y-2">
                {data.certifications.slice(0, 4).map((cert, i) => (
                  <div key={i}>
                    <p className={`${sideSize} font-semibold leading-snug`}>
                      {cert.name}
                    </p>
                    <p className={smallSize}>{cert.issuer}</p>
                    {cert.year && <p className={smallSize}>{cert.year}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="w-[69%] px-6 py-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Summary */}
            {summaryText && (
              <Section title={summaryTitle} layoutMode={layoutMode}>
                <p
                  className={`${bodySize} leading-[1.65] text-gray-700 text-justify`}
                >
                  {summaryText}
                </p>
              </Section>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
              <Section title="Experience" layoutMode={layoutMode}>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className={`${bodySize} font-bold`}>
                            {exp.role}
                          </h3>
                          <p className={`${smallSize} text-gray-600`}>
                            {exp.company}
                          </p>
                        </div>

                        <span
                          className={`${smallSize} text-gray-500 whitespace-nowrap`}
                        >
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>

                      <p
                        className={`${bodySize} leading-[1.55] text-gray-700 mt-1 text-justify`}
                      >
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Projects */}
            {data.projects?.length > 0 && (
              <Section title="Projects" layoutMode={layoutMode}>
                <div className="space-y-3">
                  {data.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between gap-2">
                        <h3 className={`${bodySize} font-bold`}>
                          {proj.name}
                        </h3>

                        {proj.link && (
                          <a
                            href={proj.link}
                            className={`${smallSize} text-blue-700`}
                          >
                            Link
                          </a>
                        )}
                      </div>

                      <p
                        className={`${bodySize} leading-[1.55] text-gray-700 text-justify`}
                      >
                        {proj.description}
                      </p>

                      {proj.technologies?.length > 0 && (
                        <p className={`${smallSize} text-gray-500 mt-1`}>
                          Tech: {proj.technologies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Bottom Fill Area */}
          {data.education?.length > 0 && (
            <Section title="Education" layoutMode={layoutMode}>
              <div className="space-y-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between gap-2">
                      <h3 className={`${bodySize} font-bold`}>
                        {edu.degree}
                      </h3>

                      <span className={smallSize}>
                        {edu.startYear} - {edu.endYear}
                      </span>
                    </div>

                    <p className={`${smallSize} text-gray-600`}>
                      {edu.school}
                    </p>

                    {edu.gpa && (
                      <p className={`${smallSize} text-gray-500`}>
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Template2;