import React from "react";
import { ResumeData } from "./types";
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, 
  Briefcase, GraduationCap, Award, Languages, Star,
  Calendar, Code, ChevronRight, Dot, ExternalLink
} from "lucide-react";

interface Template5Props {
  data: ResumeData;
}

const Template5: React.FC<Template5Props> = ({ data }) => {
  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;
  const summaryTitle = isFresher ? "Career Objective" : "PROFESSIONAL SUMMARY";

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

  // Get timeline dot color based on section
  const getTimelineColor = (section: string): string => {
    const colors: Record<string, string> = {
      summary: "bg-blue-500",
      experience: "bg-green-500",
      education: "bg-purple-500",
      skills: "bg-amber-500",
      projects: "bg-red-500",
      certifications: "bg-teal-500",
      languages: "bg-indigo-500",
      social: "bg-pink-500"
    };
    return colors[section] || "bg-blue-500";
  };

  // Get section icon
  const getSectionIcon = (section: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      summary: <Briefcase size={18} />,
      experience: <Calendar size={18} />,
      education: <GraduationCap size={18} />,
      skills: <Star size={18} />,
      projects: <Code size={18} />,
      certifications: <Award size={18} />,
      languages: <Languages size={18} />
    };
    return icons[section] || <ChevronRight size={18} />;
  };

  return (
    <div className="bg-white text-gray-800 w-[794px] min-h-[1123px] shadow-2xl mx-auto relative overflow-hidden font-sans">
      {/* Left Blue Border */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-600 to-blue-400"></div>

      {/* Main Content */}
      <div className="pl-10 pr-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {data.fullName || "Your Name"}
          </h1>
          
          {data.role && (
            <div className="text-xl text-gray-600 font-medium mb-6">
              {data.role}
            </div>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                <span>{data.email}</span>
              </div>
            )}
            
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600" />
                <span>{data.phone}</span>
              </div>
            )}
            
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span>{data.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Sections */}
        <div className="space-y-12">
          {/* Summary / Career Objective */}
          {summaryText && (
            <TimelineSection 
              title={summaryTitle} 
              section="summary"
              content={
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {summaryText}
                  </p>
                </div>
              }
            />
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <TimelineSection 
              title="WORK EXPERIENCE" 
              section="experience"
              content={
                <div className="space-y-8">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="group">
                      <div className="mb-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-3 py-1.5 rounded-full">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{exp.company}</span>
                          <Dot size={16} />
                          <span>Full-time</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-300 group-hover:border-blue-500 transition-colors">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <TimelineSection 
              title="EDUCATION" 
              section="education"
              content={
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">{edu.degree}</h3>
                          <p className="text-sm text-gray-600 mt-1">{edu.school}</p>
                        </div>
                        {edu.gpa && (
                          <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">
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
              }
            />
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <TimelineSection 
              title="SKILLS" 
              section="skills"
              content={
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className="relative px-4 py-2.5 rounded-lg border border-gray-200 bg-white group-hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-amber-600" />
                          <span className="text-sm font-medium text-gray-800">{skill}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <TimelineSection 
              title="PROJECTS & ACHIEVEMENTS" 
              section="projects"
              content={
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-gray-800 mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="text-xs bg-white text-red-700 font-medium px-2.5 py-1 rounded-full border border-red-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
            />
          )}

          {/* Certifications & Languages Grid */}
          {(data.certifications?.length > 0 || data.languages?.length > 0) && (
            <div className="grid grid-cols-2 gap-8">
              {/* Certifications */}
              {data.certifications && data.certifications.length > 0 && (
                <TimelineSection 
                  title="CERTIFICATIONS" 
                  section="certifications"
                  content={
                    <div className="space-y-3">
                      {data.certifications.map((cert, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100"
                        >
                          <div className="text-sm font-medium text-gray-800 mb-1">{cert.name}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{cert.issuer}</span>
                            <span className="text-xs text-gray-500">{cert.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                />
              )}

              {/* Languages */}
              {data.languages && data.languages.length > 0 && (
                <TimelineSection 
                  title="LANGUAGES" 
                  section="languages"
                  content={
                    <div className="space-y-3">
                      {data.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  lang.level === "Native" ? "bg-indigo-500" :
                                  lang.level === "Fluent" ? "bg-blue-500" :
                                  lang.level === "Intermediate" ? "bg-purple-400" :
                                  "bg-pink-400"
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
                  }
                />
              )}
            </div>
          )}

          {/* Social Links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <TimelineSection 
              title="CONNECT" 
              section="social"
              content={
                <div className="flex flex-wrap gap-3">
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
              }
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center gap-6">
              <span>Timeline Template • Professional Design</span>
              <span className="text-gray-300">•</span>
              <span>All Rights Reserved</span>
              <span className="text-gray-300">•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline Section Component
const TimelineSection: React.FC<{
  title: string;
  section: string;
  content: React.ReactNode;
}> = ({ title, section, content }) => {
  const timelineColor = (() => {
    const colors: Record<string, string> = {
      summary: "bg-blue-500",
      experience: "bg-green-500",
      education: "bg-purple-500",
      skills: "bg-amber-500",
      projects: "bg-red-500",
      certifications: "bg-teal-500",
      languages: "bg-indigo-500",
      social: "bg-pink-500"
    };
    return colors[section] || "bg-blue-500";
  })();

  const getSectionIcon = (section: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      summary: <Briefcase size={18} />,
      experience: <Calendar size={18} />,
      education: <GraduationCap size={18} />,
      skills: <Star size={18} />,
      projects: <Code size={18} />,
      certifications: <Award size={18} />,
      languages: <Languages size={18} />
    };
    return icons[section] || <ChevronRight size={18} />;
  };

  return (
    <div className="relative pl-12">
      {/* Timeline Dot */}
      <div className="absolute left-0 top-0">
        <div className={`w-8 h-8 ${timelineColor} rounded-full flex items-center justify-center`}>
          <div className="text-white">
            {getSectionIcon(section)}
          </div>
        </div>
      </div>
      
      {/* Timeline Line */}
      <div className="absolute left-4 top-8 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent"></div>
      
      {/* Content */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        {content}
      </div>
    </div>
  );
};

export default Template5;