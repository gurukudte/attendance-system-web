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
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { format, subDays, getYear, startOfMonth, endOfMonth } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import EmployeeTable from "../EmployeeTable";

export interface EmployeeShift {
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

const MONTHS = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

export function EmployeeShiftTable() {
  const [filteredData, setFilteredData] = useState<EmployeeShift[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [filters, setFilters] = useState({
    employee_id: "",
    employee_name: "",
    shift_type: "All Shifts",
    month: "",
    year: getYear(new Date()).toString(),
  });
  const [date, setDate] = useState<Date | undefined>(() =>
    subDays(new Date(), 1)
  );
  const [filterType, setFilterType] = useState<"day" | "month">("day");

  const fetchData = async () => {
    let queryParams = new URLSearchParams({
      ...(filters.employee_id && { employee_id: filters.employee_id }),
    });

    if (filterType === "day" && date) {
      queryParams.append("date", format(date, "yyyy-MM-dd"));
    }
    // else if (filterType === "month" && filters.month && filters.year) {
    //   const monthStart = new Date(
    //     Number(filters.year),
    //     Number(filters.month) - 1,
    //     1
    //   );
    //   const monthEnd = endOfMonth(monthStart);
    //   queryParams.append("start_date", format(monthStart, "yyyy-MM-dd"));
    //   queryParams.append("end_date", format(monthEnd, "yyyy-MM-dd"));
    // }

    try {
      const response = await fetch(
        `${process.env.FINGERPRINT_API}/?${queryParams}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: EmployeeShift[] = await response.json();
      const formattedResult = result.map((item) => ({
        ...item,
        shift_type:
          item.shift_type.split(" ")[0] + " " + item.shift_type.split(" ")[1],
      }));
      setFilteredData(formattedResult);
      setCurrentPage(1);
      setIsDataFetched(!isDataFetched);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Filter data based on all filters
  useEffect(() => {
    if (filteredData.length > 0) {
      const filtered = filteredData.filter((item) => {
        const matchesEmployeeId = item.employee_id
          .toString()
          .toLowerCase()
          .includes(filters.employee_id.toLowerCase());

        const matchesEmployeeName = item.employee_name
          .toLowerCase()
          .includes(filters.employee_name.toLowerCase());

        const matchesShiftType =
          filters.shift_type === "All Shifts"
            ? true
            : item.shift_type
                .toLowerCase()
                .includes(filters.shift_type.toLowerCase());

        const matchedMonth =
          filters.month !== "month"
            ? item.date.split("-")[1] === filters.month
            : true;
        return matchesEmployeeId && matchesEmployeeName && matchesShiftType;
      });
      // const sortedData = filtered.filter((item) => {
      //   const itemDate = new Date(item.date);
      //   return itemDate >= startDate && itemDate <= endDate;
      // });
      const sortDescending = [...filtered].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      setFilteredData(sortDescending);
      setCurrentPage(1);
    }
  }, [filters, isDataFetched, date, filterType]);

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

  useEffect(() => {
    fetchData();
  }, [filters, date, filterType]);

  return (
    <div
      className={`flex flex-col h-full rounded-md border bg-card text-card-foreground shadow`}
    >
      <div className="p-4 space-y-4 flex flex-col h-full">
        <h2 className="text-xl font-semibold">Employee Shift Records</h2>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <Select
            value={filters.shift_type}
            onValueChange={(value) => handleFilterChange("shift_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Shift Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Shifts">All Shifts</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as "day" | "month")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Single Day</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          {filterType === "day" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex gap-2">
              <Select
                value={filters.month}
                onValueChange={(value) => handleFilterChange("month", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 10 },
                    (_, i) => getYear(new Date()) - i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <EmployeeTable employees={currentItems} />

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
                {[20, 50, 100].map((pageSize) => (
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
