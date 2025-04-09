"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  PlusCircle,
  Pencil,
  Trash2,
  User,
  Check,
  X,
  CalendarIcon,
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

interface Employee {
  id: string;
  organization: string;
  employee_id: string;
  name: string;
  joining_date: Date;
  phone: string;
  email: string;
}

export function EmployeesView() {
  // Sample initial employees
  const initialEmployees: Employee[] = [
    {
      id: "1",
      organization: "Acme Inc",
      employee_id: "EMP001",
      name: "John Doe",
      joining_date: new Date(2022, 0, 15),
      phone: "555-0101",
      email: "john.doe@acme.com",
    },
    {
      id: "2",
      organization: "Acme Inc",
      employee_id: "EMP002",
      name: "Jane Smith",
      joining_date: new Date(2022, 2, 20),
      phone: "555-0102",
      email: "jane.smith@acme.com",
    },
  ];

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    organization: "Acme Inc",
    employee_id: "",
    name: "",
    joining_date: new Date(),
    phone: "",
    email: "",
  });
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.employee_id) return;

    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    };

    setEmployees([...employees, employee]);
    resetNewEmployeeForm();
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = () => {
    if (!editEmployee) return;

    setEmployees(
      employees.map((emp) => (emp.id === editEmployee.id ? editEmployee : emp))
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteEmployee = () => {
    if (!deleteEmployeeId) return;

    setEmployees(employees.filter((emp) => emp.id !== deleteEmployeeId));
    setDeleteEmployeeId(null);
  };

  const resetNewEmployeeForm = () => {
    setNewEmployee({
      organization: "Acme Inc",
      employee_id: "",
      name: "",
      joining_date: new Date(),
      phone: "",
      email: "",
    });
  };

  const openEditDialog = (employee: Employee) => {
    setEditEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Employee Management
        </h2>
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
                <label htmlFor="organization" className="text-right">
                  Organization
                </label>
                <Input
                  id="organization"
                  value={newEmployee.organization}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      organization: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
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
                        !newEmployee.joining_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEmployee.joining_date ? (
                        format(newEmployee.joining_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEmployee.joining_date}
                      onSelect={(date) =>
                        date &&
                        setNewEmployee({ ...newEmployee, joining_date: date })
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
      </div>

      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead className="w-[100px]">Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.employee_id}
                  </TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.organization}</TableCell>
                  <TableCell>
                    {format(employee.joining_date, "MMM dd, yyyy")}
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
                            onClick={() => openEditDialog(employee)}
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
                                htmlFor="edit-organization"
                                className="text-right"
                              >
                                Organization
                              </label>
                              <Input
                                id="edit-organization"
                                value={editEmployee?.organization || ""}
                                onChange={(e) =>
                                  editEmployee &&
                                  setEditEmployee({
                                    ...editEmployee,
                                    organization: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
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
                                      !editEmployee?.joining_date &&
                                        "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editEmployee?.joining_date ? (
                                      format(editEmployee.joining_date, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={editEmployee?.joining_date}
                                    onSelect={(date) =>
                                      editEmployee &&
                                      date &&
                                      setEditEmployee({
                                        ...editEmployee,
                                        joining_date: date,
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
                                !editEmployee?.employee_id
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
                            <AlertDialogCancel
                              onClick={() => setDeleteEmployeeId(null)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                setDeleteEmployeeId(employee.id);
                                handleDeleteEmployee();
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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
