"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Clock,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { EmployeeShiftTable } from "@/components/EmployeeShiftTable";

function EmployeeDashboard() {
  const [activeView, setActiveView] = useState("shifts");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />;
      case "shifts":
        return <EmployeeShiftTable data={shiftData} />;
      case "employees":
        return <EmployeesView />;
      case "scheduling":
        return <SchedulingView />;
      case "settings":
        return <SettingsView />;
      default:
        return <EmployeeShiftTable data={shiftData} />;
    }
  };

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
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              ShiftTrack
            </h1>
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
              onClick={() => setActiveView("dashboard")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Clock className="w-5 h-5" />}
              label="Shifts"
              active={activeView === "shifts"}
              onClick={() => setActiveView("shifts")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Employees"
              active={activeView === "employees"}
              onClick={() => setActiveView("employees")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Calendar className="w-5 h-5" />}
              label="Scheduling"
              active={activeView === "scheduling"}
              onClick={() => setActiveView("scheduling")}
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={activeView === "settings"}
              onClick={() => setActiveView("settings")}
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
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleMobileSidebar}
                className="p-1 rounded-md text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="ml-4 text-lg font-medium text-gray-800 dark:text-white capitalize">
                {activeView}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <span className="sr-only">Notifications</span>
                <div className="w-5 h-5 relative">
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">AD</span>
                </div>
                {sidebarOpen && (
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

// Navigation item component
function NavItem({
  icon,
  label,
  active,
  onClick,
  sidebarOpen,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
          active
            ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {sidebarOpen && <span className="ml-3">{label}</span>}
      </button>
    </li>
  );
}

// Placeholder components for other views
function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Total Employees
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          47
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Active Shifts
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          12
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Late Arrivals
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          3
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Avg. Hours
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          7.5
        </p>
      </div>
    </div>
  );
}

function EmployeesView() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Employees
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Employee management view will be displayed here.
      </p>
    </div>
  );
}

function SchedulingView() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Scheduling
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Shift scheduling view will be displayed here.
      </p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Settings
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        System settings view will be displayed here.
      </p>
    </div>
  );
}

const shiftData = [
  {
    employee_id: "EMP001",
    employee_name: "John Doe",
    date: "2023-10-01",
    shift_type: "Morning",
    shift_login: "08:00:00",
    shift_logout: "16:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:30:00",
    total_break_time: "00:30:00",
    break_count: 2,
  },
  {
    employee_id: "EMP002",
    employee_name: "Jane Smith",
    date: "2023-10-01",
    shift_type: "Afternoon",
    shift_login: "12:00:00",
    shift_logout: "20:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:45:00",
    total_break_time: "00:15:00",
    break_count: 1,
  },
  {
    employee_id: "EMP003",
    employee_name: "Robert Johnson",
    date: "2023-10-01",
    shift_type: "Night",
    shift_login: "22:00:00",
    shift_logout: "06:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:15:00",
    total_break_time: "00:45:00",
    break_count: 3,
  },
  {
    employee_id: "EMP001",
    employee_name: "John Doe",
    date: "2023-10-02",
    shift_type: "Morning",
    shift_login: "08:15:00",
    shift_logout: "16:15:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:20:00",
    total_break_time: "00:40:00",
    break_count: 2,
  },
  {
    employee_id: "EMP004",
    employee_name: "Emily Davis",
    date: "2023-10-02",
    shift_type: "Flexible",
    shift_login: "09:30:00",
    shift_logout: "17:30:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:50:00",
    total_break_time: "00:10:00",
    break_count: 1,
  },
  {
    employee_id: "EMP002",
    employee_name: "Jane Smith",
    date: "2023-10-03",
    shift_type: "Afternoon",
    shift_login: "13:00:00",
    shift_logout: "21:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:30:00",
    total_break_time: "00:30:00",
    break_count: 2,
  },
  {
    employee_id: "EMP005",
    employee_name: "Michael Brown",
    date: "2023-10-03",
    shift_type: "Morning",
    shift_login: "07:45:00",
    shift_logout: "15:45:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:00:00",
    total_break_time: "01:00:00",
    break_count: 3,
  },
  {
    employee_id: "EMP003",
    employee_name: "Robert Johnson",
    date: "2023-10-04",
    shift_type: "Night",
    shift_login: "23:00:00",
    shift_logout: "07:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:45:00",
    total_break_time: "00:15:00",
    break_count: 1,
  },
  {
    employee_id: "EMP006",
    employee_name: "Sarah Wilson",
    date: "2023-10-04",
    shift_type: "Flexible",
    shift_login: "10:00:00",
    shift_logout: "18:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "08:00:00",
    total_break_time: "00:00:00",
    break_count: 0,
  },
  {
    employee_id: "EMP001",
    employee_name: "John Doe",
    date: "2023-10-05",
    shift_type: "Morning",
    shift_login: "08:05:00",
    shift_logout: "16:05:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:35:00",
    total_break_time: "00:25:00",
    break_count: 2,
  },
  {
    employee_id: "EMP004",
    employee_name: "Emily Davis",
    date: "2023-10-05",
    shift_type: "Flexible",
    shift_login: "09:00:00",
    shift_logout: "17:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:55:00",
    total_break_time: "00:05:00",
    break_count: 1,
  },
  {
    employee_id: "EMP007",
    employee_name: "David Taylor",
    date: "2023-10-06",
    shift_type: "Afternoon",
    shift_login: "14:00:00",
    shift_logout: "22:00:00",
    shift_duration: "08:00:00",
    total_working_hours: "07:25:00",
    total_break_time: "00:35:00",
    break_count: 2,
  },
];

export default EmployeeDashboard;
