// app/dashboard/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  ArrowRight,
  Edit,
  Check,
  X,
  MoreVertical,
  Download,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockEmployees, mockSchedules } from "./mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  onLeave: boolean;
  phone: string;
  email: string;
}

interface EmployeeSchedule {
  id: string;
  employee_id: string;
  employee_name: string;
  position: string;
  date: Date;
  shift: string;
  location: string;
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [editMode, setEditMode] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [leaveFilter, setLeaveFilter] = useState<string>("all");
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>(mockSchedules);

  // Filter schedules for the selected day and location
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const employee = employees.find((e) => e.id === schedule.employee_id);
      const matchesDate = isSameDay(schedule.date, date);
      const matchesLocation =
        locationFilter === "all" || schedule.location === locationFilter;
      const matchesLeaveStatus =
        leaveFilter === "all" ||
        (leaveFilter === "onLeave" && employee?.onLeave) ||
        (leaveFilter === "notOnLeave" && !employee?.onLeave);

      return matchesDate && matchesLocation && matchesLeaveStatus;
    });
  }, [schedules, date, locationFilter, leaveFilter, employees]);

  // Get unique positions and locations
  const positions = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.position))).sort();
  }, [employees]);

  const locations = useMemo(() => {
    return Array.from(new Set(schedules.map((s) => s.location)));
  }, [schedules]);

  // Count employees by position
  const positionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    positions.forEach((position) => {
      counts[position] = employees.filter(
        (e) => e.position === position
      ).length;
    });
    return counts;
  }, [employees, positions]);

  // Count employees on leave
  const onLeaveCount = useMemo(() => {
    return employees.filter((e) => e.onLeave).length;
  }, [employees]);

  // Add new schedule
  const handleAddSchedule = (
    employeeId: string,
    shift: string,
    location: string
  ) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    const newSchedule: EmployeeSchedule = {
      id: `new-${Date.now()}`,
      employee_id: employee.id,
      employee_name: employee.name,
      position: employee.position,
      date: new Date(date),
      shift,
      location,
    };
    setSchedules([...schedules, newSchedule]);
  };

  // Remove schedule
  const handleRemoveSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter((s) => s.id !== scheduleId));
  };

  // Move schedule to different shift
  const handleMoveSchedule = (scheduleId: string, newShift: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === scheduleId ? { ...s, shift: newShift } : s
      )
    );
  };

  // Toggle employee leave status
  const toggleLeaveStatus = (employeeId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId ? { ...emp, onLeave: !emp.onLeave } : emp
      )
    );
  };

  // Download schedule as CSV
  const downloadSchedule = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Position",
      "Date",
      "Shift",
      "Location",
      "On Leave",
    ];
    const data = filteredSchedules.map((schedule) => {
      const employee = employees.find((e) => e.id === schedule.employee_id);
      return [
        employee?.employee_id || "",
        schedule.employee_name,
        schedule.position,
        format(schedule.date, "yyyy-MM-dd"),
        SHIFTS.find((s) => s.id === schedule.shift)?.name || schedule.shift,
        schedule.location,
        employee?.onLeave ? "Yes" : "No",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `schedule_${format(date, "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex flex-col space-y-4">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-xl font-bold">Daily Schedule</h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[200px] justify-start text-left font-normal text-sm"
                  disabled={editMode}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
              disabled={editMode}
            >
              <SelectTrigger className="w-full sm:w-[150px] text-sm">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={leaveFilter}
              onValueChange={setLeaveFilter}
              disabled={editMode}
            >
              <SelectTrigger className="w-full sm:w-[150px] text-sm">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="onLeave">On Leave Only</SelectItem>
                <SelectItem value="notOnLeave">Not On Leave</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className="text-sm"
            >
              {editMode ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Done
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={downloadSchedule}
              className="text-sm"
              disabled={editMode}
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {positions.map((position) => (
            <Card key={position} className="p-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{position}</span>
                <Badge variant="outline" className="text-sm">
                  {positionCounts[position] || 0}
                </Badge>
              </div>
            </Card>
          ))}
          <Card className="p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">On Leave</span>
              <Badge variant="outline" className="text-sm">
                {onLeaveCount}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Schedule Table */}
        <Card className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 min-w-[120px]">
                    Position
                  </th>
                  {SHIFTS.map((shift) => (
                    <th
                      key={shift.id}
                      className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
                    >
                      <div className="font-medium">{shift.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.map((position) => {
                  const positionEmployees = employees.filter(
                    (e) => e.position === position
                  );
                  return (
                    <tr key={position} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {position}
                      </td>
                      {SHIFTS.map((shift) => {
                        const shiftSchedules = filteredSchedules.filter(
                          (s) => s.position === position && s.shift === shift.id
                        );
                        return (
                          <td
                            key={`${position}-${shift.id}`}
                            className="px-3 py-2 border-r"
                          >
                            <div className="flex flex-col space-y-1">
                              {shiftSchedules.map((schedule) => {
                                const employee = employees.find(
                                  (e) => e.id === schedule.employee_id
                                );
                                return (
                                  <div
                                    key={schedule.id}
                                    className={`p-1 rounded text-xs ${
                                      employee?.onLeave
                                        ? "bg-amber-50 text-amber-800"
                                        : "bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <span className="font-medium">
                                          {schedule.employee_name}
                                        </span>
                                        {employee?.onLeave && (
                                          <Badge
                                            variant="secondary"
                                            className="ml-1 text-xs"
                                          >
                                            On Leave
                                          </Badge>
                                        )}
                                      </div>
                                      {editMode && (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-5 w-5"
                                            >
                                              <MoreVertical className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                            align="end"
                                            className="w-48"
                                          >
                                            <DropdownMenuItem
                                              onClick={() =>
                                                employee &&
                                                toggleLeaveStatus(employee.id)
                                              }
                                            >
                                              {employee?.onLeave ? (
                                                <Check className="mr-2 h-3 w-3 text-green-500" />
                                              ) : (
                                                <X className="mr-2 h-3 w-3 text-amber-500" />
                                              )}
                                              {employee?.onLeave
                                                ? "Mark as returned"
                                                : "Mark as on leave"}
                                            </DropdownMenuItem>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <DropdownMenuItem
                                                  onSelect={(e) =>
                                                    e.preventDefault()
                                                  }
                                                >
                                                  <ArrowRight className="mr-2 h-3 w-3" />
                                                  Move to shift
                                                </DropdownMenuItem>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent
                                                side="right"
                                                className="w-48"
                                              >
                                                {SHIFTS.filter(
                                                  (s) => s.id !== shift.id
                                                ).map((s) => (
                                                  <DropdownMenuItem
                                                    key={s.id}
                                                    onClick={() =>
                                                      handleMoveSchedule(
                                                        schedule.id,
                                                        s.id
                                                      )
                                                    }
                                                  >
                                                    {s.name}
                                                  </DropdownMenuItem>
                                                ))}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleRemoveSchedule(
                                                  schedule.id
                                                )
                                              }
                                              className="text-red-500"
                                            >
                                              <Trash2 className="mr-2 h-3 w-3" />
                                              Remove
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {editMode && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs"
                                    >
                                      <PlusCircle className="mr-1 h-3 w-3" />{" "}
                                      Add
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle className="text-sm">
                                        Add Schedule
                                      </DialogTitle>
                                    </DialogHeader>
                                    <AddScheduleForm
                                      employees={positionEmployees}
                                      onAddSchedule={handleAddSchedule}
                                      shift={shift.id}
                                      position={position}
                                      locations={locations}
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

function AddScheduleForm({
  employees,
  onAddSchedule,
  shift,
  position,
  locations,
}: {
  employees: Employee[];
  onAddSchedule: (employeeId: string, shift: string, location: string) => void;
  shift: string;
  position: string;
  locations: string[];
}) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || "");

  const availableEmployees = employees.filter((emp) => !emp.onLeave);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee && selectedLocation) {
      onAddSchedule(selectedEmployee, shift, selectedLocation);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Employee ({position})
        </label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {availableEmployees.map((employee) => (
              <SelectItem
                key={employee.id}
                value={employee.id}
                className="text-sm"
              >
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location} className="text-sm">
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="sm" className="w-full">
        Add to Schedule
      </Button>
    </form>
  );
}
