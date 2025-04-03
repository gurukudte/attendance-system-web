"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import emptyAnimation from "@/public/animations/empty.json";

interface EmployeeShift {
  employee_id: string;
  employee_name: string;
  date: string;
  shift_type: string;
  shift_login: string;
  shift_logout: string;
  shift_duration: string;
  total_working_hours: string;
  total_break_time: string;
  break_count: number;
}

interface EmployeeShiftTableProps {
  data: EmployeeShift[];
  className?: string;
}

export function EmployeeShiftTable({
  data,
  className = "",
}: EmployeeShiftTableProps) {
  const [filteredData, setFilteredData] = useState<EmployeeShift[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    employee_id: "",
    employee_name: "",
    date: "",
    shift_type: "",
  });

  const fetchData = async () => {
    const { employee_id, date } = filters;
    const limit = itemsPerPage;
    const queryParams = new URLSearchParams({
      ...(employee_id && { employee_id }),
      ...(date && { date }),
    });

    try {
      const response = await fetch(
        `https://bee7-106-51-68-196.ngrok-free.app/attendance/?${queryParams}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420", // Any value works
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: EmployeeShift[] = await response.json();
      setFilteredData(result);
      setCurrentPage(1); // Reset to first page when new data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, itemsPerPage]);

  // Apply filters whenever filters or original data changes
  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        item.employee_id
          .toLowerCase()
          .includes(filters.employee_id.toLowerCase()) &&
        item.employee_name
          .toLowerCase()
          .includes(filters.employee_name.toLowerCase()) &&
        item.date.includes(filters.date) &&
        (filters.shift_type === "" || item.shift_type === filters.shift_type)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, data]);

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div
      className={`flex flex-col h-full rounded-md border bg-card text-card-foreground shadow ${className}`}
    >
      <div className="p-4 space-y-4 flex flex-col h-full">
        <h2 className="text-xl font-semibold">Employee Shift Records</h2>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Filter by Employee ID"
            value={filters.employee_id}
            onChange={(e) => handleFilterChange("employee_id", e.target.value)}
          />
          <Input
            placeholder="Filter by Name"
            value={filters.employee_name}
            onChange={(e) =>
              handleFilterChange("employee_name", e.target.value)
            }
          />
          <Input
            placeholder="Filter by Date (YYYY-MM-DD)"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
          {/* <Select
            value={filters.shift_type}
            onValueChange={(value) => handleFilterChange("shift_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Shift Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Shifts</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
              <SelectItem value="Flexible">Flexible</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {/* Table Container - Takes remaining space */}
        <div className="flex-1 overflow-auto rounded-md border">
          <Table className="relative">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift Type</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Logout</TableHead>
                <TableHead>Shift Duration</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Break Time</TableHead>
                <TableHead>Break Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <TableRow key={`${item.employee_id}-${item.date}-${index}`}>
                    <TableCell>{item.employee_id}</TableCell>
                    <TableCell>{item.employee_name}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.shift_type}</TableCell>
                    <TableCell>{convert24To12(item.shift_login)}</TableCell>
                    <TableCell>{convert24To12(item.shift_logout)}</TableCell>
                    <TableCell>{item.shift_duration}</TableCell>
                    <TableCell>{item.total_working_hours}</TableCell>
                    <TableCell>{item.total_break_time}</TableCell>
                    <TableCell>{item.break_count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-full py-12">
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      {typeof window !== "undefined" && Lottie && (
                        <div className="w-64 h-64">
                          <Lottie
                            animationData={emptyAnimation}
                            loop={true}
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      <p className="text-lg font-medium text-muted-foreground">
                        No shift records found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or check back later
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} records
            </p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[100, 200, 300, 400, 500].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function convert24To12(time24: string): string {
  // Split the time into hours, minutes, seconds
  const [hours, minutes, seconds] = time24.split(":").map(Number);

  // Create a Date object (date part doesn't matter, we only care about time)
  const date = new Date();
  date.setHours(hours, minutes, seconds);

  // Format to 12-hour time with AM/PM
  return date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}
