import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template6Props {
  data: ResumeData;
}

const Template6: React.FC<Template6Props> = ({ data }) =>
  renderTemplate(data, templateThemes[6]);

export default Template6;
