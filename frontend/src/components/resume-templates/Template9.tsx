import React from 'react';
import { ResumeData } from './types';

interface Template9Props {
  data: ResumeData;
}

const Template9: React.FC<Template9Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 font-sans">
      {/* Fresh Header with Icon Style */}
      <header className="mb-6 page-safe text-center">
        <div className="inline-block mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto"></div>
        </div>
        <p className="text-lg text-blue-600 mb-3 break-words">
          {data.role || 'Aspiring Professional'}
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-gray-600">
          {data.email && <span className="break-words">📧 {data.email}</span>}
          {data.phone && <span className="break-words">📱 {data.phone}</span>}
          {data.address && <span className="break-words">📍 {data.address}</span>}
        </div>
      </header>

      {/* Career Objective (Fresher Focus) */}
      {(data.careerObjective || data.summary) && (
        <section className="mb-5 page-safe bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
            <span className="mr-2">🎯</span>
            {isFresher ? 'Career Objective' : 'Professional Summary'}
          </h2>
          <p className="text-[11px] text-gray-700 leading-relaxed break-words">
            {isFresher ? data.careerObjective : data.summary}
          </p>
        </section>
      )}

      {/* Education (Highlighted for Freshers) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5 page-safe bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-blue-600 mb-3 flex items-center">
            <span className="mr-2">📚</span>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="break-words border-l-2 border-blue-300 pl-3">
                <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-[11px] text-blue-600">{edu.school}</p>
                <div className="flex gap-4 text-[10px] text-gray-500 mt-1">
                  <span>{edu.startYear} - {edu.endYear}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">💻</span>
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-blue-50 px-3 py-1.5 rounded-md text-blue-700 font-medium break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">💪</span>
                Strengths
              </h2>
              <div className="space-y-1">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[11px] text-gray-700 break-words flex items-start">
                    <span className="text-blue-500 mr-2">▹</span>
                    {strength}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">🌐</span>
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] break-words">
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
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">🚀</span>
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <h3 className="text-[12px] font-bold text-gray-900">{project.name}</h3>
                    <p className="text-[11px] text-gray-700 leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[9px] bg-gray-100 px-2 py-0.5 text-gray-600 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} className="text-[10px] text-blue-600 hover:underline block mt-1">
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
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">📜</span>
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

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="mb-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">🎨</span>
                Interests & Hobbies
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-purple-50 px-3 py-1 rounded-full text-purple-700 break-words"
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
        <section className="mt-4 page-safe bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
            <span className="mr-2">💼</span>
            {isFresher ? 'Internships' : 'Professional Experience'}
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="break-words">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-[10px] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[11px] text-blue-600">{exp.company}</p>
                <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      {data.socialLinks && data.socialLinks.length > 0 && (
        <section className="mt-4 page-safe bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
            <span className="mr-2">🔗</span>
            Connect With Me
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="text-[11px] text-blue-600 hover:underline break-words"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {data.references && data.references.length > 0 && (
        <section className="mt-4 page-safe bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
            <span className="mr-2">👥</span>
            References
          </h2>
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
            <section key={idx} className="mt-4 page-safe bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-[13px] font-bold text-blue-600 mb-2 flex items-center">
                <span className="mr-2">✨</span>
                {section.title}
              </h2>
              {section.description && (
                <p className="text-[11px] text-gray-700 leading-relaxed mb-2 break-words">
                  {section.description}
                </p>
              )}
              {section.items && section.items.length > 0 && (
                <ul className="space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-[11px] text-gray-700 break-words flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default Template9;