import React from "react";
import SummaryCard from "../_components/SummaryCard";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";

export default async function page() {
  const fetchAllDepartments = await api.department.getAll();
  const fetchAllEmployees = await api.employees.getAll();

  const session = await auth();

  return (
    <div className="">
      <h3 className="px-6 py-4 shadow-md">
        Dashboard (Admin) | Hi! {session?.user.name}
      </h3>
      <div className="mt-8 flex gap-6 px-6">
        {/* Display Total Employees and Departments - Summary */}
        <SummaryCard text="Employees" number={fetchAllEmployees.length} />
        <SummaryCard text="Departments" number={fetchAllDepartments.length} />
      </div>
    </div>
  );
}
