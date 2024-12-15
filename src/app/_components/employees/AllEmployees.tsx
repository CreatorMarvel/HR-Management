"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import DeleteEmployee from "./DeleteEmployees";

interface Employee {
  id: string;
  status: string;
  name: string;
  surname: string;
  telephone: string;
  email: string;
  managerId: string | null;
  departmentId: string | null;
}

export default function Employees() {
  const [data, setData] = useState<Employee[]>([]); // Set employees to data
  const fetchAllDepartments = api.department.getAll.useQuery(); // Fetching all Departments (Users)

  const { data: responseData } = api.employees.getAll.useQuery();

  useEffect(() => {
    if (responseData) {
      setData(responseData);
    }
  }, [responseData]);

  function filteredData(e: React.ChangeEvent<HTMLInputElement>) {
    if (!responseData) return; // No filter, if no data
    const newFiltered = responseData.filter((emp) => {
      return emp.name
        .toLocaleLowerCase()
        .includes(e.target.value.toLocaleLowerCase());
    });
    setData(newFiltered); // Filter using names
  }

  return (
    <div>
      <div className="p-4 shadow-md">Employees</div>
      <div className="mt-6 p-6">
        <form action="">
          <fieldset className="mb-8 border-2 border-slate-400 p-6">
            <legend>Filters</legend>

            {/* status */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <label htmlFor="status">Status:</label>
              <Select name="status">
                <SelectTrigger className="w-[40%]">
                  <SelectValue placeholder="Active Only / (All) / Deactive Only" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* department */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <label htmlFor="department">Department:</label>
              <Select name="department">
                <SelectTrigger className="w-[40%]">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {fetchAllDepartments.data?.map((dep) => {
                    return (
                      <SelectItem key={dep.id} value="active">
                        {dep.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* manager */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <label htmlFor="manager">Manager:</label>
              <Select name="manager">
                <SelectTrigger className="w-[40%]">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button className="rounded-lg border-2 border-slate-700 px-6 py-2">
              Filter
            </button>
          </fieldset>
        </form>

        <div className="mb-10 flex items-center justify-between">
          <Input
            className="w-[30%]"
            type="email"
            placeholder="Search"
            onChange={filteredData}
          />
          <Link
            href="/admin/employees/add"
            className={buttonVariants({ variant: "outline" })}
          >
            Add Employee
          </Link>
        </div>

        <Table>
          <TableCaption>
            {data.length > 0 ? (
              <p>({data.length}) Employees</p>
            ) : (
              "Add new Departments"
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Telephone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <ul className="flex items-center gap-2">
                    <li className="underline">
                      <Link href={`/admin/employees/edit/${employee.id}`}>
                        Edit
                      </Link>
                    </li>
                    <li className="underline">
                      <Link href="/admin/employees/edit">Deactivate</Link>
                    </li>
                  </ul>
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.surname}</TableCell>
                <TableCell>{employee.telephone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.status}</TableCell>
                <TableCell>
                  <DeleteEmployee id={employee.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
