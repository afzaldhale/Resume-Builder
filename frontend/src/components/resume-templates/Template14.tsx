import React from 'react';
import { ResumeData } from './types';

interface Template14Props {
  data: ResumeData;
}

const Template14: React.FC<Template14Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-gradient-to-br from-rose-50 via-white to-sky-50 p-8 font-sans">
      {/* Soft Header */}
      <header className="mb-6 page-safe">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-light text-gray-800 mb-2 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-rose-500 mb-3 break-words">
            {data.role || 'Professional Title'}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-600">
            {data.email && <span className="break-words">{data.email}</span>}
            {data.phone && <span className="break-words">{data.phone}</span>}
            {data.address && <span className="break-words">{data.address}</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - Soft Cards */}
        <div className="col-span-1 space-y-4">
          {/* Summary Card */}
          {(data.summary || data.careerObjective) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                {isFresher ? 'Objective' : 'Summary'}
              </h2>
              <p className="text-[11px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          )}

          {/* Skills Card */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-sky-400 rounded-full mr-2"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-gradient-to-r from-rose-50 to-sky-50 px-3 py-1.5 rounded-lg text-gray-700 border border-gray-100 break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-purple-400 rounded-full mr-2"></span>
                Strengths
              </h2>
              <div className="space-y-1.5">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words flex items-start">
                    <span className="text-purple-400 mr-2 text-[10px]">●</span>
                    {strength}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Languages Card */}
          {data.languages && data.languages.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-emerald-400 rounded-full mr-2"></span>
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[11px] text-gray-800">{lang.language}</span>
                      <span className="text-[9px] text-gray-500">{lang.level}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-400 to-sky-400 h-1 rounded-full"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-amber-400 rounded-full mr-2"></span>
                Connect
              </h2>
              <div className="space-y-1.5">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[11px] text-sky-600 hover:text-rose-500 transition-colors break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2 space-y-4">
          {/* Experience Card */}
          {data.experience && data.experience.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-rose-400 rounded-full mr-2"></span>
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[12px] font-semibold text-gray-900">{exp.role}</h3>
                      <span className="text-[9px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-500 mb-2">{exp.company}</p>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {data.projects && data.projects.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-sky-400 rounded-full mr-2"></span>
                Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[12px] font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[9px] text-sky-600 hover:text-rose-500">
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed mb-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[9px] bg-gray-50 px-2 py-1 rounded-md text-gray-600">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-purple-400 rounded-full mr-2"></span>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-semibold text-gray-900">{edu.degree}</h3>
                      <span className="text-[9px] text-gray-500">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <p className="text-[11px] text-sky-600">{edu.school}</p>
                    {edu.gpa && <p className="text-[9px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Additional Info Row */}
          <div className="grid grid-cols-2 gap-4">
            {data.certifications && data.certifications.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
                <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-emerald-400 rounded-full mr-2"></span>
                  Certifications
                </h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[11px] font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-[9px] text-gray-600">{cert.issuer} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
                <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-amber-400 rounded-full mr-2"></span>
                  Interests
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gradient-to-r from-amber-50 to-rose-50 px-3 py-1.5 rounded-lg text-gray-700 break-words"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-gray-400 rounded-full mr-2"></span>
                References
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[10px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 page-safe">
                  <h2 className="text-[13px] font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-1 h-4 bg-indigo-400 rounded-full mr-2"></span>
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