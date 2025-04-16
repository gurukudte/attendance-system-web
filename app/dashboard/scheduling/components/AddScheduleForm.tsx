"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/app/dashboard/employees/slice/employeeSlice";
import e from "cors";
import { useAppSelector } from "@/redux/hooks/useAppSelector";

export function AddScheduleForm({
  employees,
  onAddScheduleAction,
  shift,
  position,
  locations,
}: {
  employees: Employee[];
  onAddScheduleAction: (
    employeeId: string,
    shift: string,
    location: string
  ) => void;
  shift: string;
  position: string;
  locations: string[];
}) {
  const { schedules } = useAppSelector((state) => state.schedules);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || "");
  const onLeaveEmployees = schedules.filter((s) => s.onLeave);
  const onLeaveEmployeeIds =
    onLeaveEmployees.length > 0
      ? onLeaveEmployees.map((s) => s.employee_id)
      : [];
  const availableEmployees = employees.filter(
    (emp) => !onLeaveEmployeeIds.includes(emp.id)
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee && selectedLocation) {
      onAddScheduleAction(selectedEmployee, shift, selectedLocation);
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
