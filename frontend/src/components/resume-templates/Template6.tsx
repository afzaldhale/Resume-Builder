import React from 'react';
import { ResumeData } from './types';

interface Template6Props {
  data: ResumeData;
}

const Template6: React.FC<Template6Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white font-sans flex">
      {/* Left Sidebar */}
      <div className="w-[35%] bg-slate-50 p-6 page-safe">
        {/* Name and Role in Sidebar */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-slate-900 mb-1 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-[12px] text-blue-600 font-medium break-words">
            {data.role || 'Professional'}
          </p>
        </div>

        {/* Contact */}
        <section className="mb-5 page-safe">
          <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            Contact
          </h2>
          <div className="space-y-2">
            {data.email && (
              <p className="text-[11px] text-slate-700 break-words">{data.email}</p>
            )}
            {data.phone && (
              <p className="text-[11px] text-slate-700 break-words">{data.phone}</p>
            )}
            {data.address && (
              <p className="text-[11px] text-slate-700 break-words">{data.address}</p>
            )}
          </div>
        </section>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Skills
            </h2>
            <div className="space-y-1">
              {data.skills.map((skill, idx) => (
                <p key={idx} className="text-[11px] text-slate-700 break-words">• {skill}</p>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="text-[11px] break-words">
                  <span className="font-medium text-slate-800">{lang.language}</span>
                  <span className="text-slate-600 ml-1">({lang.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strengths (Fresher) */}
        {isFresher && data.strengths && data.strengths.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Strengths
            </h2>
            <div className="space-y-1">
              {data.strengths.map((strength, idx) => (
                <p key={idx} className="text-[11px] text-slate-700 break-words">• {strength}</p>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Connect
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
            <h2 className="text-[13px] font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-3">
              Interests
            </h2>
            <div className="space-y-1">
              {data.hobbies.map((hobby, idx) => (
                <p key={idx} className="text-[11px] text-slate-700 break-words">• {hobby}</p>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Content */}
      <div className="w-[65%] p-6">
        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
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
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
              Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-words">
                  <h3 className="text-[12px] font-semibold text-slate-900">{exp.role}</h3>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[11px] text-blue-600">{exp.company}</p>
                    <span className="text-[10px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-semibold text-slate-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                        Link
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-[10px] text-slate-600 mt-1">
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
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-semibold text-slate-900">{edu.degree}</h3>
                    <span className="text-[10px] text-slate-500">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">{edu.school}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-semibold text-slate-900">{cert.name}</h3>
                    <span className="text-[10px] text-slate-500">{cert.year}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-[10px] text-slate-500">ID: {cert.credentialId}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
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
              <section key={idx} className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-slate-800 border-b-2 border-blue-600 pb-1 mb-2">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-1 break-words">
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
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Template6;