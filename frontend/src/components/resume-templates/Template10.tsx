import React from 'react';
import { ResumeData } from './types';

interface Template10Props {
  data: ResumeData;
}

const Template10: React.FC<Template10Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-8 font-serif">
      {/* Centered Elegant Header */}
      <header className="mb-8 page-safe text-center">
        <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-wide break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-2 mb-3">
          <span className="text-gray-400">—</span>
          <p className="text-base text-gray-600 italic break-words">
            {data.role || 'Professional'}
          </p>
          <span className="text-gray-400">—</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-gray-500">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      {/* Summary / Career Objective */}
      {(data.summary || data.careerObjective) && (
        <section className="mb-6 page-safe max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {isFresher ? 'Career Objective' : 'Professional Summary'}
            </h2>
            <p className="text-[11px] text-gray-700 leading-relaxed break-words">
              {isFresher ? data.careerObjective : data.summary}
            </p>
          </div>
        </section>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="text-center break-words">
                  <h3 className="text-[13px] font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-[11px] text-gray-600 mb-1">{exp.company}</p>
                  <p className="text-[10px] text-gray-400 mb-2">{exp.startDate} - {exp.endDate}</p>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={idx} className="text-center break-words">
                  <h3 className="text-[13px] font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-[11px] text-gray-600">{edu.school}</p>
                  <p className="text-[10px] text-gray-400">
                    {edu.startYear} - {edu.endYear}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="text-[11px] text-gray-700 break-words">
                  {skill}{idx < data.skills.length - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, idx) => (
                <div key={idx} className="text-center break-words">
                  <h3 className="text-[13px] font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-[10px] text-gray-500 mb-1">
                      {project.technologies.join(' • ')}
                    </p>
                  )}
                  {project.link && (
                    <a href={project.link} className="text-[10px] text-gray-600 hover:underline">
                      {project.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column for Additional Sections */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* Strengths (Fresher) */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Strengths
                </h2>
                <div className="space-y-1 text-center">
                  {data.strengths.map((strength, idx) => (
                    <p key={idx} className="text-[11px] text-gray-700 break-words">{strength}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Languages
                </h2>
                <div className="space-y-1 text-center">
                  {data.languages.map((lang, idx) => (
                    <p key={idx} className="text-[11px] text-gray-700 break-words">
                      {lang.language} <span className="text-gray-500">({lang.level})</span>
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div>
            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Certifications
                </h2>
                <div className="space-y-2 text-center">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <p className="text-[11px] font-medium text-gray-900">{cert.name}</p>
                      <p className="text-[10px] text-gray-600">{cert.issuer}, {cert.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <section className="mb-4 page-safe">
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Interests
                </h2>
                <div className="text-center">
                  <p className="text-[11px] text-gray-700 break-words">
                    {data.hobbies.join(' • ')}
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Online Presence
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-[11px] text-gray-600 hover:underline break-words"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-6 page-safe">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              References
            </h2>
            <div className="space-y-1 text-center">
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
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-2 text-center break-words">
                    {section.description}
                  </p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-1 text-center">
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
  );
};

export default Template10;