import * as React from "react";
import { DashboardOverview } from "./components/DashboardOverview";

export interface IDashboardProps {}

export default function Dashboard(props: IDashboardProps) {
  return <DashboardOverview />;
}
