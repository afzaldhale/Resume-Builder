import React from "react";
import { ResumeData } from "./types";

interface Template9Props {
  data: ResumeData;
}

const Template9: React.FC<Template9Props> = ({ data }) => {
  // Check if fresher
  const isFresher = data.candidateType === "fresher" || data.experience.length === 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-[794px] min-h-[1123px] mx-auto relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-12 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 tracking-wide">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <div className="text-xl text-gray-300 font-light tracking-wider">
                {data.role}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {data.email && (
              <div className="text-gray-300">
                <div className="text-sm text-gray-400 mb-1">EMAIL</div>
                <div>{data.email}</div>
              </div>
            )}
            
            {data.phone && (
              <div className="text-gray-300">
                <div className="text-sm text-gray-400 mb-1">PHONE</div>
                <div>{data.phone}</div>
              </div>
            )}
            
            {data.address && (
              <div className="text-gray-300">
                <div className="text-sm text-gray-400 mb-1">LOCATION</div>
                <div>{data.address}</div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {data.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-white hover:underline text-sm"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </header>

        {/* Summary/Objective */}
        {(data.summary || data.careerObjective) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">
              {isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
              <p className="text-gray-300 leading-relaxed text-center">
                {isFresher ? (data.careerObjective || data.summary) : (data.summary || data.careerObjective)}
              </p>
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 tracking-wide">SKILLS</h2>
                <div className="space-y-4">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-0 top-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-gray-300">{skill}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 tracking-wide">EDUCATION</h2>
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <div className="font-bold text-lg mb-2">{edu.degree}</div>
                      <div className="text-gray-300 mb-3">{edu.school}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400 text-sm">
                          {edu.startYear} — {edu.endYear}
                        </div>
                        {edu.gpa && (
                          <div className="text-blue-300 font-semibold">GPA: {edu.gpa}</div>
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
                <h2 className="text-2xl font-bold mb-6 tracking-wide">LANGUAGES</h2>
                <div className="space-y-4">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="text-gray-300">{lang.language}</div>
                      <div className="text-gray-400">{lang.level}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 tracking-wide">CERTIFICATIONS</h2>
                <div className="space-y-4">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="font-semibold mb-1">{cert.name}</div>
                      <div className="flex justify-between text-sm">
                        <div className="text-gray-400">{cert.issuer}</div>
                        <div className="text-gray-400">{cert.year}</div>
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
                <h2 className="text-2xl font-bold mb-6 tracking-wide">EXPERIENCE</h2>
                <div className="space-y-8">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-xl mb-2">{exp.role}</div>
                            <div className="text-gray-300">{exp.company}</div>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {exp.startDate} — {exp.endDate}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
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
                <h2 className="text-2xl font-bold mb-6 tracking-wide">PROJECTS</h2>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-xl">{project.name}</div>
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-white hover:underline text-sm"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
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
                  <h2 className="text-2xl font-bold mb-6 tracking-wide">STRENGTHS</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {data.strengths.map((strength, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-gray-300 text-center">{strength}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hobbies */}
              {data.hobbies && data.hobbies.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 tracking-wide">HOBBIES & INTERESTS</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.hobbies.map((hobby, index) => (
                      <div 
                        key={index}
                        className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700"
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
                  <h2 className="text-2xl font-bold mb-6 tracking-wide">REFERENCES</h2>
                  <div className="space-y-4">
                    {data.references.map((ref, index) => (
                      <div key={index} className="text-gray-300 italic">
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
                      <h2 className="text-2xl font-bold mb-6 tracking-wide">{section.title.toUpperCase()}</h2>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                        {section.description && (
                          <p className="text-gray-300 mb-4">{section.description}</p>
                        )}
                        {section.items && section.items.length > 0 && (
                          <div className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center">
                                <div className="w-1 h-1 bg-gray-500 rounded-full mr-3"></div>
                                <div className="text-gray-300">{item}</div>
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
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <div className="text-gray-400 mb-3">
              {data.fullName || "Your Name"} • Professional Resume
            </div>
            <div className="text-gray-500 text-sm">
              Template 9 • Dark Minimalist • {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Template9;