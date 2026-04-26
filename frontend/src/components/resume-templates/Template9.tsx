import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template9: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={9} />;
};

export default Template9;
