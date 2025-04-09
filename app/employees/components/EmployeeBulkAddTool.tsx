"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import { createMultipleEmployees, Employee } from "../slice/employeeSlice";
import { employeeArraySchema } from "@/lib/validators/employee";

export interface User {
  id: string;
  name: string;
}

export function EmployeeAdditionTool() {
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector((state) => state.organization);
  const { employees, loading, error } = useAppSelector(
    (state) => state.employees
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const addedEmployees = employees.map((employee) => employee.employee_id);
  console.log(addedEmployees);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8000/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: User[] = await response.json();
        setAvailableUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    const data = availableUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return data.filter((user) => !addedEmployees.includes(user.id));
  }, [addedEmployees, availableUsers, searchTerm]);

  const toggleSelection = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((user) => user.id));
    }
  };

  const handleSubmit = () => {
    const selectedUsers = availableUsers.filter((user) =>
      selectedIds.includes(user.id)
    );
    const selectedEmployees: Partial<Employee>[] = selectedUsers.map(
      (user) => ({
        employee_id: user.id,
        orgId: organization.id,
        name: user.name,
      })
    );
    dispatch(createMultipleEmployees(selectedEmployees));
  };

  // This effect will run when the loading state changes
  useEffect(() => {
    if (!loading && !error) {
      // Only close if not loading AND no error
      setIsOpen(false);
      setSelectedIds([]);
      setSearchTerm("");
    }

    // Optional: Handle errors
    if (error) {
      // You might want to show an error toast here
      console.error("Error creating employees:", error);
    }
  }, [loading, error]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Employees</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Add Employees</DialogTitle>
          </DialogHeader>

          <div className="px-6">
            <Input
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </div>

          <div className="flex-1 overflow-hidden px-6">
            <div className="h-full rounded-md border overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            filteredUsers.length > 0 &&
                            selectedIds.length === filteredUsers.length
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(user.id)}
                              onCheckedChange={() => toggleSelection(user.id)}
                              aria-label={`Select ${user.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Label htmlFor={`user-${user.id}`}>
                              {user.name}
                            </Label>
                          </TableCell>
                          <TableCell>{user.id}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          {searchTerm
                            ? "No matching users found"
                            : "No users available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedIds([]);
                  setSearchTerm("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="min-w-36"
                disabled={selectedIds.length === 0 || isLoading || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Add Selected"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
