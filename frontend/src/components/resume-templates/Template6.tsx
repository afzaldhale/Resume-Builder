import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template6: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={6} />;
};

export default Template6;
