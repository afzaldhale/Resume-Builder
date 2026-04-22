import React from 'react';
import { ResumeData } from './types';

interface Template8Props {
  data: ResumeData;
}

const Template8: React.FC<Template8Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-white p-5 font-sans flex flex-col overflow-hidden">
      {/* Corporate Header with Border */}
      <header className="mb-4 page-safe border-l-4 border-blue-600 pl-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-sm text-blue-600 font-medium mb-1.5 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[9px] text-gray-600">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto min-h-0">
        {/* Left Column */}
        <div className="col-span-1">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Skills
              </h2>
              <div className="space-y-0.5">
                {data.skills.map((skill, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {skill}</p>
                ))}
              </div>
            </section>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Strengths
              </h2>
              <div className="space-y-0.5">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Languages
              </h2>
              <div className="space-y-0.5">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="text-[9px] break-words">
                    <span className="font-medium">{lang.language}:</span> {lang.level}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications (Compact) */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Certifications
              </h2>
              <div className="space-y-0.5">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[9px] text-gray-700 font-medium">{cert.name}</p>
                    <p className="text-[8px] text-gray-500">{cert.issuer} • {cert.year}</p>
                    {cert.credentialId && (
                      <p className="text-[7px] text-gray-400">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Links
              </h2>
              <div className="space-y-0.5">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[9px] text-blue-600 hover:underline break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Interests
              </h2>
              <div className="space-y-0.5">
                {data.hobbies.map((hobby, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {hobby}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Columns (2/3) */}
        <div className="col-span-2">
          {/* Summary / Career Objective */}
          {(data.summary || data.careerObjective) && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[9px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Experience
              </h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-[10px] font-bold text-gray-900">{exp.role}</h3>
                      <span className="text-[8px] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-[9px] text-blue-600 mb-0.5">{exp.company}</p>
                    <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Projects
              </h2>
              <div className="space-y-1.5">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-[10px] font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[8px] text-blue-600 hover:underline">
                          Link
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
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="space-y-1">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-[10px] font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-[8px] text-gray-500">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <p className="text-[9px] text-gray-700">{edu.school}</p>
                    {edu.gpa && <p className="text-[8px] text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
                References
              </h2>
              <div className="space-y-0.5">
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
                <section key={idx} className="mb-3 page-safe">
                  <h2 className="text-[11px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-0.5 mb-1.5">
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

export default Template8;