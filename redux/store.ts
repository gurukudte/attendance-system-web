import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@/app/settings/slice/organizationSlice";
import employeeReducer from "@/app/employees/slice/employeeSlice";

export const store = configureStore({
  reducer: {
    organization: organizationReducer,
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
