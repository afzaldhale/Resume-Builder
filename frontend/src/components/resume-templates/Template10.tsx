import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template10: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={10} />;
};

export default Template10;
