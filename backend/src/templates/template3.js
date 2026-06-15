const asArray = (value) => (Array.isArray(value) ? value : []);

const hasText = (value) => Boolean(value && String(value).trim());

const formatMonthYear = (value) => {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return String(value);
};

const formatRange = (start, end) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" - ");
};

const uniqueItems = (items) => [...new Set(asArray(items).filter(Boolean))];

const toBulletItems = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const getSummaryConfig = (data) => {
  const isFresher =
    data.candidateType === "fresher" ||
    (!data.candidateType && asArray(data.experience).length === 0);

  return {
    summaryText: isFresher
      ? data.careerObjective || data.summary
      : data.summary || data.careerObjective,
    summaryTitle: isFresher ? "Career Objective" : "Professional Summary",
  };
};

const sortByDateDesc = (items, startKey, endKey) =>
  asArray(items).slice().sort((a, b) => {
    const aDate = new Date(b?.[endKey] || b?.[startKey] || 0).getTime();
    const bDate = new Date(a?.[endKey] || a?.[startKey] || 0).getTime();
    return (Number.isNaN(aDate) ? 0 : aDate) - (Number.isNaN(bDate) ? 0 : bDate);
  });

const renderBulletList = (items, fallbackText = "", tight = false) => {
  const filteredItems = asArray(items).filter(Boolean);

  if (!filteredItems.length) {
    return hasText(fallbackText) ? `<p class="template3-copy">${fallbackText}</p>` : "";
  }

  return `
    <ul class="template3-list ${tight ? "template3-list-tight" : ""}">
      ${filteredItems.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
};

const renderMetaBlock = ({ title, subtitle = "", date = "", body = "" }) => `
  <div class="template3-meta-block">
    <p class="template3-item-title">${title || ""}</p>
    ${subtitle ? `<p class="template3-item-subtitle">${subtitle}</p>` : ""}
    ${date ? `<p class="template3-item-date">${date}</p>` : ""}
    ${body ? `<div class="template3-item-body">${body}</div>` : ""}
  </div>
`;

const renderSection = (title, content) =>
  content
    ? `
    <section class="section resume-section template3-section">
      <h2 class="section-title resume-section-title template3-section-title">${title}</h2>
      <div class="resume-section-content">${content}</div>
    </section>
  `
    : "";

export function template3HTML(data) {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const education = sortByDateDesc(data.education, "startYear", "endYear");
  const experience = sortByDateDesc(data.experience, "startDate", "endDate");
  const certifications = sortByDateDesc(data.certifications, "year", "year");
  const projects = asArray(data.projects);
  const languages = asArray(data.languages);
  const strengths = uniqueItems(data.strengths);
  const hobbies = uniqueItems(data.hobbies);
  const references = asArray(data.references);
  const customSections = asArray(data.customSections);
  const skillsText = uniqueItems(data.skills).join(", ");
  const contactItems = [
    data.phone ? { label: "Mobile", value: data.phone, isLink: false } : null,
    data.email ? { label: "Email ID", value: data.email, isLink: true } : null,
    data.address ? { label: "Address", value: data.address, isLink: false } : null,
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${data.fullName || "Professional Resume"}</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111111;
    font-family: Georgia, "Times New Roman", serif;
  }

  .page {
    width: 794px;
    min-height: 1123px;
    margin: auto;
    box-sizing: border-box;
    background: #ffffff;
  }

  .template-3-page,
  .template-3-page * {
    box-sizing: border-box;
  }

  .template-3-page {
    position: relative;
    overflow: visible;
  }

  .template-3-shell {
    position: relative;
    min-height: 1123px;
    padding: 36px 40px 40px 118px;
    background: #ffffff;
  }

  .template-3-shell::before {
    content: "";
    position: absolute;
    left: 36px;
    top: 36px;
    bottom: 36px;
    width: 70px;
    background: linear-gradient(180deg, #48b7a7 0%, #2d786c 100%);
  }

  .template-3-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 28px;
    align-items: start;
    padding: 6px 0 8px;
  }

  .template3-name {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 35px;
    line-height: 1.02;
    font-weight: 800;
    letter-spacing: -0.7px;
    text-transform: uppercase;
    color: #111111;
  }

  .template3-role {
    margin: 4px 0 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 17px;
    line-height: 1.1;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #111111;
  }

  .template3-contact {
    display: grid;
    gap: 2px;
    padding-top: 2px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .template3-contact-row {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 4px;
    align-items: start;
    font-size: 13px;
    line-height: 1.35;
    color: #7a7a7a;
  }

  .template3-contact-label {
    font-weight: 700;
    text-align: right;
    white-space: nowrap;
  }

  .template3-contact-value {
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .template3-contact-link {
    text-decoration: underline;
  }

  .template3-divider {
    height: 1px;
    background: rgba(17, 17, 17, 0.08);
    margin: 8px 0 0;
  }

  .template3-body {
    display: grid;
    gap: 20px;
    margin-top: 10px;
  }

  .template3-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .template3-section-title {
    margin: 0 0 12px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    line-height: 1.08;
    font-weight: 800;
    text-transform: uppercase;
    color: #111111;
    letter-spacing: -0.2px;
  }

  .template3-copy,
  .template3-item-subtitle,
  .template3-item-date,
  .template3-list {
    font-size: 12.5px;
    line-height: 1.32;
    color: #303030;
  }

  .template3-copy {
    margin: 0;
  }

  .template3-meta-block + .template3-meta-block {
    margin-top: 14px;
  }

  .template3-item-title {
    margin: 0;
    font-size: 12.7px;
    line-height: 1.3;
    font-weight: 700;
    color: #3c3c3c;
  }

  .template3-item-subtitle,
  .template3-item-date {
    margin: 2px 0 0;
    color: #474747;
  }

  .template3-item-body {
    margin-top: 5px;
  }

  .template3-list {
    margin: 4px 0 0 20px;
    padding: 0;
  }

  .template3-list li {
    margin-bottom: 2px;
  }

  .template3-list-tight li {
    margin-bottom: 1px;
  }

  .template3-group-title {
    margin: 0 0 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12.8px;
    line-height: 1.2;
    font-weight: 700;
    color: #111111;
  }

  .section,
  .resume-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
</style>
</head>

<body>
<div class="page template-3-page">
  <div class="template-3-shell">
    <header class="template-3-header">
      <div>
        <h1 class="template3-name">${data.fullName || ""}</h1>
        ${data.role ? `<p class="template3-role">${data.role}</p>` : ""}
      </div>
      ${
        contactItems.length
          ? `
        <div class="template3-contact">
          ${contactItems
            .map(
              (item) => `
            <div class="template3-contact-row">
              <span class="template3-contact-label">${item.label}:</span>
              <span class="template3-contact-value ${item.isLink ? "template3-contact-link" : ""}">${item.value}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </header>

    <div class="template3-divider"></div>

    <div class="template3-body">
      ${renderSection(
        summaryTitle,
        summaryText ? `<p class="template3-copy">${summaryText}</p>` : ""
      )}

      ${renderSection(
        "Skills",
        skillsText ? `<p class="template3-copy">${skillsText}</p>` : ""
      )}

      ${renderSection(
        "Work Experience",
        experience
          .map((item) =>
            renderMetaBlock({
              title: item.role,
              subtitle: item.company,
              date: formatRange(item.startDate, item.endDate),
              body: renderBulletList(toBulletItems(item.description), item.description || ""),
            })
          )
          .join("")
      )}

      ${renderSection(
        "Education",
        education
          .map((item) =>
            renderMetaBlock({
              title: item.degree,
              subtitle: item.school,
              date: formatRange(item.startYear, item.endYear),
              body: item.gpa ? `<p class="template3-copy">GPA: ${item.gpa}</p>` : "",
            })
          )
          .join("")
      )}

      ${renderSection("Achievements", renderBulletList(asArray(data.achievements)))}

      ${renderSection(
        "Projects",
        projects
          .map((project) =>
            renderMetaBlock({
              title: project.name,
              date: project.link || "",
              body: `
                ${project.description ? `<p class="template3-copy">${project.description}</p>` : ""}
                ${
                  asArray(project.technologies).length
                    ? `<p class="template3-copy"><strong>Technologies:</strong> ${uniqueItems(project.technologies).join(", ")}</p>`
                    : ""
                }
              `,
            })
          )
          .join("")
      )}

      ${renderSection(
        "Certifications",
        certifications
          .map((item) =>
            renderMetaBlock({
              title: item.name,
              subtitle: item.issuer,
              date: formatMonthYear(item.year),
            })
          )
          .join("")
      )}

      ${renderSection(
        "Languages",
        renderBulletList(
          languages.map((item) => (item.level ? `${item.language} (${item.level})` : item.language)),
          "",
          true
        )
      )}

      ${renderSection(
        "Strengths",
        strengths.length ? `<p class="template3-copy">${strengths.join(", ")}</p>` : ""
      )}

      ${renderSection(
        "Hobbies & Interests",
        hobbies.length ? `<p class="template3-copy">${hobbies.join(", ")}</p>` : ""
      )}

      ${renderSection("References", renderBulletList(references, "", true))}

      ${renderSection(
        "Additional Information",
        customSections
          .map((section) => {
            const items = asArray(section.items).filter(Boolean);
            if (!section.title && !section.description && !items.length) return "";

            return `
              <div class="template3-meta-block">
                ${section.title ? `<p class="template3-group-title">${section.title}</p>` : ""}
                ${section.description ? `<p class="template3-copy">${section.description}</p>` : ""}
                ${items.length ? renderBulletList(items, "", true) : ""}
              </div>
            `;
          })
          .join("")
      )}
    </div>
  </div>
</div>
</body>
</html>
`;
}
