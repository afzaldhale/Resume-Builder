import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template12: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={12} />;
};

export default Template12;
