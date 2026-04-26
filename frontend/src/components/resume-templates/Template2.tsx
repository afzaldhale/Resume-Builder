import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template2: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={2} />;
};

export default Template2;
