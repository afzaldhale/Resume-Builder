import React from 'react';
import { ResumeData } from './types';

interface Template12Props {
  data: ResumeData;
}

const Template12: React.FC<Template12Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-gray-50 p-6 font-sans">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4 page-safe">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-blue-600 mb-3 break-words">
          {data.role || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-600">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column Cards */}
        <div className="col-span-1 space-y-4">
          {/* Skills Card */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-md break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths Card (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Strengths</h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words">• {strength}</p>
                ))}
              </div>
            </div>
          )}

          {/* Languages Card */}
          {data.languages && data.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Languages</h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[11px] font-medium text-gray-900">{lang.language}</p>
                    <p className="text-[10px] text-gray-500">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Card */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Connect</h2>
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
            </div>
          )}

          {/* Hobbies Card (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Interests</h2>
              <div className="space-y-1">
                {data.hobbies.map((hobby, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words">• {hobby}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column Cards */}
        <div className="col-span-2 space-y-4">
          {/* Summary Card */}
          {(data.summary || data.careerObjective) && (
            <div className="bg-white rounded-lg shadow-sm p-5 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[11px] text-gray-700 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </div>
          )}

          {/* Experience Card */}
          {data.experience && data.experience.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-5 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[12px] font-bold text-gray-900">{exp.role}</h3>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-600 mb-2">{exp.company}</p>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {data.projects && data.projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-5 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Projects</h2>
              <div className="space-y-4">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[12px] font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                          View →
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed mb-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[9px] bg-gray-100 px-2 py-1 text-gray-600 rounded">
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
          <div className="grid grid-cols-2 gap-4">
            {/* Education Card */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
                <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">Education</h2>
                <div className="space-y-3">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-[11px] text-gray-700">{edu.school}</p>
                      <p className="text-[10px] text-gray-500">
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
              <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
                <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[11px] font-bold text-gray-900">{cert.name}</h3>
                      <p className="text-[10px] text-gray-600">{cert.issuer}</p>
                      <p className="text-[9px] text-gray-500">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* References Card */}
          {data.references && data.references.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 page-safe">
              <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">References</h2>
              <div className="grid grid-cols-2 gap-3">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words">{ref}</p>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections Cards */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 page-safe">
                  <h2 className="text-[13px] font-semibold text-gray-800 border-b pb-2 mb-3">
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

export default Template12;