import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template11Props {
  data: ResumeData;
}

const Template11: React.FC<Template11Props> = ({ data }) =>
  renderTemplate(data, templateThemes[11]);

export default Template11;
