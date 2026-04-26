import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template2 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={2} />
);

export default Template2;
