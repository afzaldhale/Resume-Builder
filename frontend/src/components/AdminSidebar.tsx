import { LayoutDashboard, ClipboardList, Users, LogOut, Shield, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useIsMobile } from "./hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const navItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Manage Requests", path: "/admin/requests", icon: ClipboardList },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
    onNavigate?.();
  };

  return (
    <div className="h-full bg-sidebar flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sidebar-foreground" />
          <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed top-4 left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="shadow-soft bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
};

export default AdminSidebar;
