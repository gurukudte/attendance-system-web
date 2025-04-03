import * as React from "react";
import DashboardPage from "./components/DashboardPage";

export interface IAppProps {}

export default function Dashboard(props: IAppProps) {
  return (
    <React.Suspense>
      <></>
      {/* <DashboardPage /> */}
    </React.Suspense>
  );
}
