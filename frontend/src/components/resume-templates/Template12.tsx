import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template12 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={12} />
);

export default Template12;
