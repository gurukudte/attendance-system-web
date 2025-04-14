"use client";

import { format } from "date-fns";
import {
  X,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Employee } from "../slice/employeeSlice";
import { EmployeeEditTool } from "./EmployeeEditTool";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  isMobile: boolean;
  onDeleteEmployeeAction: (id: string) => void;
}

export function EmployeeTable({
  employees,
  loading,
  isMobile,
  onDeleteEmployeeAction,
}: EmployeeTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Calculate pagination values
  const totalItems = employees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  // Column width definitions
  const columnWidths = {
    id: "w-[100px]",
    name: "w-[150px]",
    date: "w-[120px]",
    phone: "w-[120px]",
    email: "w-[200px]",
    position: "w-[150px]",
    actions: "w-[120px]",
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="rounded-md border dark:border-gray-700 h-[calc(100vh-200px)] flex flex-col">
      {/* Table container with separate header and body sections */}
      <div className="overflow-hidden flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-none overflow-hidden">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
              <TableRow>
                <TableHead className={columnWidths.id}>Employee ID</TableHead>
                <TableHead className={columnWidths.name}>Name</TableHead>
                <TableHead className={columnWidths.date}>
                  Joining Date
                </TableHead>
                <TableHead className={columnWidths.phone}>Phone</TableHead>
                <TableHead className={columnWidths.email}>Email</TableHead>
                <TableHead className={columnWidths.position}>
                  Position
                </TableHead>
                <TableHead className={`${columnWidths.actions} text-right`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto h-full">
          <Table className="min-w-[700px]">
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span>Loading employees...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className={`font-medium ${columnWidths.id}`}>
                      {employee.employee_id}
                    </TableCell>
                    <TableCell className={columnWidths.name}>
                      {employee.name}
                    </TableCell>
                    <TableCell className={columnWidths.date}>
                      {employee.joinDate
                        ? format(employee.joinDate, "MMM dd, yyyy")
                        : ""}
                    </TableCell>
                    <TableCell className={columnWidths.phone}>
                      {employee.phone}
                    </TableCell>
                    <TableCell className={columnWidths.email}>
                      {employee.email}
                    </TableCell>
                    <TableCell className={columnWidths.position}>
                      {employee.position}
                    </TableCell>
                    <TableCell className={`text-right ${columnWidths.actions}`}>
                      <div className="flex justify-end gap-2">
                        <EmployeeEditTool employee={employee} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this employee?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the employee record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  onDeleteEmployeeAction(employee.id)
                                }
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </>
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <span className="text-lg font-medium">
                        {employees.length === 0
                          ? "No employees found"
                          : "No matching employees found"}
                      </span>
                      <span className="text-muted-foreground">
                        {employees.length === 0
                          ? "Add your first employee to get started"
                          : "Try adjusting your search or filters"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls - Only show if not loading and there are employees */}
      {!loading && employees.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} employees
          </div>

          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
