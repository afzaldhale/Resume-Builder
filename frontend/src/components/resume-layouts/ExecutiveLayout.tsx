import type { ReactNode } from "react";

interface ExecutiveLayoutProps {
  children?: ReactNode;
}

const ExecutiveLayout = ({ children }: ExecutiveLayoutProps) => (
  <div data-layout-family="ExecutiveLayout">{children}</div>
);

export default ExecutiveLayout;
