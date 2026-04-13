import React from "react";
import { ResumeData } from "./types";

interface Template10Props {
  data: ResumeData;
}

const Template10: React.FC<Template10Props> = ({ data }) => {
  // Check if fresher
  const isFresher = data.experience.length === 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-gray-800 w-[794px] min-h-[1123px] mx-auto relative overflow-hidden font-sans border border-gray-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400"></div>
        <div className="absolute top-1/4 right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-48 h-48 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-12 py-10">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <div className="text-xl text-gray-600 font-medium">
                {data.role}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {data.email && (
              <div className="text-gray-700">
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div>{data.email}</div>
              </div>
            )}
            
            {data.phone && (
              <div className="text-gray-700">
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div>{data.phone}</div>
              </div>
            )}
            
            {data.address && (
              <div className="text-gray-700">
                <div className="text-sm text-gray-500 mb-1">Address</div>
                <div>{data.address}</div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
              {data.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-4"></div>
        </header>

        {/* Summary/Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isFresher ? "Career Objective" : "Professional Summary"}
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed text-center">
                {isFresher ? (data.careerObjective || data.summary) : (data.summary || data.careerObjective)}
              </p>
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Skills
                </h2>
                <div className="space-y-3">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                      <div className="text-gray-700">{skill}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Education
                </h2>
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="font-bold text-gray-900 text-lg mb-2">{edu.degree}</div>
                      <div className="text-gray-600 mb-3">{edu.school}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-sm">
                          {edu.startYear} - {edu.endYear}
                        </div>
                        {edu.gpa && (
                          <div className="text-blue-600 font-semibold">GPA: {edu.gpa}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Languages
                </h2>
                <div className="space-y-4">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="text-gray-700">{lang.language}</div>
                      <div className="text-gray-600">{lang.level}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Certifications
                </h2>
                <div className="space-y-4">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="font-semibold text-gray-900 mb-2">{cert.name}</div>
                      <div className="flex justify-between text-sm">
                        <div className="text-gray-600">{cert.issuer}</div>
                        <div className="text-gray-500">{cert.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Experience
                </h2>
                <div className="space-y-8">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-0 top-3 w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-gray-900 text-xl mb-2">{exp.role}</div>
                            <div className="text-gray-600">{exp.company}</div>
                          </div>
                          <div className="text-gray-500 text-sm">
                            {exp.startDate} - {exp.endDate}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                  Projects
                </h2>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-gray-900 text-xl">{project.name}</div>
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100"
                            >
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

            {/* Additional Sections */}
            <div className="space-y-12">
              {/* Strengths */}
              {data.strengths && data.strengths.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                    Strengths
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {data.strengths.map((strength, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-gray-700 text-center">{strength}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hobbies */}
              {data.hobbies && data.hobbies.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                    Hobbies & Interests
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {data.hobbies.map((hobby, index) => (
                      <div 
                        key={index}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100"
                      >
                        {hobby}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {data.references && data.references.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                    References
                  </h2>
                  <div className="space-y-4">
                    {data.references.map((ref, index) => (
                      <div key={index} className="text-gray-700 italic">
                        "{ref}"
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Custom Sections */}
              {data.customSections && data.customSections.length > 0 && (
                <div className="space-y-8">
                  {data.customSections.map((section, index) => (
                    <section key={index}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                        {section.title}
                      </h2>
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        {section.description && (
                          <p className="text-gray-700 mb-4">{section.description}</p>
                        )}
                        {section.items && section.items.length > 0 && (
                          <div className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                                <div className="text-gray-700">{item}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-300">
          <div className="text-center">
            <div className="text-gray-600 mb-3">
              {data.fullName || "Your Name"} • Professional Resume
            </div>
            <div className="text-gray-500 text-sm">
              Template 10 • Modern Clean Design • {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Template10;