import React from "react";
import { template1Render } from "./Template1";
import { resolveTemplateTheme } from "./themeConfig";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import type { ResumeData } from "./types";

interface Template12Props {
  data: ResumeData;
}

const buildTemplate12Theme = (data: ResumeData): ResumeTemplateTheme => {
  const theme12 = resolveTemplateTheme(12, data);

  return {
    ...theme12,
    layout: "single",
    headerLayout: "split",
    layoutType: "single-column",
    headingVariant: "full-width-bar",
    headingInset: true,
    pagePadding: "36px 48px",
    sectionSpacing: 14,
    headerDivider: true,
    topAccentBar: false,
    leftAccentLine: false,
    summaryStyle: "plain",
    showHeaderContact: true,
  };
};

const Template12: React.FC<Template12Props> = ({ data }) =>
  template1Render(data, buildTemplate12Theme(data), {
    forcePageBreakBeforeSections: ["strengths"],
  });

export default Template12;
