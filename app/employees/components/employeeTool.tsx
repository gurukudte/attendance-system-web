"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

interface User {
  id: string;
  name: string;
}

interface EmployeeSelectorProps {
  onSelectionChange?: (selectedUsers: User[]) => void;
  onAddClick?: (selectedUsers: User[]) => void;
  className?: string;
}

export function EmployeeSelector({
  onSelectionChange,
  onAddClick,
  className = "",
}: EmployeeSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  // Fetch users from API when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/users"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await response.json();
        setAvailableUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return availableUsers;
    return availableUsers.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [availableUsers, searchTerm]);

  // Toggle individual selection
  const toggleSelection = (userId: string) => {
    const newSelection = selectedIds.includes(userId)
      ? selectedIds.filter((id) => id !== userId)
      : [...selectedIds, userId];
    setSelectedIds(newSelection);
    if (onSelectionChange) {
      onSelectionChange(
        availableUsers.filter((user) => newSelection.includes(user.id))
      );
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const newSelection =
      selectedIds.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.id);
    setSelectedIds(newSelection);
    if (onSelectionChange) {
      onSelectionChange(
        availableUsers.filter((user) => newSelection.includes(user.id))
      );
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick(
        availableUsers.filter((user) => selectedIds.includes(user.id))
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} selected
          </span>
          {onAddClick && (
            <Button
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={handleAddClick}
            >
              Add Selected
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-auto">
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
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
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
