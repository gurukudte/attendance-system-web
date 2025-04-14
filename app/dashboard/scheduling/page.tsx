// app/dashboard/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Employee,
  EmployeeRole,
  fetchEmployees,
  updateEmployee,
} from "../employees/slice/employeeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import { fetchOrganization } from "@/app/settings/slice/organizationSlice";
import {
  createSchedule,
  deleteSchedule,
  fetchSchedulesByDate,
  updateSchedule,
} from "./slice/scheduleSlice";
import { AddScheduleForm } from "./components/AddScheduleForm";

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

interface IShift {
  id: string;
  name: string;
  start: string;
  end: string;
}

export default function DashboardPage() {
  const currentOrganizationId = "67f1e13bfb895c54401edaf2";
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const { organization } = useAppSelector((state) => state.organization);
  const { schedules } = useAppSelector((state) => state.schedules);
  const [date, setDate] = useState<Date>(new Date());
  const [editMode, setEditMode] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [leaveFilter, setLeaveFilter] = useState<string>("all");

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const employee = employees.find((e) => e.id === schedule.employee_id);
      const matchesDate = isSameDay(new Date(schedule.date), new Date(date));
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
  const positions = ["Floor Manager", "RA", "Technician", "Volunteer"];

  const locations = ["Third_floor", "Sixth_floor"];
  // Count employees by position
  const positionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    positions.forEach((position, index) => {
      let count = 0;

      switch (index) {
        case 0:
          count = filteredSchedules.filter((s) =>
            position.toLowerCase().includes(s.position.toLowerCase())
          ).length;
          break;
        case 1:
          count = filteredSchedules.filter(
            (s) => position === s.position
          ).length;
          break;
        case 2:
          count = filteredSchedules.filter((s) =>
            s.position.toLowerCase().includes(position.toLowerCase())
          ).length;
          break;
        case 3:
          count = filteredSchedules.filter(
            (s) => position.toLowerCase() === s.position.toLowerCase()
          ).length;
          break;
        default:
          count = filteredSchedules.length;
      }

      counts[position] = count;
    });
    return counts;
  }, [filteredSchedules, positions]);

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
      orgId: organization.id,
      employee_id: employee.id,
      employee_name: employee.name,
      position: employee.position,
      date: date,
      shift,
      location,
    };
    // dispatch(setSchedules([...schedules, newSchedule]));
    const { id, createdAt, updatedAt, ...createApiData } = newSchedule;
    dispatch(createSchedule(createApiData));
  };

  // Remove schedule
  const handleRemoveSchedule = (scheduleId: string) => {
    dispatch(deleteSchedule(scheduleId));
  };

  // Move schedule to different shift
  const handleMoveSchedule = (scheduleId: string, newShift: string) => {
    dispatch(
      updateSchedule({
        id: scheduleId,
        shift: newShift,
      })
    );
  };

  // Toggle employee leave status
  const toggleLeaveStatus = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);

    if (employee) {
      dispatch(
        updateEmployee({
          id: employee.id,
          data: { onLeave: !employee.onLeave },
        })
      );
    }
  };

  // Download schedule as CSV
  const downloadSchedule = (): void => {
    // Group employees by position and shift
    const groupedData: Record<string, Record<string, string[]>> = {};

    // Initialize shift types from the image
    const shiftTypes: string[] = SHIFTS.map((s) => s.name);

    // Create structure for grouped data
    shiftTypes.forEach((shift: string) => {
      groupedData[shift] = {};
      positions.forEach((position: string) => {
        groupedData[shift][position] = [];
      });
    });

    // Group on-leave employees by position
    const onLeaveEmployees: Record<string, string[]> = {};
    positions.forEach((position: string) => {
      onLeaveEmployees[position] = [];
    });

    // Populate the grouped data
    schedules.forEach((schedule: EmployeeSchedule) => {
      const employee: Employee | undefined = employees.find(
        (e: Employee) => e.id === schedule.employee_id
      );
      const shiftName: string =
        SHIFTS.find((s: IShift) => s.id === schedule.shift)?.name ||
        schedule.shift;

      // Check if this is one of our defined shift types
      const matchedShift: string | undefined = shiftTypes.find((s: string) =>
        s.includes(shiftName)
      );
      if (matchedShift && employee) {
        // Adjust position names to match the image
        let position: string = schedule.position;
        if (schedule.position === EmployeeRole.MANAGER) position = positions[0];
        if (schedule.position === EmployeeRole.RA) position = positions[1];
        if (
          schedule.position === EmployeeRole.IT_TECHNICIAN ||
          schedule.position === EmployeeRole.NEURO_TECHNICIAN
        )
          position = positions[2];
        if (schedule.position === EmployeeRole.VOLUNTEER)
          position = positions[3];
        if (groupedData[matchedShift][position]) {
          groupedData[matchedShift][position].push(employee.name);
        }
      }
    });
    // Populate on-leave employees
    employees.forEach((employee: Employee) => {
      if (employee.onLeave) {
        let position: string = employee.position;
        if (employee.position === EmployeeRole.MANAGER) position = positions[0];
        if (employee.position === EmployeeRole.RA) position = positions[1];
        if (
          employee.position === EmployeeRole.IT_TECHNICIAN ||
          employee.position === EmployeeRole.NEURO_TECHNICIAN
        )
          position = positions[2];
        if (employee.position === EmployeeRole.VOLUNTEER)
          position = positions[3];
        if (onLeaveEmployees[position]) {
          onLeaveEmployees[position].push(employee.name);
        }
      }
    });

    // Prepare CSV content
    const csvRows: string[] = [];

    // Add header row
    const headers: string[] = ["Position", ...shiftTypes, "On Leave"];
    csvRows.push(headers.join(","));

    // Add data rows for each position
    positions.forEach((position: string) => {
      const row: string[] = [position];

      // Add employees for each shift
      shiftTypes.forEach((shift: string) => {
        const employeesInShift: string[] = groupedData[shift][position] || [];
        row.push(employeesInShift.join(", "));
      });

      // Add on-leave employees
      row.push(onLeaveEmployees[position].join(", "));

      csvRows.push(row.join(","));
    });

    // Create and download CSV
    const csvContent: string = csvRows.join("\n");
    const blob: Blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url: string = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `schedule_${format(date, "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const positionedEmployees = (position: string) => {
    switch (position) {
      case positions[0]:
        return employees.filter((e) =>
          position.toLowerCase().includes(e.position.toLowerCase())
        );
      case positions[1]:
        return employees.filter((e) => position === e.position);
      case positions[2]:
        return employees.filter((e) =>
          e.position.toLowerCase().includes(position.toLowerCase())
        );
      case positions[3]:
        return employees.filter(
          (e) => position.toLowerCase() === e.position.toLowerCase()
        );
      default:
        return employees;
    }
  };
  const positionedShiftSchedules = (position: string, shift: IShift) => {
    switch (position) {
      case positions[0]:
        return filteredSchedules.filter(
          (s) =>
            position.toLowerCase().includes(s.position.toLowerCase()) &&
            s.shift === shift.id
        );
      case positions[1]:
        return filteredSchedules.filter(
          (s) => position === s.position && s.shift === shift.id
        );
      case positions[2]:
        return filteredSchedules.filter(
          (s) =>
            s.position.toLowerCase().includes(position.toLowerCase()) &&
            s.shift === shift.id
        );
      case positions[3]:
        return filteredSchedules.filter(
          (s) =>
            position.toLowerCase() === s.position.toLowerCase() &&
            s.shift === shift.id
        );
      default:
        return filteredSchedules;
    }
  };

  useEffect(() => {
    dispatch(fetchOrganization(currentOrganizationId));
    dispatch(fetchEmployees(currentOrganizationId));
    dispatch(
      fetchSchedulesByDate({
        date: date.toISOString(),
        orgId: currentOrganizationId,
      })
    );
  }, []);

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
          <ScrollArea className="h-[calc(100vh-300px)]">
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
                  const positionEmployees = positionedEmployees(position);

                  return (
                    <tr key={position} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {position}
                      </td>
                      {SHIFTS.map((shift) => {
                        const shiftSchedules = positionedShiftSchedules(
                          position,
                          shift
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
                                            <DropdownMenuSub>
                                              <DropdownMenuSubTrigger>
                                                <ArrowRight className="mr-2 h-3 w-3" />
                                                Move to shift
                                              </DropdownMenuSubTrigger>
                                              <DropdownMenuSubContent className="w-48">
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
                                              </DropdownMenuSubContent>
                                            </DropdownMenuSub>
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
                                      onAddScheduleAction={handleAddSchedule}
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
