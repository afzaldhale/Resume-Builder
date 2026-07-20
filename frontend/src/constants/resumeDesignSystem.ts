export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export const ResumeTypography = {
  fontFamily: '"Inter", Arial, Helvetica, sans-serif',
  name: 32,
  role: 13,
  contact: 10,
  heading: 16,
  body: 11,
  title: 13,
  subtitle: 11,
  meta: 10,
  list: 11,
  small: 10,
  lineHeight: 1.5,
};

export const getStandardResumeTypographyVars = () => ({
  "--resume-heading-size": `${ResumeTypography.heading}px`,
  "--resume-body-size": `${ResumeTypography.body}px`,
  "--resume-item-title-size": `${ResumeTypography.title}px`,
  "--resume-item-subtitle-size": `${ResumeTypography.subtitle}px`,
  "--resume-item-meta-size": `${ResumeTypography.meta}px`,
  "--resume-list-size": `${ResumeTypography.list}px`,
  "--resume-contact-size": `${ResumeTypography.contact}px`,
  "--resume-name-size": `${ResumeTypography.name}px`,
  "--resume-role-size": `${ResumeTypography.role}px`,
  "--resume-line-height": `${ResumeTypography.lineHeight}`,
  "--resume-section-content-indent": "16px",
});

export const ResumeSpacing = {
  pagePaddingX: 48,
  pagePaddingY: 52,
  sectionGap: 16,
  sectionContentIndent: 16,
  paragraphGap: 8,
  itemGap: 6,
};
