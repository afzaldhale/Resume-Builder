import React from "react";
import { ResumeData } from "./types";
import { getSummaryConfig } from "./templatePolicy";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template11Props {
  data: ResumeData;
}

const Template11: React.FC<Template11Props> = ({ data }) => {
  const { summaryText, summaryTitle } = getSummaryConfig(data);

  return (
    <div className="w-[794px] mx-auto bg-gray-200 font-sans text-gray-900 border border-gray-300">
      <div className="flex min-h-[1123px]">

        {/* LEFT SIDEBAR */}
        <aside className="w-1/3 bg-slate-800 text-white p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {data.fullName || "Your Name"}
            </h1>
            {data.role && (
              <p className="text-sm text-slate-300 mt-1">
                {data.role}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {data.email && (
              <p className="flex items-center gap-2">
                <Mail size={14} /> {data.email}
              </p>
            )}
            {data.phone && (
              <p className="flex items-center gap-2">
                <Phone size={14} /> {data.phone}
              </p>
            )}
            {data.address && (
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {data.address}
              </p>
            )}
          </div>

          {data.socialLinks && data.socialLinks.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                SOCIAL LINKS
              </h2>
              <div className="space-y-1 text-sm">
                {data.socialLinks.map((link, i) => (
                  <div key={i}>
                    <span className="font-medium">{link.platform}:</span>{" "}
                    <span className="break-all">{link.url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                SKILLS
              </h2>
              <ul className="text-sm space-y-1">
                {data.skills.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                LANGUAGES
              </h2>
              <ul className="text-sm space-y-1">
                {data.languages.map((lang, i) => (
                  <li key={i}>• {lang.language} ({lang.level})</li>
                ))}
              </ul>
            </div>
          )}

          {data.strengths && data.strengths.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                STRENGTHS
              </h2>
              <ul className="text-sm space-y-1">
                {data.strengths.map((strength, i) => (
                  <li key={i}>• {strength}</li>
                ))}
              </ul>
            </div>
          )}

          {data.hobbies && data.hobbies.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold tracking-wide border-b border-slate-500 pb-1 mb-2">
                HOBBIES
              </h2>
              <div className="text-sm">
                {data.hobbies.join(", ")}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT CONTENT */}
        <main className="w-2/3 bg-white p-10 space-y-8">

          {summaryText && (
            <section>
              <h2 className="section-title">{summaryTitle.toUpperCase()}</h2>
              <p className="text-sm mt-2 leading-relaxed">{summaryText}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h2 className="section-title">WORK EXPERIENCE</h2>
              <div className="space-y-4 mt-2">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-sm mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 className="section-title">EDUCATION</h2>
              <div className="space-y-3 mt-2">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{edu.degree}</p>
                    <p className="text-sm text-gray-600">
                      {edu.school} | {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h2 className="section-title">PROJECTS</h2>
              <div className="space-y-3 mt-2">
                {data.projects.map((project, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{project.name}</p>
                    <p className="text-sm mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        {project.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="section-title">CERTIFICATIONS</h2>
              <div className="space-y-3 mt-2">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm">{cert.name}</p>
                    <p className="text-sm text-gray-600">
                      {cert.issuer} | {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.achievements && data.achievements.length > 0 && (
            <section>
              <h2 className="section-title">ACHIEVEMENTS</h2>
              <ul className="text-sm mt-2 space-y-1">
                {data.achievements.map((achievement, i) => (
                  <li key={i}>• {achievement}</li>
                ))}
              </ul>
            </section>
          )}

          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections.map((section, i) => (
                <section key={i}>
                  <h2 className="section-title">{section.title.toUpperCase()}</h2>
                  {section.description && (
                    <p className="text-sm mt-2">{section.description}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="text-sm mt-2 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </>
          )}

        </main>
      </div>

      <style>{`
        .section-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #cbd5f5;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Template11;
