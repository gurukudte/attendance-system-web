"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks/useAppSelector";
import { fetchOrganization } from "../settings/slice/organizationSlice";
import { fetchEmployees } from "@/app/dashboard/employees/slice/employeeSlice";
import { NavItem } from "./components/NavItem";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./components/Header";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  useEffect(() => {
    dispatch(fetchOrganization("67f1e13bfb895c54401edaf2"));
    dispatch(fetchEmployees("67f1e13bfb895c54401edaf2"));
  }, []);
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    setActiveView(lastSegment);
  }, [pathname]);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed z-30 ${
          sidebarOpen ? "w-64" : "w-20"
        } h-screen transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          mobileSidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                TalentSync
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">ST</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hidden lg:block"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={activeView === "dashboard"}
              onClick={() => router.push("/dashboard")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Clock className="w-5 h-5" />}
              label="Reports"
              active={activeView === "reports"}
              onClick={() => router.push("/dashboard/reports")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Employees"
              active={activeView === "employees"}
              onClick={() => router.push("/dashboard/employees")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Calendar className="w-5 h-5" />}
              label="Scheduling"
              active={activeView === "scheduling"}
              onClick={() => router.push("/dashboard/scheduling")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={activeView === "settings"}
              onClick={() => router.push("/dashboard/settings")}
              sidebarOpen={sidebarOpen}
            />
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Top navigation */}
        <Header
          sidebarOpen={sidebarOpen}
          activeView={activeView}
          toggleMobileSidebarAction={toggleMobileSidebar}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
