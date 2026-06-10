import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template13Props {
  data: ResumeData;
}

const Template13: React.FC<Template13Props> = ({ data }) =>
  renderTemplate(data, templateThemes[13]);

export default Template13;
