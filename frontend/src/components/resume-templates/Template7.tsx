import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template7: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={7} />;
};

export default Template7;
