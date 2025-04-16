import {
  FiMenu,
  FiChevronDown,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ... other imports

import * as React from "react";

export interface IHeaderProps {
  sidebarOpen: boolean;
  activeView: string;
  toggleMobileSidebarAction: () => void;
}

export function Header({
  sidebarOpen,
  activeView,
  toggleMobileSidebarAction,
}: IHeaderProps) {
  const { data: session } = useSession();
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleMobileSidebarAction}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <h2 className="ml-4 text-lg font-medium text-gray-800 dark:text-white capitalize">
            {activeView}
          </h2>
        </div>
        {session?.user?.name && (
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <span className="sr-only">Notifications</span>
              <div className="w-5 h-5 relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <FiBell className="w-5 h-5" />
              </div>
            </button>

            {/* User dropdown with logout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {session?.user.name[0].toUpperCase()}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="flex items-center ml-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {session?.user.name}
                      </span>
                      <FiChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <FiUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FiSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
