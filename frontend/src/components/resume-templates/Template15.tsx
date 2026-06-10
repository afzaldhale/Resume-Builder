import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template15Props {
  data: ResumeData;
}

const Template15: React.FC<Template15Props> = ({ data }) =>
  renderTemplate(data, templateThemes[15]);

export default Template15;
