import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template10 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={10} />
);

export default Template10;
