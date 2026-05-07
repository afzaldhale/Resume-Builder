import React from "react";
import { ResumeData } from "./types";
import { getSummaryConfig } from "./templatePolicy";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template12Props {
  data: ResumeData;
}

const Template12: React.FC<Template12Props> = ({ data }) => {
  const { summaryText, summaryTitle } = getSummaryConfig(data);

  return (
    <div className="w-[794px] mx-auto bg-slate-100 text-gray-900 font-sans border border-gray-300">
      <div className="min-h-[1123px]">

        {/* HEADER */}
        <header className="bg-teal-700 text-white px-10 py-8">
          <h1 className="text-3xl font-bold tracking-wide">
            {data.fullName || "Your Name"}
          </h1>

          {data.role && (
            <p className="text-lg text-teal-100 mt-1">
              {data.role}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-sm mt-4">
            {data.email && (
              <span className="flex items-center gap-2">
                <Mail size={14} /> {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-2">
                <Phone size={14} /> {data.phone}
              </span>
            )}
            {data.address && (
              <span className="flex items-center gap-2">
                <MapPin size={14} /> {data.address}
              </span>
            )}
          </div>

          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm mt-3 text-teal-100">
              {data.socialLinks.map((link, i) => (
                <span key={i}>
                  {link.platform}: {link.url}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* BODY */}
        <div className="p-10 grid grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <aside className="col-span-1 space-y-8">

            {data.skills.length > 0 && (
              <section>
                <h2 className="section-title">SKILLS</h2>
                <ul className="text-sm mt-2 space-y-1">
                  {data.skills.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </section>
            )}

            {data.education.length > 0 && (
              <section>
                <h2 className="section-title">EDUCATION</h2>
                <div className="space-y-3 mt-2">
                  {data.education.map((e, i) => (
                    <div key={i}>
                      <p className="font-semibold text-sm">{e.degree}</p>
                      <p className="text-xs text-gray-600">
                        {e.school} | {e.startYear} - {e.endYear}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages && data.languages.length > 0 && (
              <section>
                <h2 className="section-title">LANGUAGES</h2>
                <ul className="text-sm mt-2 space-y-1">
                  {data.languages.map((lang, i) => (
                    <li key={i}>• {lang.language} ({lang.level})</li>
                  ))}
                </ul>
              </section>
            )}

            {data.strengths && data.strengths.length > 0 && (
              <section>
                <h2 className="section-title">STRENGTHS</h2>
                <ul className="text-sm mt-2 space-y-1">
                  {data.strengths.map((strength, i) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </section>
            )}

            {data.hobbies && data.hobbies.length > 0 && (
              <section>
                <h2 className="section-title">HOBBIES</h2>
                <div className="text-sm mt-2">
                  {data.hobbies.join(", ")}
                </div>
              </section>
            )}

          </aside>

          {/* RIGHT COLUMN */}
          <main className="col-span-2 space-y-8">

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

            {data.projects.length > 0 && (
              <section>
                <h2 className="section-title">PROJECTS</h2>
                <div className="space-y-3 mt-2">
                  {data.projects.map((p, i) => (
                    <div key={i}>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-sm">{p.description}</p>
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
                      <p className="text-xs text-gray-600">
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
      </div>

      <style>{`
        .section-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #5eead4;
          padding-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Template12;
