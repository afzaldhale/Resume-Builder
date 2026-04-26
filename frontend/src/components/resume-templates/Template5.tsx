import type { ResumeData } from "./types";
import { PremiumResumeTemplate } from "./premiumShared";

const Template5 = ({ data }: { data: ResumeData }) => (
  <PremiumResumeTemplate data={data} templateId={5} />
);

export default Template5;
