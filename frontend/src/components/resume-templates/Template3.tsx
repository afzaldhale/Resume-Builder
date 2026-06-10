import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template3Props {
  data: ResumeData;
}

const Template3: React.FC<Template3Props> = ({ data }) =>
  renderTemplate(data, templateThemes[3]);

export default Template3;
