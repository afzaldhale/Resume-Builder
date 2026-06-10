import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template9Props {
  data: ResumeData;
}

const Template9: React.FC<Template9Props> = ({ data }) =>
  renderTemplate(data, templateThemes[9]);

export default Template9;
