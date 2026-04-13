import React from "react";
import { ResumeData } from "./types";

interface Template1Props {
  data: ResumeData;
}

const Template1: React.FC<Template1Props> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 w-[794px] min-h-[1123px] mx-auto p-8 font-sans">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold mb-1">{data.fullName || "Your Name"}</h1>
        
        {data.role && (
          <p className="text-sm font-semibold mb-4">{data.role}</p>
        )}
        
        {/* Contact Info */}
        <div className="text-xs space-y-1 mb-6">
          {data.email && <p>Email: {data.email}</p>}
          {data.phone && <p>Phone: {data.phone}</p>}
          {data.address && <p>Location: {data.address}</p>}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <p>{data.socialLinks.map(l => `${l.platform}: ${l.url}`).join(" | ")}</p>
          )}
        </div>
      </header>

      <div className="border-b border-gray-300 mb-6"></div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Professional Summary */}
        {data.summary && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-sm">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <p className="text-sm">{[...new Set(data.skills)].join(", ")}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-sm font-bold">
                    {exp.role}{exp.company && ` – ${exp.company}`}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {exp.startDate || ""}{exp.endDate && ` – ${exp.endDate}`}
                  </p>
                  {exp.description && (
                    <ul className="text-sm list-disc ml-5 mt-1 space-y-1">
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  )}
                  {exp.impact && <p className="text-xs text-gray-600 mt-1">Impact: {exp.impact}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.slice(0, 2).map((project, index) => (
                <div key={index}>
                  <h3 className="text-sm font-bold">{project.name}</h3>
                  <p className="text-sm">{project.description}</p>
                  {project.impact && <p className="text-xs text-gray-600 mt-1">Impact: {project.impact}</p>}
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">Technologies: {project.technologies.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-sm font-bold">
                    {edu.degree} – {edu.school}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {edu.startYear || ""}{edu.endYear && ` – ${edu.endYear}`}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="text-sm list-disc ml-5 space-y-1">
              {data.certifications.slice(0, 3).map((cert, index) => (
                <li key={index}>
                  {cert.name}{cert.issuer && ` – ${cert.issuer}`}{cert.year && ` (${cert.year})`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Languages
            </h2>
            <p className="text-sm">{data.languages.map(l => `${l.language} (${l.level})`).join(", ")}</p>
          </section>
        )}

        {/* Hobbies & Interests */}
        {data.hobbies && data.hobbies.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 pb-1 mb-2">
              Hobbies & Interests
            </h2>
            <p className="text-sm">{data.hobbies.join(", ")}</p>
          </section>
        )}

        {/* Footer */}
        <div className="pt-4 mt-6 border-t border-gray-300 text-xs text-gray-500">
          <p>Generated with Resume Builder • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Template1;
