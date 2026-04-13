import React from "react";
import { ResumeData } from "./types";
import { 
  Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Code, Award, Languages, User, ChevronRight
} from "lucide-react";

interface Template6Props {
  data: ResumeData;
}

const Template6: React.FC<Template6Props> = ({ data }) => {
  // Check if this is a fresher resume
  const isFresher = !data.experience || data.experience.length === 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 text-gray-800 w-[794px] min-h-[1123px] mx-auto relative overflow-hidden font-sans">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-12 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <div className="text-lg text-gray-700 font-medium">
                {data.role}
              </div>
            )}
          </div>

          {/* Contact Info - ATS friendly format */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-6">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-600" />
                <span>{data.email}</span>
              </div>
            )}
            
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-600" />
                <span>{data.phone}</span>
              </div>
            )}
            
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-600" />
                <span>{data.address}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>
        </header>

        {/* ATS Optimized Content */}
        <div className="space-y-8">
          {/* Career Objective (for freshers) */}
          {isFresher && data.careerObjective && (
            <section>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-blue-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3 flex items-center gap-2">
                  <User size={18} />
                  CAREER OBJECTIVE
                </h2>
              </div>
              <div className="pl-4 border-l-2 border-blue-200">
                <p className="text-gray-700 leading-relaxed">
                  {data.careerObjective}
                </p>
              </div>
            </section>
          )}

          {/* Professional Summary (for experienced) */}
          {!isFresher && data.summary && (
            <section>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-blue-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3 flex items-center gap-2">
                  <Briefcase size={18} />
                  PROFESSIONAL SUMMARY
                </h2>
              </div>
              <div className="pl-4 border-l-2 border-blue-200">
                <p className="text-gray-700 leading-relaxed">
                  {data.summary}
                </p>
              </div>
            </section>
          )}

          {/* Skills - ATS Critical Section */}
          {data.skills.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-green-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3">SKILLS</h2>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-100"
                    >
                      <ChevronRight size={12} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-blue-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3">WORK EXPERIENCE</h2>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-gray-400">|</span>
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-300">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-purple-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3">EDUCATION</h2>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 mt-1">{edu.school}</p>
                      </div>
                      {edu.gpa && (
                        <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {edu.startYear} - {edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-amber-600 rounded"></div>
                <h2 className="text-xl font-bold text-gray-900 ml-3">PROJECTS</h2>
              </div>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <h3 className="font-bold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="text-xs bg-amber-50 text-amber-800 font-medium px-2 py-1 rounded border border-amber-200"
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

          {/* Additional Sections Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <div className="flex items-center mb-3">
                  <div className="w-6 h-1 bg-teal-600 rounded"></div>
                  <h2 className="text-lg font-bold text-gray-900 ml-2">CERTIFICATIONS</h2>
                </div>
                <div className="space-y-2">
                  {data.certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="text-sm font-medium text-gray-800">{cert.name}</div>
                      <div className="text-xs text-gray-600">{cert.issuer} • {cert.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section>
                <div className="flex items-center mb-3">
                  <div className="w-6 h-1 bg-indigo-600 rounded"></div>
                  <h2 className="text-lg font-bold text-gray-900 ml-2">LANGUAGES</h2>
                </div>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="pt-8 mt-8 border-t border-gray-300">
            <div className="text-center text-xs text-gray-500">
              <div className="flex items-center justify-center gap-4">
                <span>Template 6 • ATS Optimized</span>
                <span className="text-gray-300">•</span>
                <span>Professional Format</span>
                <span className="text-gray-300">•</span>
                <span>All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template6;