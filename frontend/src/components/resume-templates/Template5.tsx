import React from 'react';
import { ResumeData } from "./types";

interface Template5Props {
  data: ResumeData;
}

const Template5: React.FC<Template5Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-white p-6 font-serif flex flex-col overflow-hidden">
      {/* Minimal Header */}
      <header className="mb-4 page-safe text-center flex-shrink-0">
        <h1 className="text-2xl font-normal tracking-wide text-gray-900 mb-0.5 break-words uppercase">
          {data.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[10px] text-gray-700 mb-1.5">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
        {data.role && (
          <p className="text-[11px] text-gray-800 font-medium break-words">{data.role}</p>
        )}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              {isFresher ? 'Career Objective' : 'Professional Summary'}
            </h2>
            <p className="text-[10px] text-gray-800 leading-relaxed break-words">
              {isFresher ? data.careerObjective : data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Experience
            </h2>
            <div className="space-y-2">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-words">
                  <div className="mb-0.5">
                    <h3 className="text-[11px] font-bold text-gray-900">{exp.role}</h3>
                    <div className="flex justify-between text-[10px] text-gray-700 flex-wrap gap-1">
                      <span className="italic">{exp.company}</span>
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-800 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Education
            </h2>
            <div className="space-y-1.5">
              {data.education.map((edu, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="text-[11px] font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-[10px] text-gray-700">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <p className="text-[10px] text-gray-700">{edu.school}</p>
                  {edu.gpa && <p className="text-[9px] text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Skills
            </h2>
            <p className="text-[10px] text-gray-800 leading-relaxed break-words">
              {data.skills.join(' • ')}
            </p>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Projects
            </h2>
            <div className="space-y-2">
              {data.projects.map((project, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="text-[11px] font-bold text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-[9px] text-gray-700 underline">
                        Link
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-800 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-[9px] text-gray-700 mt-0.5">
                      Tech: {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strengths (Fresher) */}
        {isFresher && data.strengths && data.strengths.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Core Strengths
            </h2>
            <p className="text-[10px] text-gray-800 leading-relaxed break-words">
              {data.strengths.join(' • ')}
            </p>
          </section>
        )}

        {/* Languages & Certifications Row */}
        <div className="grid grid-cols-2 gap-4">
          {data.languages && data.languages.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                Languages
              </h2>
              <div className="space-y-0.5">
                {data.languages.map((lang, idx) => (
                  <p key={idx} className="text-[10px] text-gray-800 break-words">
                    {lang.language}: {lang.level}
                  </p>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-3 page-safe">
              <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                Certifications
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[10px] text-gray-800 font-medium">{cert.name}</p>
                    <p className="text-[9px] text-gray-600">{cert.issuer}</p>
                    <p className="text-[8px] text-gray-500">{cert.year}</p>
                    {cert.credentialId && (
                      <p className="text-[8px] text-gray-400">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Online Profiles
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5">
              {data.socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className="text-[10px] text-gray-800 underline break-words"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies (Fresher) */}
        {isFresher && data.hobbies && data.hobbies.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              Interests
            </h2>
            <p className="text-[10px] text-gray-800 leading-relaxed break-words">
              {data.hobbies.join(' • ')}
            </p>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-3 page-safe">
            <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
              References
            </h2>
            <div className="space-y-0.5">
              {data.references.map((ref, idx) => (
                <p key={idx} className="text-[10px] text-gray-800 break-words">{ref}</p>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section, idx) => (
              <section key={idx} className="mb-3 page-safe">
                <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wide mb-1.5">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-[10px] text-gray-800 leading-relaxed mb-1 break-words">
                    {section.description}
                  </p>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[10px] text-gray-800 break-words">{item}</li>
                    ))}
                  </ul>
                )}
                {section.date && (
                  <p className="text-[9px] text-gray-600 mt-0.5">{section.date}</p>
                )}
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Template5;