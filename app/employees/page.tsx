"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Check,
  X,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EmployeeAdditionTool } from "./components/EmployeeBulkAddTool";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import {
  deleteEmployee,
  Employee,
  fetchEmployees,
  setEmployees,
  updateEmployee,
} from "./slice/employeeSlice";
import { fetchOrganization } from "../settings/slice/organizationSlice";
import { EmployeeActions } from "./components/EmployeeEActions";

export default function EmployeesView() {
  // Sample initial employees
  const { employees, loading, error } = useAppSelector(
    (state) => state.employees
  );
  const dispatch = useAppDispatch();

  const [newEmployee, setNewEmployee] = useState<
    Omit<Employee, "id" | "createdAt" | "updatedAt" | "orgId">
  >({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    status: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.employee_id) return;

    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      orgId: "",
      createdAt: "",
      updatedAt: "",
    };

    dispatch(setEmployees([...employees, employee]));
    resetNewEmployeeForm();
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = () => {
    if (!editEmployee) return;

    const apiData = Object.fromEntries(
      Object.entries(editEmployee).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    dispatch(updateEmployee({ id: editEmployee.id, data: apiData }));
  };

  const resetNewEmployeeForm = () => {
    setNewEmployee({
      employee_id: "",
      name: "",
      joinDate: "",
      phone: "",
      email: "",
      status: "active", // Default status
    });
  };

  const openEditDialog = (employee: Employee) => {
    setEditEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    dispatch(fetchOrganization("67f1e13bfb895c54401edaf2"));
    dispatch(fetchEmployees("67f1e13bfb895c54401edaf2"));
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      // Only close if not loading AND no error
      setIsEditDialogOpen(false);
    }

    // Optional: Handle errors
    if (error) {
      // You might want to show an error toast here
      console.error("Error creating employees:", error);
    }
  }, [loading, error]);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Employee Management
        </h2>
        <div className="flex gap-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  Add New Employee
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="employee_id" className="text-right">
                    Employee ID
                  </label>
                  <Input
                    id="employee_id"
                    value={newEmployee.employee_id}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        employee_id: e.target.value,
                      })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="joining_date" className="text-right">
                    Joining Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newEmployee.joinDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEmployee.joinDate ? (
                          format(newEmployee.joinDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          editEmployee?.joinDate
                            ? new Date(editEmployee.joinDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          editEmployee &&
                          date &&
                          setEditEmployee({
                            ...editEmployee,
                            joinDate: date.toISOString(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddEmployee}
                  disabled={!newEmployee.name || !newEmployee.employee_id}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <EmployeeAdditionTool />
        </div>
      </div>
      <div className="rounded-md border dark:border-gray-700 h-full">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead className="w-[100px]">Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.employee_id}
                  </TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    {employee.joinDate
                      ? format(employee.joinDate, "MMM dd, yyyy")
                      : ""}
                  </TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={
                          isEditDialogOpen && editEmployee?.id === employee.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setIsEditDialogOpen(false);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              openEditDialog(employee);
                            }}
                            disabled={loading}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">
                              Edit Employee
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-employee_id"
                                className="text-right"
                              >
                                Employee ID
                              </label>
                              <Input
                                id="edit-employee_id"
                                value={editEmployee?.employee_id || ""}
                                onChange={(e) =>
                                  editEmployee &&
                                  setEditEmployee({
                                    ...editEmployee,
                                    employee_id: e.target.value,
                                  })
                                }
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-name" className="text-right">
                                Full Name
                              </label>
                              <Input
                                id="edit-name"
                                value={editEmployee?.name || ""}
                                onChange={(e) =>
                                  editEmployee &&
                                  setEditEmployee({
                                    ...editEmployee,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-joining_date"
                                className="text-right"
                              >
                                Joining Date
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "col-span-3 justify-start text-left font-normal",
                                      !editEmployee?.joinDate &&
                                        "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editEmployee?.joinDate ? (
                                      format(editEmployee.joinDate, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={
                                      editEmployee?.joinDate
                                        ? new Date(editEmployee.joinDate)
                                        : undefined
                                    }
                                    onSelect={(date) =>
                                      editEmployee &&
                                      date &&
                                      setEditEmployee({
                                        ...editEmployee,
                                        joinDate: date.toISOString(),
                                      })
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-phone"
                                className="text-right"
                              >
                                Phone
                              </label>
                              <Input
                                id="edit-phone"
                                value={editEmployee?.phone || ""}
                                onChange={(e) =>
                                  editEmployee &&
                                  setEditEmployee({
                                    ...editEmployee,
                                    phone: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-email"
                                className="text-right"
                              >
                                Email
                              </label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editEmployee?.email || ""}
                                onChange={(e) =>
                                  editEmployee &&
                                  setEditEmployee({
                                    ...editEmployee,
                                    email: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleEditEmployee}
                              disabled={
                                !editEmployee?.name ||
                                !editEmployee?.employee_id ||
                                loading
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

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
                              onClick={() => {
                                dispatch(deleteEmployee(employee.id));
                              }}
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
                    {/* <EmployeeActions employee={employee} /> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
