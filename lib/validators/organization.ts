import { z } from "zod";

// Base Schemas
const customEmployeeFields = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // type: z.enum(["text", "number", "date", "boolean"]),
  type: z.string().min(2),
  required: z.boolean().default(false),
});

const apiKeySchema = z.object({
  name: z.string().min(2),
  key: z.string().min(10, "API key must be at least 10 characters"),
});

const adminUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["Super Admin", "Manager", "Viewer"]).default("Viewer"),
});

// Organization Schemas
export const organizationCreateSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  timezone: z.string().optional(),
  dateFormat: z.string().optional().default("MM/DD/YYYY"),
  customEmployeeFields: z.array(customEmployeeFields).optional(),
  apiKeys: z.array(apiKeySchema).optional(),
  adminUsers: z.array(adminUserSchema).optional(),
});

export const organizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  timezone: z.string().nullable(),
  dateFormat: z.string(),
  customEmployeeFields: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        orgId: z.string(),
      })
    )
    .optional(),
  apiKeys: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        key: z.string(),
        orgId: z.string(),
        createdAt: z.string(),
      })
    )
    .optional(),
  adminUsers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
        orgId: z.string(),
      })
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const organizationUpdateSchema = organizationCreateSchema.partial();
// Infer Types from Schemas
export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
export type CustomFieldInput = z.infer<typeof customEmployeeFields>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;

export type OrganizationResponse = z.infer<typeof organizationResponseSchema>;
