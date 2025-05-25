
import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Home,
  File,
  FileText,
  Truck,
  Calendar,
  FileCheck,
  UserCheck,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  href,
  icon: Icon,
  children,
  active = false,
  hasSubmenu = false,
  isSubmenuOpen = false,
  onClick,
}: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-2 px-3 rounded-md mb-1 font-medium transition-colors",
        active
          ? "bg-gondola-100 text-gondola-900"
          : "text-gray-600 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="flex-grow">{children}</span>
      {hasSubmenu && (
        <div className="flex-shrink-0">
          {isSubmenuOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {

  const pathname = usePathname();

  // Map routes to nav item keys
  const getActiveItem = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname.startsWith("/gondolas")) return "gondolas";
    if (pathname.startsWith("/documents")) return "documents";
    if (pathname.startsWith("/inspections")) return "inspections";
    if (pathname.startsWith("/orientation")) return "orientation";
    if (pathname.startsWith("/calendar")) return "calendar";
    if (pathname.startsWith("/settings")) return "settings";
    return "";
  };
  const activeItem = getActiveItem();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (submenu: string) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 h-full flex flex-col">
        <nav className="space-y-1 flex-grow">
          <NavItem
            href="/"
            icon={Home}
            active={activeItem === "dashboard"}
          >
            Dashboard
          </NavItem>

          <NavItem
            href="/projects"
            icon={File}
            active={activeItem === "projects"}
            // hasSubmenu={true}
            isSubmenuOpen={openSubmenu === "projects"}
            onClick={() => toggleSubmenu("projects")}
          >
            Projects
          </NavItem>
          
          {/* {openSubmenu === "projects" && (
            <div className="pl-10 space-y-1">
              <Link
                href="/projects/active"
                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Active
              </Link>
              <Link
                href="/projects/completed"
                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Completed
              </Link>
            </div>
          )} */}

          <NavItem
            href="/gondolas"
            icon={Truck}
            active={activeItem === "gondolas"}
            // hasSubmenu={true}
            isSubmenuOpen={openSubmenu === "gondolas"}
            onClick={() => toggleSubmenu("gondolas")}
          >
            Gondolas
          </NavItem>

          {/* {openSubmenu === "gondolas" && (
            <div className="pl-10 space-y-1">
              <Link
                href="/gondolas/deployed"
                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Deployed
              </Link>
              <Link
                href="/gondolas/maintenance"
                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Maintenance
              </Link>
              <Link
                href="/gondolas/off-hired"
                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-gray-100"
              >
                Off-Hired
              </Link>
            </div>
          )} */}

          {/* <NavItem
            href="/documents"
            icon={FileText}
            active={activeItem === "documents"}
          >
            Documents
          </NavItem>

          <NavItem
            href="/inspections"
            icon={FileCheck}
            active={activeItem === "inspections"}
          >
            Inspections
          </NavItem>

          <NavItem
            href="/orientation"
            icon={UserCheck}
            active={activeItem === "orientation"}
          >
            Orientation
          </NavItem>

          <NavItem
            href="/calendar"
            icon={Calendar}
            active={activeItem === "calendar"}
          >
            Calendar
          </NavItem> */}
        </nav>

        <div className="pt-4 border-t border-gray-200">
          <NavItem
            href="/settings"
            icon={Settings}
            active={activeItem === "settings"}
          >
            Settings
          </NavItem>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
