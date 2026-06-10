import type { ReactNode } from "react";

interface SidebarLayoutProps {
  sidebar?: ReactNode;
  main?: ReactNode;
}

const SidebarLayout = ({ sidebar, main }: SidebarLayoutProps) => (
  <div data-layout-family="SidebarLayout">
    <div data-layout-slot="sidebar">{sidebar}</div>
    <div data-layout-slot="main">{main}</div>
  </div>
);

export default SidebarLayout;
