import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteEmployee, Employee, setEmployees } from "../slice/employeeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";

export interface IEditEmployeeProps {
  employee: Employee;
}

export function EmployeeActions({ employee }: IEditEmployeeProps) {
  const { employees, loading } = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const openEditDialog = (employee: Employee) => {
    setEditEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };
  const handleEditEmployee = () => {
    if (!editEmployee) return;

    dispatch(
      setEmployees(
        employees.map((emp) =>
          emp.employee_id === editEmployee.employee_id ? editEmployee : emp
        )
      )
    );
    setIsEditDialogOpen(false);
  };
  return (
    <div className="flex justify-end gap-2" key={employee.employee_id}>
      <Dialog
        open={isEditDialogOpen && editEmployee?.id === employee.employee_id}
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
                        joinDate: date.toISOString(),
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
              This action cannot be undone. This will permanently delete the
              employee record.
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
  );
}
