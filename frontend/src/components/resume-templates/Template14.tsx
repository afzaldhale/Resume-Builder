import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template14Props {
  data: ResumeData;
}

const Template14: React.FC<Template14Props> = ({ data }) =>
  renderTemplate(data, templateThemes[14]);

export default Template14;
