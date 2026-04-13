import React from "react";
import { ResumeData } from "./types";
import { 
  Mail, Phone, MapPin, Palette, Brush, Code, 
  Camera, Music, BookOpen, Globe, Sparkles,
  Award, Users, Zap, Star, Target, Circle,
  Briefcase, GraduationCap, ChevronRight
} from "lucide-react";

interface Template7Props {
  data: ResumeData;
}

const Template7: React.FC<Template7Props> = ({ data }) => {
  // Check if this is a creative/designer profile
  const isCreative = data.skills.some(skill => 
    skill.toLowerCase().includes('design') || 
    skill.toLowerCase().includes('figma') || 
    skill.toLowerCase().includes('ui') || 
    skill.toLowerCase().includes('ux') ||
    skill.toLowerCase().includes('photo') ||
    skill.toLowerCase().includes('video')
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 text-gray-800 w-[794px] min-h-[1123px] mx-auto relative overflow-hidden font-sans">
      {/* Creative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-blue-500"></div>
        <div className="absolute top-20 right-10 w-40 h-40 border-2 border-pink-300 rounded-full"></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-blue-300 rotate-45"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 border-2 border-purple-300 rounded-lg rotate-12"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-10 py-8">
        {/* Creative Header */}
        <header className="mb-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Palette size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data.fullName || "Your Name"}
                  </h1>
                  {data.role && (
                    <div className="text-lg text-gray-700 font-medium mt-1">
                      {data.role}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Creative Tagline */}
              {data.summary && (
                <div className="mt-4 pl-16">
                  <div className="text-sm text-gray-600 italic border-l-2 border-pink-400 pl-3">
                    "{data.summary.substring(0, 120)}..."
                  </div>
                </div>
              )}
            </div>
            
            {/* Contact Info - Creative Layout */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="space-y-3">
                {data.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-pink-500" />
                    <span className="text-gray-700">{data.email}</span>
                  </div>
                )}
                
                {data.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-blue-500" />
                    <span className="text-gray-700">{data.phone}</span>
                  </div>
                )}
                
                {data.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-purple-500" />
                    <span className="text-gray-700">{data.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Divider with creative dots */}
          <div className="flex items-center">
            <div className="h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex-1"></div>
            <div className="mx-4 flex gap-1">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex-1"></div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Skills & Creative Profile */}
          <div className="col-span-1 space-y-8">
            {/* Creative Skills */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-1 bg-pink-500 rounded"></div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-pink-500" />
                  CREATIVE SKILLS
                </h2>
              </div>
              
              <div className="space-y-4">
                {data.skills.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">{skill}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={`${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(95, 70 + (index * 8))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools & Technologies */}
            {data.projects.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-blue-500 rounded"></div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Code size={18} className="text-blue-500" />
                    TOOLS & TECH
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[...new Set(data.projects.flatMap(p => p.technologies))].slice(0, 10).map((tech, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
                    >
                      <span className="text-xs font-medium text-blue-800">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-emerald-500 rounded"></div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Globe size={18} className="text-emerald-500" />
                    LANGUAGES
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{lang.language}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              lang.level === "Native" ? "bg-emerald-500" :
                              lang.level === "Fluent" ? "bg-green-500" :
                              lang.level === "Intermediate" ? "bg-amber-500" :
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

          {/* Right Column - Experience & Projects */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-purple-500 rounded"></div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase size={20} className="text-purple-500" />
                    PROFESSIONAL EXPERIENCE
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="group relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <span className="font-medium">{exp.company}</span>
                              <span className="text-gray-400">•</span>
                              <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                          </div>
                          <div className="text-xs bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full">
                            Full-time
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-purple-200">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects - Creative Showcase */}
            {data.projects.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-amber-500 rounded"></div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Target size={20} className="text-amber-500" />
                    FEATURED PROJECTS
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {data.projects.map((project, index) => (
                    <div 
                      key={index}
                      className="group bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                        <div className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-1 rounded">
                          Project #{index + 1}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 font-medium px-2 py-1 rounded-full border border-amber-200"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education & Certifications */}
            <div className="grid grid-cols-2 gap-6">
              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-1 bg-blue-500 rounded"></div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <GraduationCap size={18} className="text-blue-500" />
                      EDUCATION
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {data.education.map((edu, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm">{edu.degree}</h3>
                            <p className="text-sm text-gray-600 mt-1">{edu.school}</p>
                          </div>
                          {edu.gpa && (
                            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded">
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

              {/* Certifications */}
              {data.certifications && data.certifications.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-1 bg-emerald-500 rounded"></div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Award size={18} className="text-emerald-500" />
                      CERTIFICATIONS
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {data.certifications.map((cert, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100"
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
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="text-center">
            <div className="flex items-center justify-center gap-6 mb-3">
              <span className="text-sm text-gray-700 font-medium">Creative Portfolio Template</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700 font-medium">Designed for Creatives</span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={10} className="text-amber-500" />
                Showcasing creativity with professional integrity
                <Sparkles size={10} className="text-amber-500" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template7;