import React from "react";
import { ResumeData } from "./types";
import { Mail, Phone, MapPin } from "lucide-react";

interface Template8Props {
  data: ResumeData;
}

const Template8: React.FC<Template8Props> = ({ data }) => {
  const isFresher = data.experience.length === 0;

  return (
    <div className="w-[794px] mx-auto bg-slate-50 text-gray-900 font-sans border border-gray-300">
      <div className="p-10 space-y-8">

        {/* HEADER */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-wide">
            {data.fullName || "Your Name"}
          </h1>

          {data.role && (
            <p className="text-lg font-medium text-gray-700">
              {data.role}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 mt-3">
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} /> {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} /> {data.phone}
              </span>
            )}
            {data.address && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {data.address}
              </span>
            )}
          </div>

          {/* Social Links */}
          {data.socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 text-sm text-blue-700 mt-2">
              {data.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* SUMMARY / OBJECTIVE */}
        {(data.summary || data.careerObjective) && (
          <section>
            <h2 className="section-title">
              {isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
            </h2>
            <p className="text-sm leading-relaxed mt-2">
              {isFresher
                ? data.careerObjective || data.summary
                : data.summary || data.careerObjective}
            </p>
          </section>
        )}

        {/* SKILLS */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="section-title">SKILLS</h2>
            <ul className="list-disc list-inside text-sm grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {/* EDUCATION */}
        {data.education.length > 0 && (
          <section>
            <h2 className="section-title">EDUCATION</h2>
            <div className="space-y-3 mt-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-700">
                    {edu.school} | {edu.startYear} - {edu.endYear}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
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
                  <p className="text-sm mt-1 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="section-title">PROJECTS</h2>
            <div className="space-y-3 mt-2">
              {data.projects.map((project, i) => (
                <div key={i}>
                  <p className="font-semibold text-sm">{project.name}</p>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Tech: {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="section-title">CERTIFICATIONS</h2>
            <ul className="list-disc list-inside text-sm mt-2">
              {data.certifications.map((cert, i) => (
                <li key={i}>
                  {cert.name} — {cert.issuer} {cert.year && `(${cert.year})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* STRENGTHS */}
        {data.strengths?.length > 0 && (
          <section>
            <h2 className="section-title">STRENGTHS</h2>
            <ul className="list-disc list-inside text-sm mt-2">
              {data.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {/* HOBBIES */}
        {data.hobbies?.length > 0 && (
          <section>
            <h2 className="section-title">HOBBIES</h2>
            <ul className="list-disc list-inside text-sm mt-2">
              {data.hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t py-3">
        {data.fullName || "Your Name"} • Resume
      </div>

      {/* Section title style */}
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

export default Template8;
