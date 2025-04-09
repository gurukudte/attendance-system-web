import { useState, useEffect, useCallback, useRef } from "react";

type CustomField = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  orgId: string;
};

type CreateFieldInput = {
  name: string;
  type: string;
  required?: boolean;
};

type UpdateFieldInput = Partial<CreateFieldInput> & { id: string };

export function useCustomFields(orgId: string) {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchFields = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/organization/${orgId}/custom-fields`);
      if (!res.ok) throw new Error("Failed to fetch fields");

      const data = await res.json();
      setFields(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [orgId]);

  const createField = useCallback(
    async (fieldData: CreateFieldInput) => {
      if (isCreating) return;
      setIsCreating(true);
      setError(null);

      try {
        const res = await fetch(`/api/organization/${orgId}/custom-fields`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldData),
        });

        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes?.error || "Failed to create field");
        }

        const newField = await res.json();
        setFields((prev) => [...prev, newField]);
        return newField;
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [orgId, isCreating]
  );

  const updateField = useCallback(
    async (field: UpdateFieldInput) => {
      if (isUpdating) return;
      setIsUpdating(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/custom-fields/${field.id}`, // separate route assumed
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(field),
          }
        );

        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes?.error || "Failed to update field");
        }

        const updated = await res.json();
        setFields((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f))
        );
        return updated;
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating]
  );

  const deleteField = useCallback(
    async (id: string) => {
      if (isDeleting) return;
      setIsDeleting(true);
      setError(null);

      try {
        const res = await fetch(`/api/custom-fields/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errRes = await res.json();
          throw new Error(errRes?.error || "Failed to delete field");
        }

        setFields((prev) => prev.filter((f) => f.id !== id));
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting]
  );

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    fields,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    refetch: fetchFields,
    createField,
    updateField,
    deleteField,
  };
}
