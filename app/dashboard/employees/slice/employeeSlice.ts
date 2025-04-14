// features/employee/employeeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { Organization } from "@prisma/client";

export enum Role {
  "SUPERADMIN" = "SUPERADMIN",
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

export enum EmployeeStatus {
  "ACTIVE" = "ACTIVE",
  "INACTIVE" = "INACTIVE",
  "SUSPENDED" = "SUSPENDED",
  "TERMINATED" = "TERMINATED",
}

export enum EmployeeRole {
  "EMPLOYEE" = "EMPLOYEE",
  "MANAGER" = "MANAGER",
  "ADMIN" = "ADMIN",
  "RA" = "RA",
  "VOLUNTEER" = "VOLUNTEER",
  "IT_TECHNICIAN" = "IT_TECHNICIAN",
  "NEURO_TECHNICIAN" = "NEURO_TECHNICIAN",
  "INTERN" = "INTERN",
  "CONTRACTOR" = "CONTRACTOR",
}

// Types matching your Prisma model and API response
export interface Employee {
  id: string;
  org: string;
  orgId: string;
  employee_id: string;
  name: string;
  email?: string;
  phone?: string | null;
  position: EmployeeRole;
  joinDate?: Date | null;
  lastWorkingDay?: Date | null;
  status: EmployeeStatus;
  role: Role;
  onLeave: boolean;
  customData?: any | null; // Consider using a more specific type if possible
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeApiResponse {
  success: boolean;
  data?: Employee | Employee[];
  error?: string;
  message?: string;
  details?: any;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  currentRequestId: string | undefined;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  currentRequestId: undefined,
};

// Async thunks
export const fetchEmployees = createAsyncThunk<
  Employee[],
  string, // orgId is now explicitly defined as a string
  { rejectValue: EmployeeApiResponse }
>("employees/fetchAll", async (orgId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/employee/${orgId}`);
    const data: EmployeeApiResponse = await response.json();

    if (!data.success) {
      return rejectWithValue(data);
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    return rejectWithValue({
      success: false,
      error: "Failed to fetch employees",
    });
  }
});

export const createEmployee = createAsyncThunk<
  Employee,
  Partial<Employee>,
  { rejectValue: EmployeeApiResponse }
>("employees/create", async (employeeData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data: EmployeeApiResponse = await response.json();

    if (!data.success || !data.data) {
      return rejectWithValue(data);
    }

    return data.data as Employee;
  } catch (err) {
    return rejectWithValue({
      success: false,
      error: "Failed to create employee",
    });
  }
});

export const deleteEmployee = createAsyncThunk<
  string, // Returns the ID of the deleted employee
  string, // Accepts the ID of the employee to delete
  { rejectValue: EmployeeApiResponse }
>("employees/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/employee/${id}`, {
      method: "DELETE",
    });

    const data: EmployeeApiResponse = await response.json();

    if (!data.success) {
      return rejectWithValue(data);
    }

    return id;
  } catch (err) {
    return rejectWithValue({
      success: false,
      error: "Failed to delete employee",
    });
  }
});

export const updateEmployee = createAsyncThunk<
  Employee,
  { id: string; data: Partial<Employee> },
  { rejectValue: EmployeeApiResponse }
>("employees/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/employee/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData: EmployeeApiResponse = await response.json();

    if (!responseData.success || !responseData.data) {
      return rejectWithValue(responseData);
    }

    return responseData.data as Employee;
  } catch (err) {
    return rejectWithValue({
      success: false,
      error: "Failed to update employee",
    });
  }
});

export const createMultipleEmployees = createAsyncThunk<
  Employee[],
  Partial<Employee>[],
  { rejectValue: EmployeeApiResponse }
>("employees/createMultiple", async (employeesData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeesData),
    });

    const data: EmployeeApiResponse = await response.json();

    if (!data.success || !data.data) {
      return rejectWithValue(data);
    }

    return Array.isArray(data.data) ? data.data : [data.data];
  } catch (err) {
    return rejectWithValue({
      success: false,
      error: "Failed to create employees",
    });
  }
});

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.error = null;
    },
    resetEmployeeError(state) {
      state.error = null;
    },
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state, action) => {
        if (!state.loading) {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.employees = action.payload;
          state.loading = false;
          state.error = null;
          state.currentRequestId = undefined;
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload?.error || "Failed to fetch employees";
          state.currentRequestId = undefined;
        }
      })

      // Create Employee
      .addCase(createEmployee.pending, (state, action) => {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.employees.unshift(action.payload);
          state.loading = false;
          state.error = null;
          state.currentRequestId = undefined;
        }
      })
      .addCase(createEmployee.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload?.error || "Failed to create employee";
          state.currentRequestId = undefined;
        }
      })

      // Create Multiple Employees
      .addCase(createMultipleEmployees.pending, (state, action) => {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(createMultipleEmployees.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.employees = [...action.payload, ...state.employees];
          state.loading = false;
          state.error = null;
          state.currentRequestId = undefined;
        }
      })
      .addCase(createMultipleEmployees.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload?.error || "Failed to create employees";
          state.currentRequestId = undefined;
        }
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state, action) => {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.employees = state.employees.filter(
            (employee) => employee.id !== action.payload
          );
          state.loading = false;
          state.error = null;
          state.currentRequestId = undefined;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload?.error || "Failed to delete employee";
          state.currentRequestId = undefined;
        }
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state, action) => {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          const index = state.employees.findIndex(
            (employee) => employee.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
          state.loading = false;
          state.error = null;
          state.currentRequestId = undefined;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        if (state.currentRequestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload?.error || "Failed to update employee";
          state.currentRequestId = undefined;
        }
      });
  },
});

// Export actions
export const { setEmployees, clearEmployees, resetEmployeeError } =
  employeeSlice.actions;

// Selectors
export const selectAllEmployees = (state: RootState) =>
  state.employees.employees;
export const selectEmployeesLoading = (state: RootState) =>
  state.employees.loading;
export const selectEmployeesError = (state: RootState) => state.employees.error;
export const selectEmployeeById = (id: string) => (state: RootState) =>
  state.employees.employees.find((employee) => employee.id === id);

export default employeeSlice.reducer;
