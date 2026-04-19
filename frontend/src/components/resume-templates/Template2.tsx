import React, { useRef, useEffect, useState } from "react";
import { ResumeData } from "./types";

interface Template2Props {
  data: ResumeData;
}

type LayoutMode = 'expand' | 'normal' | 'compact';

const Section: React.FC<{ title: string; children: React.ReactNode; sidebar?: boolean; layoutMode?: LayoutMode }> = ({ title, children, sidebar, layoutMode }) => {
  const titleSize = layoutMode === 'expand' ? (sidebar ? 'text-[13px]' : 'text-[14px]') : (sidebar ? 'text-[11px]' : 'text-[12px]');
  const mbSize = layoutMode === 'compact' ? (sidebar ? 'mb-2' : 'mb-2') : (sidebar ? 'mb-3' : 'mb-4');
  
  return (
    <section className={`${mbSize} page-break-inside-avoid`}>
      <h2 className={`font-semibold uppercase tracking-wide text-blue-600 ${titleSize} border-b border-gray-200 pb-1 mb-2`}>
        {title}
      </h2>
      {children}
    </section>
  );
};

const Template2: React.FC<Template2Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('normal');
  
  const isFresher = data.candidateType === "fresher";

  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;

  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  // Dynamic font sizes based on layout mode
  const nameSize = layoutMode === 'expand' ? 'text-3xl' : layoutMode === 'compact' ? 'text-lg' : 'text-xl';
  const roleSize = layoutMode === 'expand' ? 'text-base' : layoutMode === 'compact' ? 'text-xs' : 'text-sm';
  const bodySize = layoutMode === 'expand' ? 'text-[12px]' : layoutMode === 'compact' ? 'text-[9px]' : 'text-[10px]';
  const sidebarTextSize = layoutMode === 'expand' ? 'text-[11px]' : layoutMode === 'compact' ? 'text-[9px]' : 'text-[10px]';
  const smallTextSize = layoutMode === 'expand' ? 'text-[10px]' : layoutMode === 'compact' ? 'text-[8px]' : 'text-[9px]';

  useEffect(() => {
    if (!containerRef.current) return;

    const height = containerRef.current.scrollHeight;

    if (height < 900) {
      setLayoutMode('expand');
    } else if (height > 1123) {
      setLayoutMode('compact');
    } else {
      setLayoutMode('normal');
    }
  }, [data]);

  return (
    <div ref={containerRef} className="w-[794px] min-h-[1123px] mx-auto bg-white flex flex-col">

      {/* LAYOUT: Sidebar (30%) + Main Content (70%) */}
      <div className="flex flex-row">

        {/* LEFT SIDEBAR - 30% */}
        <aside className="w-[30%] bg-gray-100 p-4 flex-shrink-0 border-r border-gray-200">
          
          {/* Name & Role */}
          <div className={layoutMode === 'expand' ? 'mb-5' : 'mb-4'}>
            <h1 className={`${nameSize} font-bold text-gray-800`}>{data.fullName || "Your Name"}</h1>
            {data.role && <p className={`${roleSize} text-gray-600`}>{data.role}</p>}
          </div>

          {/* Contact Info */}
          <Section title="Contact" sidebar layoutMode={layoutMode}>
            <div className={`${sidebarTextSize} text-gray-700 space-y-1`}>
              {data.email && <p className="break-all">{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
              {data.address && <p className="break-words">{data.address}</p>}
            </div>
          </Section>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <Section title="Skills" sidebar layoutMode={layoutMode}>
              <div className={`flex flex-wrap gap-1 ${layoutMode === 'expand' ? 'gap-2' : 'gap-1'}`}>
                {data.skills.map((skill, i) => (
                  <span key={i} className={`${smallTextSize} bg-white text-gray-700 px-1.5 py-0.5 rounded border border-gray-300`}>
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <Section title="Languages" sidebar layoutMode={layoutMode}>
              <ul className={`${sidebarTextSize} text-gray-700 space-y-0.5`}>
                {data.languages.map((lang, i) => (
                  <li key={i}>{lang.language} - {lang.level}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <Section title="Certifications" sidebar layoutMode={layoutMode}>
              {data.certifications.map((cert, i) => (
                <div key={i} className={layoutMode === 'compact' ? 'mb-1' : 'mb-1.5'}>
                  <p className={`${sidebarTextSize} font-semibold text-gray-800`}>{cert.name}</p>
                  <p className={`${smallTextSize} text-gray-600`}>{cert.issuer}</p>
                  {cert.year && <p className={`${smallTextSize} text-gray-500`}>{cert.year}</p>}
                </div>
              ))}
            </Section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <Section title="Links" sidebar layoutMode={layoutMode}>
              <div className="space-y-1">
                {data.socialLinks.map((link, i) => (
                  <p key={i} className={`${smallTextSize} text-blue-600 break-words`}>
                    {link.platform}: {link.url}
                  </p>
                ))}
              </div>
            </Section>
          )}

          {/* Fresher Only - Strengths */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <Section title="Strengths" sidebar layoutMode={layoutMode}>
              <ul className={`${sidebarTextSize} text-gray-700 list-disc ml-3 space-y-1`}>
                {data.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Fresher Only - Hobbies */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <Section title="Hobbies" sidebar layoutMode={layoutMode}>
              <ul className={`${sidebarTextSize} text-gray-700 list-disc ml-3 space-y-1`}>
                {data.hobbies.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </Section>
          )}

        </aside>

        {/* RIGHT MAIN CONTENT - 70% */}
        <main className="w-[70%] p-4 flex-grow">

          {/* Summary / Career Objective */}
          {summaryText && (
            <Section title={summaryTitle} layoutMode={layoutMode}>
              <p className={`${bodySize} leading-relaxed text-gray-700`}>{summaryText}</p>
            </Section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <Section title="Experience" layoutMode={layoutMode}>
              {data.experience.map((exp, i) => (
                <div key={i} className={layoutMode === 'compact' ? 'mb-2' : 'mb-3'}>
                  <div className="flex justify-between items-start">
                    <h3 className={`${bodySize} font-bold text-gray-800`}>{exp.role}</h3>
                    <span className={`${smallTextSize} text-gray-500 whitespace-nowrap ml-2`}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className={`${smallTextSize} text-gray-600`}>{exp.company}</p>
                  <p className={`${bodySize} leading-snug text-gray-700 mt-1`}>{exp.description}</p>
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <Section title="Projects" layoutMode={layoutMode}>
              {data.projects.map((proj, i) => (
                <div key={i} className={layoutMode === 'compact' ? 'mb-1.5' : 'mb-2'}>
                  <h3 className={`${bodySize} font-bold text-gray-800`}>{proj.name}</h3>
                  <p className={`${bodySize} leading-snug text-gray-700`}>{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className={`${smallTextSize} text-gray-500 mt-0.5`}>
                      Tech: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <Section title="Education" layoutMode={layoutMode}>
              {data.education.map((edu, i) => (
                <div key={i} className={layoutMode === 'compact' ? 'mb-1.5' : 'mb-2'}>
                  <h3 className={`${bodySize} font-bold text-gray-800`}>{edu.degree}</h3>
                  <p className={`${smallTextSize} text-gray-600`}>{edu.school}</p>
                  <p className={`${smallTextSize} text-gray-500`}>
                    {edu.startYear} - {edu.endYear}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <Section title="References" layoutMode={layoutMode}>
              <ul className={`${bodySize} text-gray-700 space-y-1`}>
                {data.references.map((ref, i) => (
                  <li key={i} className="break-words">{ref}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, i) => (
                <Section key={i} title={section.title} layoutMode={layoutMode}>
                  {section.description && (
                    <p className={`${bodySize} leading-snug text-gray-700 mb-2`}>{section.description}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className={`${bodySize} text-gray-700 list-disc ml-4 space-y-0.5`}>
                      {section.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.date && (
                    <p className={`${smallTextSize} text-gray-500 mt-1`}>{section.date}</p>
                  )}
                </Section>
              ))}
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default Template2;
