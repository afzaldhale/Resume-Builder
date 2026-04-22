import React from 'react';
import { ResumeData } from './types';

interface Template14Props {
  data: ResumeData;
}

const Template14: React.FC<Template14Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-gradient-to-br from-rose-50 via-white to-sky-50 p-4 font-sans flex flex-col overflow-hidden">
      {/* Soft Header */}
      <header className="mb-3 page-safe flex-shrink-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-light text-gray-800 mb-1 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-rose-500 mb-2 break-words">
            {data.role || 'Professional Title'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[9px] text-gray-600">
            {data.email && <span className="break-words">{data.email}</span>}
            {data.phone && <span className="break-words">{data.phone}</span>}
            {data.address && <span className="break-words">{data.address}</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto min-h-0">
        {/* Left Column - Soft Cards */}
        <div className="col-span-1 space-y-3">
          {/* Summary Card */}
          {(data.summary || data.careerObjective) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-1.5 flex items-center">
                <span className="w-1 h-3 bg-rose-400 rounded-full mr-1.5"></span>
                {isFresher ? 'Objective' : 'Summary'}
              </h2>
              <p className="text-[9px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          )}

          {/* Skills Card */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-sky-400 rounded-full mr-1.5"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] bg-gradient-to-r from-rose-50 to-sky-50 px-2 py-1 rounded-lg text-gray-700 border border-gray-100 break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-purple-400 rounded-full mr-1.5"></span>
                Strengths
              </h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words flex items-start">
                    <span className="text-purple-400 mr-1.5 text-[8px]">●</span>
                    {strength}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Languages Card */}
          {data.languages && data.languages.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-emerald-400 rounded-full mr-1.5"></span>
                Languages
              </h2>
              <div className="space-y-1.5">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-gray-800">{lang.language}</span>
                      <span className="text-[7px] text-gray-500">{lang.level}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-0.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-400 to-sky-400 h-0.5 rounded-full"
                        style={{
                          width: lang.level === 'Native' ? '100%' : 
                                 lang.level === 'Fluent' ? '85%' : 
                                 lang.level === 'Intermediate' ? '65%' : '45%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Card */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-amber-400 rounded-full mr-1.5"></span>
                Connect
              </h2>
              <div className="space-y-1">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[9px] text-sky-600 hover:text-rose-500 transition-colors break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2 space-y-3">
          {/* Experience Card */}
          {data.experience && data.experience.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-rose-400 rounded-full mr-1.5"></span>
                Experience
              </h2>
              <div className="space-y-2.5">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-1">
                      <h3 className="text-[10px] font-semibold text-gray-900">{exp.role}</h3>
                      <span className="text-[7px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[9px] text-rose-500 mb-1">{exp.company}</p>
                    <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {data.projects && data.projects.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-sky-400 rounded-full mr-1.5"></span>
                Projects
              </h2>
              <div className="space-y-2.5">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-0.5 flex-wrap gap-1">
                      <h3 className="text-[10px] font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[7px] text-sky-600 hover:text-rose-500">
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-700 leading-relaxed mb-1">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[7px] bg-gray-50 px-1.5 py-0.5 rounded-md text-gray-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Card */}
          {data.education && data.education.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-purple-400 rounded-full mr-1.5"></span>
                Education
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="text-[10px] font-semibold text-gray-900">{edu.degree}</h3>
                      <span className="text-[7px] text-gray-500">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <p className="text-[9px] text-sky-600">{edu.school}</p>
                    {edu.gpa && <p className="text-[7px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Additional Info Row */}
          <div className="grid grid-cols-2 gap-3">
            {data.certifications && data.certifications.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full mr-1.5"></span>
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[9px] font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-[7px] text-gray-600">{cert.issuer} • {cert.year}</p>
                      {cert.credentialId && (
                        <p className="text-[6px] text-gray-400">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-1 h-3 bg-amber-400 rounded-full mr-1.5"></span>
                  Interests
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] bg-gradient-to-r from-amber-50 to-rose-50 px-2 py-1 rounded-lg text-gray-700 break-words"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* References Card */}
          {data.references && data.references.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-3 bg-gray-400 rounded-full mr-1.5"></span>
                References
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[8px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 page-safe">
                  <h2 className="text-[11px] font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="w-1 h-3 bg-indigo-400 rounded-full mr-1.5"></span>
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
                    <p className="text-[7px] text-gray-500 mt-0.5">{section.date}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template14;