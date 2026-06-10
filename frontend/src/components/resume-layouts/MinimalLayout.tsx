import type { ReactNode } from "react";

interface MinimalLayoutProps {
  children?: ReactNode;
}

const MinimalLayout = ({ children }: MinimalLayoutProps) => (
  <div data-layout-family="MinimalLayout">{children}</div>
);

export default MinimalLayout;
