import React from "react";
import UpdatedDashboard from "./UpdatedDashboard";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./subLayoutComponents/Dashboard";

const DashboardRoutes = () => {
  return (
    <UpdatedDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </UpdatedDashboard>
  );
};

export default DashboardRoutes;

function History() {
  return <div>History</div>;
}
