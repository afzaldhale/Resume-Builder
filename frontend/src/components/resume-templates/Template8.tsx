import React from 'react';
import { ResumeData } from './types';

interface Template8Props {
  data: ResumeData;
}

const Template8: React.FC<Template8Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-6 font-sans">
      {/* Corporate Header with Border */}
      <header className="mb-5 page-safe border-l-4 border-blue-600 pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-base text-blue-600 font-medium mb-2 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="col-span-1">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Skills
              </h2>
              <div className="space-y-1">
                {data.skills.map((skill, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">• {skill}</p>
                ))}
              </div>
            </section>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Strengths
              </h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="text-[10px] break-words">
                    <span className="font-medium">{lang.language}:</span> {lang.level}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications (Compact) */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Certifications
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">
                    {cert.name} ({cert.year})
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Links
              </h2>
              <div className="space-y-1">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[10px] text-blue-600 hover:underline break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Interests
              </h2>
              <div className="space-y-1">
                {data.hobbies.map((hobby, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">• {hobby}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Columns (2/3) */}
        <div className="col-span-2">
          {/* Summary / Career Objective */}
          {(data.summary || data.careerObjective) && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[10px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Experience
              </h2>
              <div className="space-y-2">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[11px] font-bold text-gray-900">{exp.role}</h3>
                      <span className="text-[9px] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-[10px] text-blue-600 mb-1">{exp.company}</p>
                    <p className="text-[10px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Projects
              </h2>
              <div className="space-y-2">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[11px] font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[9px] text-blue-600 hover:underline">
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-700 leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[9px] text-gray-500 mt-1">
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
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-1">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[11px] font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-[9px] text-gray-500">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <p className="text-[10px] text-gray-700">{edu.school}</p>
                    {edu.gpa && <p className="text-[9px] text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section className="mb-4 page-safe">
              <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                References
              </h2>
              <div className="space-y-1">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <section key={idx} className="mb-4 page-safe">
                  <h2 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-[10px] text-gray-700 leading-relaxed mb-1 break-words">
                      {section.description}
                    </p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[10px] text-gray-700 break-words">{item}</li>
                      ))}
                    </ul>
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