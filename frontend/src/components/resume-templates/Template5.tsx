import React from "react";
import TemplateCore from "./TemplateCore";
import type { ResumeData } from "./types";

const Template5: React.FC<{ data: ResumeData }> = ({ data }) => {
  return <TemplateCore data={data} variant={5} />;
};

export default Template5;
