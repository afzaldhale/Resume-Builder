import React from 'react';
import { ResumeData } from './types';

interface Template11Props {
  data: ResumeData;
}

const Template11: React.FC<Template11Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-8 font-sans">
      {/* Header */}
      <header className="mb-8 page-safe">
        <div className="flex items-baseline justify-between border-b-2 border-blue-600 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 break-words">
              {data.fullName || 'Your Name'}
            </h1>
            <p className="text-lg text-blue-600 break-words">
              {data.role || 'Professional Title'}
            </p>
          </div>
          <div className="text-right">
            {data.email && <p className="text-[11px] text-gray-600 break-words">{data.email}</p>}
            {data.phone && <p className="text-[11px] text-gray-600 break-words">{data.phone}</p>}
            {data.address && <p className="text-[11px] text-gray-600 break-words">{data.address}</p>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Skills</h2>
              <div className="space-y-2">
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[11px] font-medium text-gray-900">{skill}</p>
                    <div className="w-full bg-gray-200 h-1 mt-1">
                      <div className="bg-blue-600 h-1 w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Strengths</h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Languages</h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[11px] font-medium text-gray-900">{lang.language}</p>
                    <p className="text-[10px] text-gray-600">{lang.level}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Connect</h2>
              <div className="space-y-1">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[11px] text-blue-600 hover:underline break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Content */}
        <div className="col-span-2">
          {/* Summary */}
          {(data.summary || data.careerObjective) && (
            <section className="mb-6 page-safe">
              <p className="text-[11px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </section>
          )}

          {/* Timeline Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-4">Experience Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                <div className="space-y-4">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-10 break-words">
                      <div className="absolute left-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-[12px] font-bold text-gray-900">{exp.role}</h3>
                        <p className="text-[11px] text-blue-600 mb-1">{exp.company}</p>
                        <p className="text-[10px] text-gray-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Education</h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-blue-300 pl-3 break-words">
                    <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-[11px] text-gray-700">{edu.school}</p>
                    <p className="text-[10px] text-gray-500">
                      {edu.startYear} - {edu.endYear}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Projects</h2>
              <div className="space-y-3">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[12px] font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[9px] bg-gray-100 px-2 py-0.5 text-gray-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="break-words">
                    <h3 className="text-[11px] font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-[10px] text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby, idx) => (
                  <span key={idx} className="text-[11px] text-gray-700 break-words">
                    {hobby}{idx < data.hobbies!.length - 1 ? ' •' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section className="mb-6 page-safe">
              <h2 className="text-[13px] font-bold text-gray-800 mb-3">References</h2>
              <div className="space-y-1">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <section key={idx} className="mb-6 page-safe">
                  <h2 className="text-[13px] font-bold text-gray-800 mb-3">{section.title}</h2>
                  {section.description && (
                    <p className="text-[11px] text-gray-700 leading-relaxed mb-2 break-words">
                      {section.description}
                    </p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[11px] text-gray-700 break-words">{item}</li>
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

export default Template11;