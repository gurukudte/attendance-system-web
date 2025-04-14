import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@/app/settings/slice/organizationSlice";
import employeeReducer from "@/app/dashboard/employees/slice/employeeSlice";
import scheduleSlice from "@/app/dashboard/scheduling/slice/scheduleSlice";

export const store = configureStore({
  reducer: {
    organization: organizationReducer,
    employees: employeeReducer,
    schedules: scheduleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
