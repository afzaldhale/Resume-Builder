import React from "react";
import { template1Render } from "./Template1";
import { resolveTemplateTheme } from "./themeConfig";
import type { ResumeData } from "./types";

interface Template7Props {
  data: ResumeData;
}

const Template7: React.FC<Template7Props> = ({ data }) =>
  template1Render(data, resolveTemplateTheme(7, data), {
    forcePageBreakBeforeSections: ["strengths"],
  });

export default Template7;
