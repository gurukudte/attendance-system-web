"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Use NextAuth hook for session
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Home, BarChart, Users, Settings, Edit } from "lucide-react";
import { signOut } from "next-auth/react";
// Assuming you have this API function
import { useSearchParams } from "next/navigation";
import { User } from "@prisma/client";
import MoonLoader from "react-spinners/MoonLoader";
import { fetchAllUsers } from "../api";

export default function DashboardPage() {
  const { data: session } = useSession(); // Using NextAuth.js for session handling
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";

  useEffect(() => {
    // Fetch users data when component mounts
    const getUsers = async () => {
      try {
        const response: any = await fetchAllUsers();
        const data = response.data as User[];
        setUsers(data); // Set the fetched users data
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    getUsers();
  }, []); // Empty dependency array means it runs only on mount

  if (loading)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <MoonLoader color="#020101" />
      </div>
    );
  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <nav className="flex flex-col gap-2">
          <a
            href="?tab=home"
            className={`flex items-center gap-2 ${
              activeTab === "home" ? "font-bold" : "text-gray-400"
            }`}
          >
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              className="w-full flex justify-start items-center gap-2"
            >
              <Home className="w-5 h-5" /> Home
            </Button>
          </a>

          <a
            href="?tab=analytics"
            className={`flex items-center gap-2 ${
              activeTab === "analytics" ? "font-bold" : "text-gray-400"
            }`}
          >
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full flex justify-start items-center gap-2"
            >
              <BarChart className="w-5 h-5" /> Analytics
            </Button>
          </a>
          {session?.user?.role === "ADMIN" && (
            <a
              href="?tab=users"
              className={`flex items-center gap-2 ${
                activeTab === "users" ? "font-bold" : "text-gray-400"
              }`}
            >
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className="w-full flex justify-start items-center gap-2"
              >
                <Users className="w-5 h-5" /> Users
              </Button>
            </a>
          )}

          <a
            href="?tab=settings"
            className={`flex items-center gap-2 ${
              activeTab === "settings" ? "font-bold" : "text-gray-400"
            }`}
          >
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full flex justify-start items-center gap-2"
            >
              <Settings className="w-5 h-5" /> Settings
            </Button>
          </a>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Dashboard Header with User Profile */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{session?.user?.name}</span>
            </div>
            <Button variant="default" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        </header>

        {/* Render content dynamically based on the active tab */}
        {activeTab === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Dashboard Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,245</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$12,540</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Signups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">342</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && session?.user?.role === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* User Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
