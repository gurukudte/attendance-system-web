import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

/**
 * AppLayout Component
 * 
 * A layout component that provides the main application structure including navigation
 * and content area. This component wraps all pages to maintain consistent layout and navigation.
 * 
 * Component Structure:
 * - Navigation Bar: Contains logo, navigation links, and authentication buttons
 * - Main Content Area: Renders child components in a flexible container
 * 
 * Navigation Links:
 * - /: Home page
 * - /explore: Content exploration page
 * - /share: Resource sharing page
 * - /login: User login page
 * - /register: User registration page
 * 
 * Features:
 * - Responsive navigation with mobile optimization
 * - Consistent spacing and layout across pagesS
 * - Authentication-related actions (login/signup)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Child components to render in the main content area
 */
type Props = {
  children?: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Know Your Facts
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/explore" className="text-gray-600 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/share" className="text-gray-600 hover:text-gray-900">
                Share
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
