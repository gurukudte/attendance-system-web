import {
  organizationUpdateSchema,
  organizationResponseSchema,
} from "@/lib/validators/organization";
import { z } from "zod";

type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
type OrganizationResponse = z.infer<typeof organizationResponseSchema>;

export const updateOrganization = async (
  id: string,
  data: OrganizationUpdateInput
): Promise<OrganizationResponse> => {
  try {
    // Client-side validation (optional but recommended)
    const validatedData = organizationUpdateSchema.parse(data);

    const response = await fetch(`/api/organizations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update organization");
    }

    const responseData = await response.json();

    // Optional: Validate response shape client-side
    return organizationResponseSchema.parse(responseData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      throw new Error("Invalid response data from server");
    }
    throw error; // Re-throw for the calling component to handle
  }
};
