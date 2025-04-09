import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { organizationResponseSchema } from "@/lib/validators/organization";
import { OrganizationState } from "../types/organization";

const initialState: OrganizationState = {
  organization: {
    id: "",
    name: "",
    timezone: "",
    dateFormat: "MM/DD/YYYY",
    customEmployeeFields: [],
    apiKeys: [],
    adminUsers: [
      {
        id: "1",
        name: "Admin User 1",
        email: "admin1@example.com",
        role: "Super Admin",
        orgId: "",
      },
      {
        id: "2",
        name: "Admin User 2",
        email: "admin2@example.com",
        role: "Manager",
        orgId: "",
      },
      {
        id: "3",
        name: "Admin User 3",
        email: "admin3@example.com",
        role: "Viewer",
        orgId: "",
      },
    ],
  },
  loading: false,
  error: null,
};

export const fetchOrganization = createAsyncThunk(
  "organization/fetchOrganization",
  async (id: string, { signal }) => {
    const response = await fetch(`/api/organizations/${id}`, { signal });
    if (!response.ok) throw new Error("Failed to fetch organization");
    const data = await response.json();
    return organizationResponseSchema.parse(data);
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    resetOrganization: () => initialState,
    updateOrganizationData: (state, action) => {
      state.organization = {
        ...state.organization,
        ...action.payload,
      };
    },
    setLoadingAndError: (state, action) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = {
          ...state.organization,
          id: action.payload.id,
          name: action.payload.name,
          timezone: action.payload.timezone || "",
          dateFormat: action.payload.dateFormat,
          // Only update these if they come from the API
          customEmployeeFields:
            action.payload.customEmployeeFields ||
            state.organization.customEmployeeFields,
          apiKeys: action.payload.apiKeys || state.organization.apiKeys,
          adminUsers:
            action.payload.adminUsers || state.organization.adminUsers,
        };
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch organization";
      });
  },
});

export const { resetOrganization, updateOrganizationData, setLoadingAndError } =
  organizationSlice.actions;
export default organizationSlice.reducer;
