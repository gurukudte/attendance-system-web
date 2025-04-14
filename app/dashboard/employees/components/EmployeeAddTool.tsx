import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Employee,
  EmployeeRole,
  EmployeeStatus,
  Role,
  setEmployees,
} from "../slice/employeeSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeAddTool() {
  const initialNewEmployee = {
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    joinDate: null,
    position: EmployeeRole.EMPLOYEE,
    status: EmployeeStatus.ACTIVE,
    role: Role.USER, // <-- Add this
    onLeave: false,
  };
  const { employees } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] =
    useState<
      Omit<Employee, "id" | "createdAt" | "updatedAt" | "orgId" | "org">
    >(initialNewEmployee);

  const resetNewEmployeeForm = () => {
    setNewEmployee(initialNewEmployee);
  };
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.employee_id) return;

    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      orgId: "",
      org: "",
      createdAt: new Date(parseInt(Date.now().toString(), 10)),
      updatedAt: new Date(parseInt(Date.now().toString(), 10)),
    };

    dispatch(setEmployees([...employees, employee]));
    resetNewEmployeeForm();
    setIsAddDialogOpen(false);
  };

  return (
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
                      joinDate: date,
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
              value={newEmployee.phone || ""}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-email" className="text-right">
              Position
            </label>
            <Select
              value={newEmployee?.role ?? ""}
              onValueChange={(value) => {
                if (editEmployee) {
                  setEditEmployee({
                    ...editEmployee,
                    position: value as EmployeeRole,
                  });
                }
              }}
              disabled={!newEmployee}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmployeeRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
  );
}
