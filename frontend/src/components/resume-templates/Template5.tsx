import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template5Props {
  data: ResumeData;
}

const Template5: React.FC<Template5Props> = ({ data }) =>
  renderTemplate(data, templateThemes[5]);

export default Template5;
