// lib/validators/employee.ts
import { z } from "zod";

// Define enums to match Prisma
const Role = z.enum(["SUPERADMIN", "ADMIN", "USER"]);
const EmployeeStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "TERMINATED",
]);
const EmployeeRole = z.enum([
  "EMPLOYEE",
  "MANAGER",
  "ADMIN",
  "RA",
  "VOLUNTEER",
  "IT_TECHNICIAN",
  "NEURO_TECHNICIAN",
  "INTERN",
  "CONTRACTOR",
]);

// Base employee schema
export const employeeSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  position: EmployeeRole.default("EMPLOYEE"),
  joinDate: z.coerce.date().optional(),
  lastWorkingDay: z.coerce.date().optional(),
  status: EmployeeStatus.default("ACTIVE"),
  role: Role.default("USER"),
  customData: z.record(z.any()).optional(),
});

// Schema for creating multiple employees
export const employeeArraySchema = z.array(employeeSchema);

// Schema for updating an employee (all fields optional except orgId)
export const employeeUpdateSchema = employeeSchema.partial().required({
  orgId: true,
});

// Type exports
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeArrayInput = z.infer<typeof employeeArraySchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
