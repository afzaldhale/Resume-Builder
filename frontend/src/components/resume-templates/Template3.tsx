import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template3 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={3} />
);

export default Template3;
