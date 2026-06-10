import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template2Props {
  data: ResumeData;
}

const Template2: React.FC<Template2Props> = ({ data }) =>
  renderTemplate(data, templateThemes[2]);

export default Template2;
