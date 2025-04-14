"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import { EmployeeTable } from "./EmployeeTable";
import { EmployeeAddTool } from "./EmployeeAddTool";
import { EmployeeBulkAddTool } from "./EmployeeBulkAddTool";
import { fetchOrganization } from "@/app/settings/slice/organizationSlice";
import { deleteEmployee, fetchEmployees } from "../slice/employeeSlice";

export default function EmployeesView() {
  const { employees, loading, error } = useAppSelector(
    (state) => state.employees
  );
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchOrganization("67f1e13bfb895c54401edaf2"));
    dispatch(fetchEmployees("67f1e13bfb895c54401edaf2"));
  }, [dispatch]);

  // Extract unique positions for filter dropdown
  const positions = [...new Set(employees.map((emp) => emp.position))];

  // Filter employees based on search term and position filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      positionFilter === "all" || employee.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

  const handleDeleteEmployee = (id: string) => {
    dispatch(deleteEmployee(id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Employee Management
        </h2>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 md:gap-4">
            <EmployeeAddTool />
            <EmployeeBulkAddTool />
          </div>
        </div>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        isMobile={isMobile}
        onDeleteEmployeeAction={handleDeleteEmployee}
      />
    </div>
  );
}
