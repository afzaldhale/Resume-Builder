import React from "react";
import { ResumeData } from "./types";
import { getSummaryConfig } from "./templatePolicy";
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, 
  Briefcase, GraduationCap, Award, Languages, Star,
  Calendar, Code, CheckCircle, ExternalLink
} from "lucide-react";

interface Template3Props {
  data: ResumeData;
}

const Template3: React.FC<Template3Props> = ({ data }) => {
  const { isFresher, summaryText, summaryTitle } = getSummaryConfig(data);

  // Icon mapping for social platforms
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      LinkedIn: <Linkedin size={16} className="text-blue-600" />,
      GitHub: <Github size={16} className="text-gray-800" />,
      Portfolio: <Globe size={16} className="text-green-600" />,
      Twitter: <div className="text-sm text-blue-400">𝕏</div>,
      Facebook: <div className="text-sm text-blue-600">f</div>,
      Instagram: <div className="text-sm text-pink-600">📷</div>,
      Website: <Globe size={16} className="text-purple-600" />,
    };
    return icons[platform] || <Globe size={16} />;
  };

  // Get color for skill based on index
  const getSkillColor = (index: number): string => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-amber-500", "bg-red-500", "bg-teal-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <style>{`
        .template-3-page {
          width: 794px;
          min-height: 1123px;
          padding: 52px 48px 42px 48px;
          box-sizing: border-box;
          background: #ffffff;
          overflow: hidden;
        }

        .template-3-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .left-header {
          flex: 1;
          min-width: 0;
        }

        .right-header {
          width: 260px;
          flex-shrink: 0;
        }

        .template-3-content {
          width: 100%;
          max-width: 100%;
        }

        .section-heading-row {
          width: 100%;
          display: block;
          margin-top: 18px;
          margin-bottom: 10px;
          position: relative;
          min-height: 34px;
        }

        .section-heading-bar {
          position: absolute;
          left: -48px;
          right: -48px;
          height: 34px;
          display: flex;
          align-items: center;
          padding-left: 12px;
          padding-right: 12px;
          box-sizing: border-box;
          background: var(--headingBarColor, #f57c00);
          color: var(--headingTextColor, #000000);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
      <div className="template-3-page bg-white text-gray-800 shadow-2xl mx-auto relative overflow-hidden font-sans">
        {/* Minimalist Header */}
        <header className="border-b border-gray-200 pb-8">
          <div className="template-3-header">
            <div className="left-header">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                {data.fullName || "Your Name"}
              </h1>
              {data.role && (
                <div className="text-xl text-gray-600 font-medium">
                  {data.role}
                </div>
              )}
            </div>

            <div className="right-header">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {data.email && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone size={16} className="text-gray-500" />
                    <span className="truncate">{data.phone}</span>
                  </div>
                )}
                {data.address && (
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="truncate">{data.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="template-3-content">
          {/* Summary / Career Objective */}
          {summaryText && (
          <section className="mb-10">
            <div className="section-heading-row">
              <div
                className="section-heading-bar"
                style={{
                  "--headingBarColor": "#38bdf8",
                  "--headingTextColor": "#111827",
                } as React.CSSProperties}
              >
                {summaryTitle}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-700 leading-relaxed text-sm">
                {summaryText}
              </p>
            </div>
          </section>
        )}

        {/* Two Column Layout for Experience & Education */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <div className="section-heading-row">
                <div
                  className="section-heading-bar"
                  style={{
                    "--headingBarColor": "#2563eb",
                    "--headingTextColor": "#ffffff",
                  } as React.CSSProperties}
                >
                  EXPERIENCE
                </div>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{exp.role}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-300 group-hover:border-blue-500 transition-colors">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <div className="section-heading-row">
                <div
                  className="section-heading-bar"
                  style={{
                    "--headingBarColor": "#10b981",
                    "--headingTextColor": "#ffffff",
                  } as React.CSSProperties}
                >
                  EDUCATION
                </div>
              </div>
              <div className="space-y-5">
                {data.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 mt-1">{edu.school}</p>
                      </div>
                      {edu.gpa && (
                        <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {edu.startYear} - {edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section className="mb-10">
            <div className="section-heading-row">
              <div
                className="section-heading-bar"
                style={{
                  "--headingBarColor": "#8b5cf6",
                  "--headingTextColor": "#ffffff",
                } as React.CSSProperties}
              >
                SKILLS & EXPERTISE
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 ${getSkillColor(index)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative px-4 py-2.5 rounded-lg border border-gray-200 bg-white group-hover:shadow-md transition-all">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">{skill}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects & Certifications Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <div className="section-heading-row">
                <div
                  className="section-heading-bar"
                  style={{
                    "--headingBarColor": "#f59e0b",
                    "--headingTextColor": "#ffffff",
                  } as React.CSSProperties}
                >
                  PROJECTS
                </div>
              </div>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="text-xs bg-white text-amber-700 font-medium px-2.5 py-1 rounded-full border border-amber-200"
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

          {/* Certifications & Languages */}
          <div className="space-y-8">
            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <section>
                <div className="section-heading-row">
                  <div
                    className="section-heading-bar"
                    style={{
                      "--headingBarColor": "#ef4444",
                      "--headingTextColor": "#ffffff",
                    } as React.CSSProperties}
                  >
                    CERTIFICATIONS
                  </div>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100"
                    >
                      <div className="text-sm font-medium text-gray-800 mb-1">{cert.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{cert.issuer}</span>
                        <span className="text-xs text-gray-500">{cert.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section>
                <div className="section-heading-row">
                  <div
                    className="section-heading-bar"
                    style={{
                      "--headingBarColor": "#14b8a6",
                      "--headingTextColor": "#ffffff",
                    } as React.CSSProperties}
                  >
                    LANGUAGES
                  </div>
                </div>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              lang.level === "Native" ? "bg-teal-500" :
                              lang.level === "Fluent" ? "bg-green-500" :
                              lang.level === "Intermediate" ? "bg-yellow-500" :
                              "bg-orange-400"
                            }`}
                            style={{
                              width: lang.level === "Native" ? "100%" :
                                     lang.level === "Fluent" ? "90%" :
                                     lang.level === "Intermediate" ? "70%" : "40%"
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{lang.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {(data.strengths?.length || data.hobbies?.length) && (
          <section className="mb-10">
            <div className="section-heading-row">
              <div
                className="section-heading-bar"
                style={{
                  "--headingBarColor": "#2563eb",
                  "--headingTextColor": "#ffffff",
                } as React.CSSProperties}
              >
                ADDITIONAL PROFILE
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {data.strengths?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Strengths</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                    {data.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.hobbies?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hobbies</h3>
                  <p className="text-sm text-gray-700">{data.hobbies.join(", ")}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Social Links & Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {data.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all group"
                >
                  {getSocialIcon(link.platform)}
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {link.platform}
                  </span>
                  <ExternalLink size={12} className="text-gray-400" />
                </a>
              ))}
            </div>
          )}
          
          <div className="text-center text-xs text-gray-500 mt-6">
            <div className="flex items-center justify-center gap-4">
              <span>Resume Template 3</span>
              <span className="text-gray-300">•</span>
              <span>Modern & Clean Design</span>
              <span className="text-gray-300">•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Template3;
