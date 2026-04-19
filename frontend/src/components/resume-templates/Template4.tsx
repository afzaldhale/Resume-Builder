import React from 'react';
import { ResumeData } from "./types";

interface Template4Props {
  data: ResumeData;
}

const Template4: React.FC<Template4Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white font-sans">
      {/* Dark Header */}
      <header className="bg-slate-800 text-white p-8 page-safe">
        <h1 className="text-3xl font-bold mb-2 break-words">
          {data.fullName || 'Your Name'}
        </h1>
        <h2 className="text-xl text-blue-300 mb-4 break-words">
          {data.role || 'Professional Title'}
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-300">
          {data.email && <span className="break-words">{data.email}</span>}
          {data.phone && <span className="break-words">{data.phone}</span>}
          {data.address && <span className="break-words">{data.address}</span>}
        </div>
      </header>

      <div className="p-8">
        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
              {isFresher ? 'Career Objective' : 'Professional Summary'}
            </h2>
            <p className="text-[11px] text-gray-700 leading-relaxed break-words">
              {isFresher ? data.careerObjective : data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[12px] font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium mb-1">{exp.company}</p>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[12px] font-bold text-slate-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                        Link
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-[10px] text-slate-600">
                      <span className="font-medium">Tech:</span> {project.technologies.join(' • ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout for remaining sections */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[12px] font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-[11px] text-slate-700">{edu.school}</p>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{edu.startYear} - {edu.endYear}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Skills
                </h2>
                <div className="space-y-1">
                  {data.skills.map((skill, idx) => (
                    <div key={idx} className="text-[11px] text-gray-700 break-words">
                      • {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strengths (Fresher) */}
            {isFresher && data.strengths && data.strengths.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Strengths
                </h2>
                <div className="space-y-1">
                  {data.strengths.map((strength, idx) => (
                    <div key={idx} className="text-[11px] text-gray-700 break-words">
                      • {strength}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div>
            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Languages
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] break-words">
                      <span className="font-medium text-slate-900">{lang.language}</span>
                      <span className="text-slate-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="break-words">
                      <h3 className="text-[12px] font-bold text-slate-900">{cert.name}</h3>
                      <p className="text-[11px] text-slate-700">{cert.issuer}</p>
                      <p className="text-[10px] text-slate-500">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Online Presence
                </h2>
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
              </section>
            )}

            {/* Hobbies (Fresher) */}
            {isFresher && data.hobbies && data.hobbies.length > 0 && (
              <section className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
                  Interests
                </h2>
                <div className="space-y-1">
                  {data.hobbies.map((hobby, idx) => (
                    <div key={idx} className="text-[11px] text-gray-700 break-words">
                      • {hobby}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
              References
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map((ref, idx) => (
                <p key={idx} className="text-[11px] text-gray-700 break-words">
                  {ref}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section, idx) => (
              <section key={idx} className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2">
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
                      <li key={i} className="text-[11px] text-gray-700 break-words">
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
    </div>
  );
};

export default Template4;