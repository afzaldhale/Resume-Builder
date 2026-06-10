import React from "react";
import { renderTemplate } from "./shared";
import { template1Theme } from "./templateThemes";
import type { ResumeData } from "./types";

interface Template1Props {
  data: ResumeData;
}

const Template1: React.FC<Template1Props> = ({ data }) => renderTemplate(data, template1Theme);

export default Template1;
