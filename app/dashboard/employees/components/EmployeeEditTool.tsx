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
import { CalendarIcon, Check, Pencil, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Employee,
  EmployeeRole,
  EmployeeStatus,
  Role,
  setEmployees,
  updateEmployee,
} from "../slice/employeeSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EmployeeEditTool({ employee }: { employee: Employee }) {
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
  const { loading, error } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditEmployee = () => {
    if (!editEmployee) return;

    const apiData = Object.fromEntries(
      Object.entries(editEmployee).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    dispatch(updateEmployee({ id: editEmployee.id, data: apiData }));
  };

  const openEditDialog = (employee: Employee) => {
    setEditEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

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
    <Dialog
      open={isEditDialogOpen && editEmployee?.id === employee.id}
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
            <label htmlFor="edit-employee_id" className="text-right">
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
            <label htmlFor="edit-joining_date" className="text-right">
              Joining Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !editEmployee?.joinDate && "text-muted-foreground"
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
                      joinDate: date,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-phone" className="text-right">
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
            <label htmlFor="edit-email" className="text-right">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-email" className="text-right">
              Position
            </label>
            <Select
              value={editEmployee?.position}
              onValueChange={(value) => {
                if (editEmployee) {
                  setEditEmployee({
                    ...editEmployee,
                    position: value as EmployeeRole,
                  });
                }
              }}
              disabled={!editEmployee}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmployeeRole).map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleEditEmployee}
            disabled={
              !editEmployee?.name || !editEmployee?.employee_id || loading
            }
          >
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
