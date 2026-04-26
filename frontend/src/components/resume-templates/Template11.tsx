import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template11: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={11} />;
};

export default Template11;
