import React from 'react';
import { ResumeData } from './types';

interface Template9Props {
  data: ResumeData;
}

const Template9: React.FC<Template9Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-gradient-to-br from-blue-50 via-white to-purple-50 p-5 font-sans flex flex-col overflow-hidden">
      {/* Fresh Header with Icon Style */}
      <header className="mb-3 page-safe text-center flex-shrink-0">
        <div className="inline-block mb-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <div className="h-0.5 w-16 bg-blue-500 mx-auto"></div>
        </div>
        <p className="text-base text-blue-600 mb-2 break-words">
          {data.role || 'Aspiring Professional'}
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[9px] text-gray-600">
          {data.email && <span className="break-words">📧 {data.email}</span>}
          {data.phone && <span className="break-words">📱 {data.phone}</span>}
          {data.address && <span className="break-words">📍 {data.address}</span>}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Career Objective (Fresher Focus) */}
        {(data.careerObjective || data.summary) && (
          <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
              <span className="mr-1.5">🎯</span>
              {isFresher ? 'Career Objective' : 'Professional Summary'}
            </h2>
            <p className="text-[9px] text-gray-700 leading-relaxed break-words">
              {isFresher ? data.careerObjective : data.summary}
            </p>
          </section>
        )}

        {/* Education (Highlighted for Freshers) */}
        {data.education && data.education.length > 0 && (
          <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-[11px] font-bold text-blue-600 mb-2 flex items-center">
              <span className="mr-1.5">📚</span>
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="break-words border-l-2 border-blue-300 pl-2">
                  <h3 className="text-[10px] font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-[9px] text-blue-600">{edu.school}</p>
                  <div className="flex gap-3 text-[8px] text-gray-500 mt-0.5">
                    <span>{edu.startYear} - {edu.endYear}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div>
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">💻</span>
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-blue-50 px-2 py-1 rounded-md text-blue-700 font-medium break-words"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths (Fresher) */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">💪</span>
                  Strengths
                </h2>
                <div className="space-y-0.5">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[9px] text-gray-700 break-words flex items-start">
                      <span className="text-blue-500 mr-1.5">▹</span>
                      {strength}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">🌐</span>
                  Languages
                </h2>
                <div className="space-y-0.5">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between text-[9px] break-words">
                      <span className="font-medium text-gray-800">{lang.language}</span>
                      <span className="text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">🚀</span>
                  Projects
                </h2>
                <div className="space-y-2">
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[10px] font-bold text-gray-900">{project.name}</h3>
                      <p className="text-[9px] text-gray-700 leading-relaxed">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-[7px] bg-gray-100 px-1.5 py-0.5 text-gray-600 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} className="text-[8px] text-blue-600 hover:underline block mt-0.5">
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">📜</span>
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

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">🎨</span>
                  Interests & Hobbies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-purple-50 px-2 py-1 rounded-full text-purple-700 break-words"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Experience (If any - internships for freshers) */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
              <span className="mr-1.5">💼</span>
              {isFresher ? 'Internships' : 'Professional Experience'}
            </h2>
            <div className="space-y-2">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="text-[10px] font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-[8px] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[9px] text-blue-600">{exp.company}</p>
                  <p className="text-[9px] text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
              <span className="mr-1.5">🔗</span>
              Connect With Me
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-[9px] text-blue-600 hover:underline break-words"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
              <span className="mr-1.5">👥</span>
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
              <section key={idx} className="mb-3 page-safe bg-white rounded-lg p-3 shadow-sm">
                <h2 className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center">
                  <span className="mr-1.5">✨</span>
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-[9px] text-gray-700 leading-relaxed mb-1 break-words">
                    {section.description}
                  </p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-0.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[9px] text-gray-700 break-words flex items-start">
                        <span className="text-blue-500 mr-1.5">•</span>
                        {item}
                      </li>
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
  );
};

export default Template9;