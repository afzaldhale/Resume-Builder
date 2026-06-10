import { ResumeTypography as DesignSystemResumeTypography } from "@/constants/resumeDesignSystem";

export const ResumeTypography = DesignSystemResumeTypography;

export const applyTypographyScale = (value: number, scale: number): number =>
  Math.max(10, value * scale);
