import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template8: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={8} />;
};

export default Template8;
