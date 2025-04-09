import { useState } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ExpandableTableCell,
  AttendanceRecordsTable,
} from "@/components/ui/data-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

interface EmployeeShift {
  employee_id: string;
  employee_name: string;
  date: string;
  shift_type: string;
  shift_login: string;
  shift_logout: string;
  shift_duration: string;
  break_count: number;
  total_break_time: string;
}

const EmployeeTable = ({ employees }: { employees: EmployeeShift[] }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (employeeId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const getAttendanceRecords = (employeeId: string) => {
    return [
      {
        timestamp: "2023-05-15 08:45:22",
        punchIn: "08:45 AM",
        punchOut: "05:15 PM",
      },
      {
        timestamp: "2023-05-14 08:50:11",
        punchIn: "08:50 AM",
        punchOut: "05:10 PM",
      },
      {
        timestamp: "2023-05-13 08:42:33",
        punchIn: "08:42 AM",
        punchOut: "05:20 PM",
      },
    ];
  };

  return (
    <TableContainer height="550px">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead width="40px"></TableHead>
            <TableHead width="100px">Employee ID</TableHead>
            <TableHead width="150px">Employee Name</TableHead>
            <TableHead width="120px">Date</TableHead>
            <TableHead width="150px">Shift Type</TableHead>
            <TableHead width="120px">Shift Login</TableHead>
            <TableHead width="120px">Shift Logout</TableHead>
            <TableHead width="120px">Shift duration</TableHead>
            <TableHead width="100px">Break count</TableHead>
            <TableHead width="120px">Break duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <React.Fragment key={employee.employee_id + employee.date}>
              <TableRow
                isExpandable
                isExpanded={expandedRows[employee.employee_id]}
                onExpand={() => toggleRow(employee.employee_id)}
              >
                <TableCell width="40px">
                  {expandedRows[employee.employee_id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </TableCell>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{employee.employee_name}</TableCell>
                <TableCell>{employee.date}</TableCell>
                <TableCell>{employee.shift_type}</TableCell>
                <TableCell>{employee.shift_login}</TableCell>
                <TableCell>{employee.shift_logout}</TableCell>
                <TableCell>{employee.shift_duration}</TableCell>
                <TableCell>{employee.break_count}</TableCell>
                <TableCell>{employee.total_break_time}</TableCell>
              </TableRow>
              {expandedRows[employee.employee_id] && (
                <TableRow>
                  <ExpandableTableCell>
                    <AttendanceRecordsTable
                      records={getAttendanceRecords(employee.employee_id)}
                    />
                  </ExpandableTableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;
