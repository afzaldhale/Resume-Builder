import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template4 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={4} />
);

export default Template4;
