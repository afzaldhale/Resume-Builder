import React from 'react';
import { ResumeData } from './types';

interface Template12Props {
  data: ResumeData;
}

const Template12: React.FC<Template12Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-gray-50 p-4 font-sans flex flex-col overflow-hidden">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3 page-safe flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-sm text-blue-600 mb-2 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-600">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto min-h-0">
        {/* Left Column Cards */}
        <div className="col-span-1 space-y-3">
          {/* Skills Card */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths Card (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Strengths</h2>
              <div className="space-y-0.5">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </div>
          )}

          {/* Languages Card */}
          {data.languages && data.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Languages</h2>
              <div className="space-y-1.5">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[9px] font-medium text-gray-900">{lang.language}</p>
                    <p className="text-[8px] text-gray-500">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Card */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Connect</h2>
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
            </div>
          )}

          {/* Hobbies Card (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Interests</h2>
              <div className="space-y-0.5">
                {data.hobbies.map((hobby, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">• {hobby}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column Cards */}
        <div className="col-span-2 space-y-3">
          {/* Summary Card */}
          {(data.summary || data.careerObjective) && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[9px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          )}

          {/* Experience Card */}
          {data.experience && data.experience.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">
                Professional Experience
              </h2>
              <div className="space-y-2.5">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-start mb-0.5 flex-wrap gap-1">
                      <h3 className="text-[10px] font-bold text-gray-900">{exp.role}</h3>
                      <span className="text-[8px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[9px] text-blue-600 mb-1">{exp.company}</p>
                    <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {data.projects && data.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Projects</h2>
              <div className="space-y-2.5">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-start mb-0.5 flex-wrap gap-1">
                      <h3 className="text-[10px] font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[8px] text-blue-600 hover:underline">
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-700 leading-relaxed mb-1">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[7px] bg-gray-100 px-1.5 py-0.5 text-gray-600 rounded">
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

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Education Card */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">Education</h2>
                <div className="space-y-2">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[10px] font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-[9px] text-gray-700">{edu.school}</p>
                      <p className="text-[8px] text-gray-500">
                        {edu.startYear} - {edu.endYear}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Card */}
            {data.certifications && data.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[9px] font-bold text-gray-900">{cert.name}</h3>
                      <p className="text-[8px] text-gray-600">{cert.issuer}</p>
                      <p className="text-[7px] text-gray-500">{cert.year}</p>
                      {cert.credentialId && (
                        <p className="text-[6px] text-gray-400">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* References Card */}
          {data.references && data.references.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-3 page-safe">
              <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">References</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[9px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections Cards */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-3 page-safe">
                  <h2 className="text-[11px] font-semibold text-gray-800 border-b pb-1.5 mb-2">
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
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template12;