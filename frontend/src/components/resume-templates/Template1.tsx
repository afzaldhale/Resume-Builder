import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template1: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={1} />;
};

export default Template1;
