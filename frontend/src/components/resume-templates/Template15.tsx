import React from 'react';
import { ResumeData } from './types';

interface Template15Props {
  data: ResumeData;
}

const Template15: React.FC<Template15Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-white p-5 font-sans flex flex-col overflow-hidden">
      {/* Executive Header */}
      <header className="mb-4 page-safe flex-shrink-0">
        <div className="border-t-4 border-gray-900 pt-4">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-1 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-gray-600 font-normal mb-2 break-words">
            {data.role || 'Executive Professional'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[8px] text-gray-500 uppercase tracking-wide">
            {data.email && <span className="break-words">{data.email}</span>}
            {data.phone && <span className="break-words">{data.phone}</span>}
            {data.address && <span className="break-words">{data.address}</span>}
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      {(data.summary || data.careerObjective) && (
        <section className="mb-4 page-safe border-b border-gray-200 pb-3 flex-shrink-0">
          <p className="text-[9px] text-gray-700 leading-relaxed break-words">
            {isFresher ? data.careerObjective : data.summary}
          </p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto min-h-0">
        {/* Left Column */}
        <div className="col-span-1">
          {/* Core Competencies */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Core Competencies
              </h2>
              <div className="space-y-1">
                {data.skills.map((skill, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {skill}</p>
                ))}
              </div>
            </section>
          )}

          {/* Leadership Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Strengths
              </h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Languages
              </h2>
              <div className="space-y-1.5">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[9px] font-medium text-gray-900">{lang.language}</p>
                    <p className="text-[8px] text-gray-600 uppercase tracking-wide">{lang.level}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Certifications
              </h2>
              <div className="space-y-1.5">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[9px] font-medium text-gray-900">{cert.name}</p>
                    <p className="text-[8px] text-gray-600">{cert.issuer}, {cert.year}</p>
                    {cert.credentialId && (
                      <p className="text-[7px] text-gray-500">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professional Networks */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Professional Networks
              </h2>
              <div className="space-y-0.5">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[9px] text-gray-700 hover:text-gray-900 break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Executive Experience */}
        <div className="col-span-2">
          {/* Professional Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Professional Experience
              </h2>
              <div className="space-y-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="mb-1.5">
                      <h3 className="text-[11px] font-semibold text-gray-900">{exp.role}</h3>
                      <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <p className="text-[9px] text-gray-700 font-medium">{exp.company}</p>
                        <p className="text-[8px] text-gray-500">{exp.startDate} – {exp.endDate}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strategic Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Strategic Initiatives
              </h2>
              <div className="space-y-2.5">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-1">
                      <h3 className="text-[11px] font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[8px] text-gray-600 hover:text-gray-900">
                          Details →
                        </a>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-700 leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[8px] text-gray-500 mt-0.5">
                        {project.technologies.join(' • ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <h3 className="text-[10px] font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-[9px] text-gray-700">{edu.school}</p>
                    <p className="text-[8px] text-gray-500">
                      {edu.startYear} – {edu.endYear}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Interests
              </h2>
              <p className="text-[9px] text-gray-700 break-words">
                {data.hobbies.join(' • ')}
              </p>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                Professional References
              </h2>
              <div className="space-y-1">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <section key={idx} className="mb-4 page-safe">
                  <h2 className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider mb-2">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-[9px] text-gray-700 leading-relaxed mb-1 break-words">
                      {section.description}
                    </p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[9px] text-gray-700 break-words">{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.date && (
                    <p className="text-[8px] text-gray-500 mt-0.5">{section.date}</p>
                  )}
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template15;