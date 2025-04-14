import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ScheduleState {
  schedules: EmployeeSchedule[];
  loading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchSchedulesByDate = createAsyncThunk(
  "schedules/fetchByDate",
  async (
    { date, orgId }: { date: string; orgId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/schedules?date=${encodeURIComponent(date)}&orgId=${orgId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch schedules"
      );
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedules/create",
  async (scheduleData: CreateScheduleDto, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/schedules", scheduleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create schedule"
      );
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/update",
  async ({ id, ...updateData }: UpdateScheduleDto, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/schedules", { id, ...updateData });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update schedule"
      );
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/schedules?id=${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete schedule"
      );
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    clearSchedules(state) {
      state.schedules = [];
    },
    setSchedules(state, action: PayloadAction<EmployeeSchedule[]>) {
      state.schedules = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSchedulesByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedulesByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createSchedule.pending, (state) => {
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (s) => s.id !== action.payload
        );
      });
  },
});

export const { clearSchedules, setSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
