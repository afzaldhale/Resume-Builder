import React from "react";
import { ResumeData } from "./types";
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, 
  Briefcase, GraduationCap, Award, Languages, Star,
  Calendar, Code, CheckCircle, ExternalLink, User
} from "lucide-react";

interface Template4Props {
  data: ResumeData;
}

const Template4: React.FC<Template4Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;
  const summaryTitle = isFresher ? "Career Objective" : "PROFILE SUMMARY";

  // Icon mapping for social platforms
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      LinkedIn: <Linkedin size={16} className="text-white" />,
      GitHub: <Github size={16} className="text-white" />,
      Portfolio: <Globe size={16} className="text-white" />,
      Twitter: <div className="text-sm text-white">𝕏</div>,
      Facebook: <div className="text-sm text-white">f</div>,
      Instagram: <div className="text-sm text-white">📷</div>,
      Website: <Globe size={16} className="text-white" />,
    };
    return icons[platform] || <Globe size={16} className="text-white" />;
  };

  // Get color for skill based on index
  const getSkillColor = (index: number): string => {
    const colors = [
      "bg-blue-400", "bg-emerald-400", "bg-amber-400", 
      "bg-rose-400", "bg-purple-400", "bg-cyan-400"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white text-gray-800 w-[794px] min-h-[1123px] shadow-2xl mx-auto relative overflow-hidden font-sans border-2 border-gray-900">
      {/* Dark Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-12 px-12 pb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {data.fullName || "Your Name"}
          </h1>
          {data.role && (
            <div className="text-xl text-gray-300 font-medium mb-6">
              {data.role}
            </div>
          )}
          
          {/* Contact Info Grid */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            {data.email && (
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Mail size={16} className="text-gray-300" />
                <span className="truncate">{data.email}</span>
              </div>
            )}
            
            {data.phone && (
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Phone size={16} className="text-gray-300" />
                <span>{data.phone}</span>
              </div>
            )}
            
            {data.address && (
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <MapPin size={16} className="text-gray-300" />
                <span className="truncate">{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-12 py-8">
{/* Summary / Career Objective */}
      {summaryText && (
        <section className="mb-10">
          <div className="flex items-center mb-4">
            <div className="w-10 h-1 bg-gray-900 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900 ml-3">{summaryTitle}</h2>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-900">
            <p className="text-gray-700 leading-relaxed text-sm">
              {summaryText}
              </p>
            </div>
          </section>
        )}

        {/* Two Column Layout for Experience & Education */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <Briefcase size={20} className="text-gray-900 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">WORK EXPERIENCE</h2>
              </div>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-3 h-3 bg-gray-900 rounded-full"></div>
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="font-medium">{exp.company}</span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{exp.startDate} - {exp.endDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-8">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Skills Column */}
          <div className="space-y-10">
            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <GraduationCap size={20} className="text-gray-900 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">EDUCATION</h2>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">{edu.degree}</h3>
                          <p className="text-sm text-gray-600 mt-1">{edu.school}</p>
                        </div>
                        {edu.gpa && (
                          <span className="text-xs bg-gray-900 text-white font-semibold px-2 py-1 rounded">
                            {edu.gpa}
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

            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Star size={20} className="text-gray-900 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">SKILLS</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${getSkillColor(index)}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Projects & Certifications */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <Code size={20} className="text-gray-900 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">PROJECTS</h2>
              </div>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded border border-gray-300"
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
                <div className="flex items-center mb-4">
                  <Award size={20} className="text-gray-900 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">CERTIFICATIONS</h2>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white rounded-lg border border-gray-200"
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
                <div className="flex items-center mb-4">
                  <Languages size={20} className="text-gray-900 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">LANGUAGES</h2>
                </div>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              lang.level === "Native" ? "bg-gray-900" :
                              lang.level === "Fluent" ? "bg-gray-700" :
                              lang.level === "Intermediate" ? "bg-gray-500" :
                              "bg-gray-400"
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

        {/* Social Links */}
        {data.socialLinks && data.socialLinks.length > 0 && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <User size={20} className="text-gray-900 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">CONNECT WITH ME</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {data.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors group"
                >
                  {getSocialIcon(link.platform)}
                  <span className="text-sm font-medium">
                    {link.platform}
                  </span>
                  <ExternalLink size={12} className="text-gray-300" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="text-center text-xs text-gray-600">
            <div className="flex items-center justify-center gap-6">
              <span>Template 4 • Modern Professional</span>
              <span className="text-gray-300">|</span>
              <span>Designed for Impact</span>
              <span className="text-gray-300">|</span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <div className="mt-2 text-gray-500">
              <span className="flex items-center justify-center gap-1">
                <CheckCircle size={10} />
                All information verified and accurate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template4;