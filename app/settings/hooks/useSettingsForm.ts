import { useEffect, useState } from "react";
import { useOrganizations } from "@/app/settings/hooks/useOrganizations";
import { useAppDispatch } from "@/redux/hooks/useAppSelector";
import {
  fetchOrganization,
  updateOrganizationData,
} from "../slice/organizationSlice";

export default function useSettingsForm() {
  const dispatch = useAppDispatch();
  const { organization, loading, error, updateOrganization } =
    useOrganizations();
  const [formData, setFormData] = useState({
    name: "",
    timezone: "",
    dateFormat: "MM/DD/YYYY",
    customEmployeeFields: [] as Array<{
      id: string;
      name: string;
      type: string;
      required: boolean;
    }>,
    apiKeys: [] as Array<{ id: string; name: string; key: string }>,
    adminUsers: [
      {
        id: "1",
        name: "Admin User 1",
        email: "admin1@example.com",
        role: "Super Admin",
      },
      {
        id: "2",
        name: "Admin User 2",
        email: "admin2@example.com",
        role: "Manager",
      },
      {
        id: "3",
        name: "Admin User 3",
        email: "admin3@example.com",
        role: "Viewer",
      },
    ],
  });
  const [pendingChanges, setPendingChanges] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateOrganizationData({ [name]: type === "checkbox" ? checked : value })
    );
    setPendingChanges(true);
  };

  return {
    formData: organization,
    pendingChanges,
    handleChange,
    setFormData,
    setPendingChanges,
  };
}
