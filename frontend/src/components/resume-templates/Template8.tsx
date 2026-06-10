import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template8Props {
  data: ResumeData;
}

const Template8: React.FC<Template8Props> = ({ data }) =>
  renderTemplate(data, templateThemes[8]);

export default Template8;
