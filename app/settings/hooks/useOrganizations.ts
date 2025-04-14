import { useState, useEffect, useRef } from "react";
import {
  ApiKey,
  customEmployeeFields,
  Organization,
} from "@/types/organization";
import {
  organizationResponseSchema,
  OrganizationUpdateInput,
  organizationUpdateSchema,
} from "@/lib/validators/organization";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import {
  setLoadingAndError,
  updateOrganizationData,
} from "../slice/organizationSlice";

export function useOrganizations() {
  const { organization, loading, error } = useAppSelector(
    (state) => state.organization
  );
  const dispatch = useAppDispatch();

  //pending changes to the organization state
  const [pendingChanges, setPendingChanges] = useState(false);

  // Helper function for handling errors
  const handleError = (err: unknown) => {
    if (err instanceof DOMException && err.name === "AbortError") {
      return; // Ignore abort errors
    }
    const message =
      err instanceof Error
        ? err.message
        : err instanceof z.ZodError
        ? "Validation failed"
        : "Unknown error";
    dispatch(setLoadingAndError({ loading: false, error: message }));
    throw err;
  };

  // Update existing organization
  const updateOrganization = async (
    id: string,
    data: OrganizationUpdateInput
  ) => {
    try {
      dispatch(setLoadingAndError({ loading: true, error: null }));
      const validatedData = organizationUpdateSchema.parse(data);
      const response = await fetch(`/api/organizations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updatedOrg = organizationResponseSchema.parse(
        await response.json()
      ) as unknown as Organization;
      if (organization.id === id) {
        dispatch(updateOrganizationData(updatedOrg as Organization));
      }
      return updatedOrg;
    } catch (err) {
      return handleError(err);
    } finally {
      dispatch(setLoadingAndError({ loading: false, error: null }));
    }
  };

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateOrganizationData({ [name]: type === "checkbox" ? checked : value })
    );
    setPendingChanges(true);
  };
  return {
    organization,
    handleChanges,
    pendingChanges,
    setPendingChanges,
    loading,
    error,
    updateOrganization,
  };
}
