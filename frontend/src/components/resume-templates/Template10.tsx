import React from "react";
import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface Template10Props {
  data: ResumeData;
}

const Template10: React.FC<Template10Props> = ({ data }) =>
  renderTemplate(data, templateThemes[10]);

export default Template10;
