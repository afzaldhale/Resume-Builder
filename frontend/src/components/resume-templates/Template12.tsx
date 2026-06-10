import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template12Props {
  data: ResumeData;
}

const Template12: React.FC<Template12Props> = ({ data }) =>
  renderTemplate(data, templateThemes[12]);

export default Template12;
