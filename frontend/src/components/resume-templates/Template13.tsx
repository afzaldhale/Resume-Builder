import React from 'react';
import { ResumeData } from './types';

interface Template13Props {
  data: ResumeData;
}

const Template13: React.FC<Template13Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-white font-sans flex flex-col overflow-hidden">
      {/* Bold Header with Background */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 page-safe flex-shrink-0">
        <h1 className="text-3xl font-bold mb-1 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-base text-blue-100 mb-2 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-blue-50">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      <div className="p-5 flex-1 overflow-y-auto min-h-0">
        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-4 page-safe">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-3">
              <h2 className="text-[11px] font-bold text-blue-900 mb-1.5">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[9px] text-gray-800 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="col-span-1">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Skills
                </h2>
                <div className="space-y-1.5">
                  {data.skills.map((skill, idx) => (
                    <div key={idx} className="break-words">
                      <p className="text-[9px] font-medium text-gray-900">{skill}</p>
                      <div className="w-full bg-gray-200 h-1 mt-0.5 rounded-full">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths (Fresher) */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Strengths
                </h2>
                <div className="space-y-1">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[9px] text-gray-700 break-words flex items-center">
                      <span className="text-blue-600 mr-1.5">▸</span>
                      {strength}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Languages
                </h2>
                <div className="space-y-1.5">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[9px] font-medium text-gray-900">{lang.language}</span>
                        <span className="text-[8px] text-gray-600">{lang.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-0.5 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-0.5 rounded-full"
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
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Professional Experience
                </h2>
                <div className="space-y-2.5">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-1">
                        <h3 className="text-[10px] font-bold text-gray-900">{exp.role}</h3>
                        <span className="text-[8px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-[9px] text-purple-600 font-medium mb-1">{exp.company}</p>
                      <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Key Projects
                </h2>
                <div className="space-y-2.5">
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-1">
                        <h3 className="text-[10px] font-bold text-gray-900">{project.name}</h3>
                        {project.link && (
                          <a href={project.link} className="text-[8px] text-blue-600 hover:underline">
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-700 leading-relaxed mb-1">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-[7px] bg-gradient-to-r from-blue-50 to-purple-50 px-1.5 py-0.5 text-gray-700 rounded">
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
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="break-words">
                      <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <h3 className="text-[10px] font-bold text-gray-900">{edu.degree}</h3>
                        <span className="text-[8px] text-gray-600">{edu.startYear} - {edu.endYear}</span>
                      </div>
                      <p className="text-[9px] text-purple-600">{edu.school}</p>
                      {edu.gpa && <p className="text-[8px] text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Social Links Row */}
            <div className="grid grid-cols-2 gap-3">
              {data.certifications && data.certifications.length > 0 && (
                <section className="page-safe">
                  <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                    Certifications
                  </h2>
                  <div className="space-y-1.5">
                    {data.certifications.map((cert, idx) => (
                      <div key={idx} className="break-words">
                        <h3 className="text-[9px] font-bold text-gray-900">{cert.name}</h3>
                        <p className="text-[8px] text-gray-600">{cert.issuer} • {cert.year}</p>
                        {cert.credentialId && (
                          <p className="text-[7px] text-gray-400">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.socialLinks && data.socialLinks.length > 0 && (
                <section className="page-safe">
                  <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                    Connect
                  </h2>
                  <div className="space-y-1">
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
            </div>

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <section className="mt-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.hobbies.map((hobby, idx) => (
                    <span key={idx} className="text-[9px] bg-gradient-to-r from-blue-50 to-purple-50 px-2 py-1 rounded-full text-gray-700 break-words">
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {data.references && data.references.length > 0 && (
              <section className="mt-4 page-safe">
                <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
                  References
                </h2>
                <div className="grid grid-cols-2 gap-2">
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
                  <section key={idx} className="mt-4 page-safe">
                    <h2 className="text-[11px] font-bold text-gray-900 border-b-2 border-blue-600 pb-1.5 mb-2">
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
    </div>
  );
};

export default Template13;