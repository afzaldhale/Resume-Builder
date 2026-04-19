import React from 'react';
import { ResumeData } from './types';

interface Template7Props {
  data: ResumeData;
}

const Template7: React.FC<Template7Props> = ({ data }) => {
  const isFresher = data.candidateType === 'fresher';

  return (
    <div className="w-[794px] min-h-[1123px] bg-white font-sans flex">
      {/* Left Main Content */}
      <div className="w-[65%] p-6">
        {/* Header */}
        <header className="mb-6 page-safe">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 break-words">
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-blue-600 mb-3 break-words">
            {data.role || 'Professional Title'}
          </p>
        </header>

        {/* Summary / Career Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide mb-2">
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
            <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[12px] font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-[10px] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] text-blue-600 mb-1">{exp.company}</p>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide mb-2">
              Featured Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-bold text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-[10px] text-blue-600 hover:underline">
                        View Project
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="break-words">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-[10px] text-gray-500">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <p className="text-[11px] text-gray-700">{edu.school}</p>
                  {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {data.customSections && data.customSections.length > 0 && (
          <>
            {data.customSections.map((section, idx) => (
              <section key={idx} className="mb-5 page-safe">
                <h2 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide mb-2">
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

      {/* Right Sidebar */}
      <div className="w-[35%] bg-gradient-to-b from-blue-50 to-white p-6 page-safe">
        {/* Contact Info */}
        <section className="mb-5 page-safe">
          <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
            Contact
          </h2>
          <div className="space-y-2">
            {data.email && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Email</p>
                <p className="text-[11px] text-gray-800 break-words">{data.email}</p>
              </div>
            )}
            {data.phone && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Phone</p>
                <p className="text-[11px] text-gray-800 break-words">{data.phone}</p>
              </div>
            )}
            {data.address && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Address</p>
                <p className="text-[11px] text-gray-800 break-words">{data.address}</p>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span key={idx} className="text-[11px] bg-white px-3 py-1 shadow-sm text-gray-700 break-words">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Strengths (Fresher) */}
        {isFresher && data.strengths && data.strengths.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Strengths
            </h2>
            <div className="space-y-1">
              {data.strengths.map((strength, idx) => (
                <p key={idx} className="text-[11px] text-gray-700 break-words">• {strength}</p>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Languages
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="break-words">
                  <p className="text-[11px] font-medium text-gray-800">{lang.language}</p>
                  <p className="text-[10px] text-gray-600">{lang.level}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className="break-words">
                  <p className="text-[11px] font-medium text-gray-800">{cert.name}</p>
                  <p className="text-[10px] text-gray-600">{cert.issuer}, {cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Social
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
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((hobby, idx) => (
                <span key={idx} className="text-[11px] text-gray-700 break-words">
                  {hobby}{idx < data.hobbies!.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-5 page-safe">
            <h2 className="text-[13px] font-semibold text-gray-800 border-b-2 border-blue-600 pb-1 mb-3">
              References
            </h2>
            <div className="space-y-2">
              {data.references.map((ref, idx) => (
                <p key={idx} className="text-[11px] text-gray-700 break-words">{ref}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Template7;