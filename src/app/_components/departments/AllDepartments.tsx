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
import { Input } from "~/components/ui/input";
import { buttonVariants } from "~/components/ui/button";
import DeleteDepartment from "~/app/_components/departments/DeleteDepartment";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

//
interface Department {
  id: string;
  name: string;
  status: string;
}

export default function Departments() {
  const [data, setData] = useState<Department[]>([]);

  // Get all Department from Database
  const { data: responseData } = api.department.getAll.useQuery();

  useEffect(() => {
    // Set Data, so we can re-render on-change or Delete
    if (responseData) {
      setData(responseData);
    }
  }, [responseData]);

  function filteredData(e: React.ChangeEvent<HTMLInputElement>) {
    if (!responseData) return; // No filter, if no data
    const newFiltered = responseData.filter((dep) => {
      // Filter with Name
      return dep.name
        .toLocaleLowerCase()
        .includes(e.target.value.toLocaleLowerCase());
    });
    setData(newFiltered);
  }

  return (
    <div>
      <div className="p-4 shadow-md">Departments</div>
      <div className="mt-6 p-6">
        <div className="mb-10 flex items-center justify-between">
          <Input
            className="w-[30%]"
            type="email"
            placeholder="Search"
            onChange={filteredData}
          />
          <Link
            href="/admin/departments/add"
            className={buttonVariants({ variant: "outline" })}
          >
            Add Department
          </Link>
        </div>

        <Table>
          <TableCaption>
            {data.length > 0 ? (
              <p>({data.length}) Departments</p>
            ) : (
              "Add new Departments"
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">
                  <ul className="flex items-center gap-2">
                    <li className="underline">
                      <Link href={`/admin/departments/edit/${department.id}`}>
                        Edit
                      </Link>
                    </li>
                    <li className="underline">
                      <Link href="/admin/departments/edit">Deactivate</Link>
                    </li>
                  </ul>
                </TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{}</TableCell>
                <TableCell>{department.status}</TableCell>
                <TableCell>
                  <DeleteDepartment id={department.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
