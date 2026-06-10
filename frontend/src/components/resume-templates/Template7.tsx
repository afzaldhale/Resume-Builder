import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template7Props {
  data: ResumeData;
}

const Template7: React.FC<Template7Props> = ({ data }) =>
  renderTemplate(data, templateThemes[7]);

export default Template7;
