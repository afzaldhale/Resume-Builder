import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template1 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={1} />
);

export default Template1;
