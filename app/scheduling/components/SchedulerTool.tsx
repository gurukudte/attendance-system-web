"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  MoveRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import { fetchOrganization } from "@/app/settings/slice/organizationSlice";
import { fetchEmployees } from "@/app/employees/slice/employeeSlice";

const SHIFTS = [
  { id: "morning", name: "Morning (6AM - 2PM)", start: "06:00", end: "14:00" },
  { id: "evening", name: "Evening (2PM - 10PM)", start: "14:00", end: "22:00" },
  { id: "night", name: "Night (10PM - 6AM)", start: "22:00", end: "06:00" },
  { id: "day", name: "Day (6AM - 6PM)", start: "06:00", end: "18:00" },
  {
    id: "overnight",
    name: "Overnight (6PM - 6AM)",
    start: "18:00",
    end: "06:00",
  },
];

interface EmployeeSchedule {
  id: string;
  employee_id: string;
  employee_name: string;
  position: string;
  date: Date;
  shift: string;
  location: string;
}

export default function SchedulingView() {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    employee_id: "",
    date: new Date(),
    shift: "morning",
  });
  const [activeTab, setActiveTab] = useState("morning");
  const [moveDialog, setMoveDialog] = useState({
    open: false,
    scheduleId: "",
    currentShift: "",
  });
  const [newShift, setNewShift] = useState("morning");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const getEmployeeName = (id: string) => {
    return employees.find((emp) => emp.employee_id === id)?.name || "";
  };

  const handleAddSchedule = () => {
    if (!newSchedule.employee_id) return;

    const employeeName = getEmployeeName(newSchedule.employee_id);
    if (!employeeName) return;

    const schedule: EmployeeSchedule = {
      id: Date.now().toString(),
      employee_id: newSchedule.employee_id,
      employee_name: employeeName,
      position: "",
      location: "",
      date: newSchedule.date,
      shift: activeTab, // Use the active tab as the shift
    };

    setSchedules([...schedules, schedule]);
    setNewSchedule({
      employee_id: "",
      date: new Date(),
      shift: activeTab,
    });
    setAddDialogOpen(false);
  };

  const handleRemoveSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const openMoveDialog = (scheduleId: string, currentShift: string) => {
    setMoveDialog({
      open: true,
      scheduleId,
      currentShift,
    });
    setNewShift(currentShift);
  };

  const handleMoveEmployee = () => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === moveDialog.scheduleId
          ? { ...schedule, shift: newShift }
          : schedule
      )
    );
    setMoveDialog({ open: false, scheduleId: "", currentShift: "" });
  };

  const addedEmployeeIds = schedules.map((schedule) => schedule.employee_id);
  const notAddedEmployees = useMemo(() => {
    return employees.filter(
      (employee) => !addedEmployeeIds.includes(employee.employee_id)
    );
  }, [employees, schedules]);
  console.log(notAddedEmployees);
  const currentShiftSchedules = schedules.filter((s) => s.shift === activeTab);
  useEffect(() => {
    dispatch(fetchOrganization("67f1e13bfb895c54401edaf2"));
    dispatch(fetchEmployees("67f1e13bfb895c54401edaf2"));
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Shift Scheduling
      </h2>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {SHIFTS.map((shift) => (
            <TabsTrigger
              key={shift.id}
              value={shift.id}
              className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700"
            >
              {shift.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Current Shift Schedules */}
          <TabsContent
            value={activeTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 flex items-center mb-4">
                  <Users className="mr-2 h-5 w-5" />
                  {SHIFTS.find((s) => s.id === activeTab)?.name} Employees
                </h3>
                {/* Add Schedule Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => setAddDialogOpen(true)}
                    disabled={employees.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Assign Employee
                  </Button>
                </div>
              </div>

              {currentShiftSchedules.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No employees scheduled for this shift yet.
                </p>
              ) : (
                <div className="rounded-md border dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                  <div className="overflow-auto flex-1">
                    <Table className="dark:bg-gray-800">
                      <TableHeader className="dark:bg-gray-700 sticky top-0">
                        <TableRow className="dark:hover:bg-gray-700">
                          <TableHead className="dark:text-gray-200 min-w-[150px]">
                            Employee
                          </TableHead>
                          <TableHead className="dark:text-gray-200 min-w-[150px]">
                            Date
                          </TableHead>
                          <TableHead className="dark:text-gray-200 min-w-[150px]">
                            Shift Hours
                          </TableHead>
                          <TableHead className="dark:text-gray-200 w-40">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentShiftSchedules.map((schedule) => {
                          const shift = SHIFTS.find(
                            (s) => s.id === schedule.shift
                          );
                          return (
                            <TableRow
                              key={schedule.id}
                              className="dark:hover:bg-gray-700"
                            >
                              <TableCell className="dark:text-gray-300">
                                {schedule.employee_name}
                              </TableCell>
                              <TableCell className="dark:text-gray-300">
                                {format(schedule.date, "PPP")}
                              </TableCell>
                              <TableCell className="dark:text-gray-300">
                                {shift?.start} - {shift?.end}
                              </TableCell>
                              <TableCell className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    openMoveDialog(schedule.id, schedule.shift)
                                  }
                                >
                                  <MoveRight className="h-4 w-4 mr-1" />
                                  <span className="sr-only sm:not-sr-only">
                                    Move
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  onClick={() =>
                                    handleRemoveSchedule(schedule.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Add Employee Dialog */}
      <AlertDialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Assign Employee to {SHIFTS.find((s) => s.id === activeTab)?.name}{" "}
              Shift
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee
              </label>
              <Select
                value={newSchedule.employee_id}
                onValueChange={(value) =>
                  setNewSchedule({ ...newSchedule, employee_id: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {notAddedEmployees.map((employee) => (
                    <SelectItem
                      key={employee.employee_id}
                      value={employee.employee_id}
                      className="dark:hover:bg-gray-700"
                    >
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                      !newSchedule.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newSchedule.date ? (
                      format(newSchedule.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-gray-800">
                  <Calendar
                    mode="single"
                    selected={newSchedule.date}
                    onSelect={(date) =>
                      date && setNewSchedule({ ...newSchedule, date })
                    }
                    initialFocus
                    className="dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-gray-600 dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handleAddSchedule}
              disabled={!newSchedule.employee_id}
            >
              Assign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Move Employee Dialog */}
      <AlertDialog
        open={moveDialog.open}
        onOpenChange={(open) => setMoveDialog({ ...moveDialog, open })}
      >
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Move Employee to Different Shift
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Select the new shift for this employee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select
              value={newShift}
              onValueChange={(value) => setNewShift(value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Select new shift" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                {SHIFTS.filter(
                  (shift) => shift.id !== moveDialog.currentShift
                ).map((shift) => (
                  <SelectItem
                    key={shift.id}
                    value={shift.id}
                    className="dark:hover:bg-gray-700"
                  >
                    {shift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-gray-600 dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handleMoveEmployee}
            >
              Confirm Move
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
