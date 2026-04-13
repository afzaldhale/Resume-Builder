import React from "react";
import { ResumeData } from "./types";
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, 
  Briefcase, GraduationCap, Award, Languages, Star,
  Calendar, ChevronRight
} from "lucide-react";

interface Template2Props {
  data: ResumeData;
}

const Template2: React.FC<Template2Props> = ({ data }) => {
  // Icon mapping for social platforms
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      LinkedIn: <Linkedin size={16} />,
      GitHub: <Github size={16} />,
      Portfolio: <Globe size={16} />,
      Twitter: <div className="text-sm">𝕏</div>,
      Facebook: <div className="text-sm">f</div>,
      Instagram: <div className="text-sm">📷</div>,
      Website: <Globe size={16} />,
    };
    return icons[platform] || <Globe size={16} />;
  };

  // Proficiency level to percentage
  const getLanguagePercentage = (level: string): number => {
    switch(level) {
      case "Native": return 100;
      case "Fluent": return 90;
      case "Intermediate": return 70;
      case "Beginner": return 40;
      default: return 60;
    }
  };

  // Get color based on language level
  const getLanguageColor = (level: string): string => {
    switch(level) {
      case "Native": return "bg-emerald-500";
      case "Fluent": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Beginner": return "bg-orange-400";
      default: return "bg-blue-400";
    }
  };

  return (
    <div className="bg-white text-gray-800 w-[794px] min-h-[1123px] shadow-2xl mx-auto relative overflow-hidden font-sans">
      {/* Modern Two-Column Layout */}
      <div className="flex min-h-[1123px]">
        {/* Left Sidebar - Dark Theme */}
        <div className="w-2/5 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
          {/* Profile Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <div className="text-lg text-gray-300 mb-6">
                {data.role}
              </div>
            )}
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {data.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-sm">{data.email}</span>
                </div>
              )}
              
              {data.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-sm">{data.phone}</span>
                </div>
              )}
              
              {data.address && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-sm">{data.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Star size={18} className="mr-3 text-blue-400" />
                <h2 className="text-xl font-bold">SKILLS</h2>
              </div>
              <div className="space-y-3">
                {data.skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">{skill}</span>
                      <span className="text-xs text-gray-400">
                        {Math.min(95, 65 + (index * 10))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700 group-hover:from-blue-400 group-hover:to-cyan-300"
                        style={{ width: `${Math.min(95, 65 + (index * 10))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <GraduationCap size={18} className="mr-3 text-green-400" />
                <h2 className="text-xl font-bold">EDUCATION</h2>
              </div>
              <div className="space-y-5">
                {data.education.map((edu, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-gray-200 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-gray-400 mt-1">{edu.school}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {edu.startYear} - {edu.endYear}
                        </span>
                        {edu.gpa && (
                          <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Languages size={18} className="mr-3 text-purple-400" />
                <h2 className="text-xl font-bold">LANGUAGES</h2>
              </div>
              <div className="space-y-3">
                {data.languages.map((lang, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">{lang.language}</span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {lang.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getLanguageColor(lang.level)}`}
                        style={{ width: `${getLanguagePercentage(lang.level)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <Globe size={18} className="mr-3 text-amber-400" />
                <h2 className="text-xl font-bold">CONNECT</h2>
              </div>
              <div className="space-y-2">
                {data.socialLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                    <span className="text-sm text-gray-300 truncate">{link.url}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Content - Light Theme */}
        <div className="w-3/5 p-8">
          {/* Professional Summary */}
          {data.summary && (
            <section className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-blue-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">PROFILE SUMMARY</h2>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {data.summary}
                </p>
              </div>
            </section>
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <Briefcase size={20} className="text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">WORK EXPERIENCE</h2>
              </div>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <ChevronRight size={12} className="text-white" />
                      </div>
                      {index < data.experience.length - 1 && (
                        <div className="absolute left-3 top-6 w-0.5 h-full bg-gradient-to-b from-blue-600 to-transparent"></div>
                      )}
                    </div>
                    
                    <div className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{exp.role}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-blue-600">{exp.company}</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar size={14} />
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-full">
                          Full-time
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-blue-200">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects & Achievements */}
          {data.projects.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <Award size={20} className="text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">PROJECTS & ACHIEVEMENTS</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((project, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-100 rounded-full opacity-20"></div>
                    
                    <h3 className="font-bold text-gray-800 text-lg mb-2 relative z-10">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed relative z-10">
                      {project.description}
                    </p>
                    
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 relative z-10">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium px-3 py-1.5 rounded-full border border-green-200"
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

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-purple-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">CERTIFICATIONS</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {data.certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs text-purple-600 font-semibold mb-1 truncate">{cert.issuer}</div>
                    <div className="text-sm font-medium text-gray-800 mb-1 truncate">{cert.name}</div>
                    <div className="text-xs text-gray-500">Issued {cert.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies or Additional Info */}
          {data.hobbies && data.hobbies.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-amber-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">HOBBIES & INTERESTS</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 font-medium px-3 py-1.5 rounded-full border border-amber-200"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modern Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Available for opportunities</span>
            </div>
          </div>
          <div className="text-gray-300">
            Resume Template 2 • {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;