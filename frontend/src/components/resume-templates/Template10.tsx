import React from 'react';
import { ResumeData } from './types';

interface Template10Props {
  data: ResumeData;
}

const Template10: React.FC<Template10Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] h-[1123px] bg-white font-sans flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar - 1/3 width */}
        <div className="w-[35%] bg-slate-900 p-6 text-white page-safe flex flex-col">
          {/* Name and Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 break-words leading-tight">
              {data.fullName || 'Your Name'}
            </h1>
            <p className="text-sm text-blue-400 font-medium break-words">
              {data.role || 'Professional'}
            </p>
          </div>

          {/* Contact */}
          <section className="mb-5 page-safe">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Contact
            </h2>
            <div className="space-y-2">
              {data.email && (
                <p className="text-[10px] text-slate-300 break-words">{data.email}</p>
              )}
              {data.phone && (
                <p className="text-[10px] text-slate-300 break-words">{data.phone}</p>
              )}
              {data.address && (
                <p className="text-[10px] text-slate-300 break-words">{data.address}</p>
              )}
            </div>
          </section>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Expertise
              </h2>
              <div className="space-y-1.5">
                {data.skills.map((skill, idx) => (
                  <p key={idx} className="text-[10px] text-slate-300 break-words">
                    {skill}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Strengths (Fresher) */}
          {isFresher && data.strengths && data.strengths.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Strengths
              </h2>
              <div className="space-y-1.5">
                {data.strengths.map((strength, idx) => (
                  <p key={idx} className="text-[10px] text-slate-300 break-words">
                    {strength}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="break-words">
                    <p className="text-[10px] text-white font-medium">{lang.language}</p>
                    <p className="text-[9px] text-slate-400">{lang.level}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Connect
              </h2>
              <div className="space-y-1.5">
                {data.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    className="block text-[10px] text-blue-400 hover:text-blue-300 break-words"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies (Fresher) */}
          {isFresher && data.hobbies && data.hobbies.length > 0 && (
            <section className="page-safe flex-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Interests
              </h2>
              <div className="space-y-1">
                {data.hobbies.map((hobby, idx) => (
                  <p key={idx} className="text-[10px] text-slate-300 break-words">
                    {hobby}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Content - 2/3 width */}
        <div className="w-[65%] p-7 bg-white page-safe flex flex-col">
          {/* Summary / Career Objective */}
          {(data.summary || data.careerObjective) && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                {isFresher ? 'Career Objective' : 'Professional Summary'}
              </h2>
              <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                {isFresher ? data.careerObjective : data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-600 font-medium mb-1.5">{exp.company}</p>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{project.name}</h3>
                      {project.link && (
                        <a 
                          href={project.link} 
                          className="text-[9px] text-blue-600 hover:underline"
                        >
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed mb-1.5">
                      {project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-[9px] text-slate-500">
                        {project.technologies.join(' • ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {edu.startYear} - {edu.endYear}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700">{edu.school}</p>
                    {edu.gpa && (
                      <p className="text-[9px] text-slate-500 mt-0.5">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="break-words">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-slate-900">{cert.name}</h3>
                      <span className="text-[9px] text-slate-500 font-mono">{cert.year}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-[8px] text-slate-400 mt-0.5">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <section className="mb-5 page-safe">
              <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                References
              </h2>
              <div className="space-y-1.5">
                {data.references.map((ref, idx) => (
                  <p key={idx} className="text-[10px] text-slate-600 break-words">{ref}</p>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="flex-1 flex flex-col justify-end">
              {data.customSections.map((section, idx) => (
                <section key={idx} className="page-safe">
                  <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-[10px] text-slate-600 leading-relaxed mb-2 break-words">
                      {section.description}
                    </p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-[10px] text-slate-600 break-words">{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.date && (
                    <p className="text-[9px] text-slate-500 mt-1">{section.date}</p>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template10;