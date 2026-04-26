import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template3: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={3} />;
};

export default Template3;
