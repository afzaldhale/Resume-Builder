import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template4: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={4} />;
};

export default Template4;
