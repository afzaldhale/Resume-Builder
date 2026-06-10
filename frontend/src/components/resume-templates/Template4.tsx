import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template4Props {
  data: ResumeData;
}

const Template4: React.FC<Template4Props> = ({ data }) =>
  renderTemplate(data, templateThemes[4]);

export default Template4;
