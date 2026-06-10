import type { ReactNode } from "react";

interface ProfessionalLayoutProps {
  children?: ReactNode;
}

const ProfessionalLayout = ({ children }: ProfessionalLayoutProps) => (
  <div data-layout-family="ProfessionalLayout">{children}</div>
);

export default ProfessionalLayout;
