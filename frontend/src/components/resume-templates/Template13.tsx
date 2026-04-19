import React from 'react';
import { ResumeData } from './types';

interface Template13Props {
  data: ResumeData;
}

const Template13: React.FC<Template13Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white font-sans">
      {/* Bold Header with Background */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 page-safe">
        <h1 className="text-4xl font-bold mb-2 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-blue-100 mb-4 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-blue-50">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      <div className="p-8">
        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-6 page-safe">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h2 className="text-[13px] font-bold text-blue-900 mb-2">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[11px] text-gray-800 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Skills
                </h2>
                <div className="space-y-2">
                  {data.skills.map((skill, idx) => (
                    <div key={idx} className="break-words">
                      <p className="text-[11px] font-medium text-gray-900">{skill}</p>
                      <div className="w-full bg-gray-200 h-1.5 mt-1 rounded-full">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths (Fresher) */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Strengths
                </h2>
                <div className="space-y-2">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[11px] text-gray-700 break-words flex items-center">
                      <span className="text-blue-600 mr-2">▸</span>
                      {strength}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Languages
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-medium text-gray-900">{lang.language}</span>
                        <span className="text-[10px] text-gray-600">{lang.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
                          style={{
                            width: lang.level === 'Native' ? '100%' : 
                                   lang.level === 'Fluent' ? '90%' : 
                                   lang.level === 'Intermediate' ? '70%' : '50%'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-[13px] font-bold text-gray-900">{exp.role}</h3>
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-600 font-medium mb-2">{exp.company}</p>
                      <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Key Projects
                </h2>
                <div className="space-y-4">
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-[13px] font-bold text-gray-900">{project.name}</h3>
                        {project.link && (
                          <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed mb-2">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-[10px] bg-gradient-to-r from-blue-50 to-purple-50 px-2 py-1 text-gray-700 rounded">
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

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                        <span className="text-[10px] text-gray-600">{edu.startYear} - {edu.endYear}</span>
                      </div>
                      <p className="text-[11px] text-purple-600">{edu.school}</p>
                      {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Social Links Row */}
            <div className="grid grid-cols-2 gap-4">
              {data.certifications && data.certifications.length > 0 && (
                <section className="page-safe">
                  <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                    Certifications
                  </h2>
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

              {data.socialLinks && data.socialLinks.length > 0 && (
                <section className="page-safe">
                  <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                    Connect
                  </h2>
                  <div className="space-y-2">
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

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <section className="mt-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.map((hobby, idx) => (
                    <span key={idx} className="text-[11px] bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full text-gray-700 break-words">
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {data.references && data.references.length > 0 && (
              <section className="mt-5 page-safe">
                <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                  References
                </h2>
                <div className="grid grid-cols-2 gap-3">
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
                  <section key={idx} className="mt-5 page-safe">
                    <h2 className="text-[13px] font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-3">
                      {section.title}
                    </h2>
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
    </div>
  );
};

export default Template13;