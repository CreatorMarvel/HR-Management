"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React, { useEffect, useState } from "react";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>(); // Make sure ID is a string
  const utils = api.useUtils();
  const router = useRouter(); // For redirect to the homepage

  const fetchAllDepartments = api.department.getAll.useQuery();

  const changeDataInDatabase = api.employees.editEmployee.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });
  const { data } = api.employees.getUnique.useQuery({ id }); // Get data
  const [employee, setEmployee] = useState<{
    name: string;
    status: string;
    surname: string;
    telephone: string;
    email: string;
    departmentId: string;
  } | null>(null);

  function handleChange( // change the fields
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setEmployee((prevItem) => {
      return { ...prevItem!, [name]: value };
    });
  }

  // Handle changes to the status select field
  function handleDepartmentChange(value: string) {
    setEmployee((prevItem) => {
      return { ...prevItem!, departmentId: value };
    });
  }

  // Handle changes to the status select field
  function handleStatusChange(value: string) {
    setEmployee((prevItem) => {
      return { ...prevItem!, status: value };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    // Submit, make changes in the database
    // Edit the Employee
    e.preventDefault();
    try {
      if (employee) {
        changeDataInDatabase.mutate({
          id,
          name: employee.name,
          status: employee.status,
          surname: employee.surname,
          telephone: employee.telephone,
          email: employee.email,
          departmentId: employee.departmentId,
        });
      }
      console.log("Successfully changed");
      console.log(employee);
      router.push("/admin/employees"); // Redirect back to All Employees Page
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data) {
      setEmployee({
        name: data.name,
        status: data.status,
        surname: data.surname,
        telephone: data.telephone,
        email: data.email,
        departmentId: data.departmentId!,
      });
    }
  }, [data]);

  return (
    <div>
      <h3 className="p-4 shadow-md">Edit Department</h3>

      <form className="p-6" action="" onSubmit={handleSubmit}>
        {/* name */}
        <div className="mb-4">
          <Label htmlFor="name">Employee Name</Label>
          <Input
            type="text"
            placeholder="Department Name"
            name="name"
            id="name"
            value={employee?.name}
            onChange={handleChange}
          />
        </div>

        {/* surname */}
        <div className="mb-4">
          <Label htmlFor="name">Employee Surname</Label>
          <Input
            type="text"
            placeholder="Employee Surname"
            name="surname"
            id="surname"
            value={employee?.surname}
            onChange={handleChange}
          />
        </div>

        {/* telephone */}
        <div className="mb-4">
          <Label htmlFor="name">Telephone</Label>
          <Input
            type="text"
            placeholder="Telephone"
            name="telephone"
            id="Telephone"
            value={employee?.telephone}
            onChange={handleChange}
          />
        </div>

        {/* email */}
        <div className="mb-4">
          <Label htmlFor="name">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            value={employee?.email}
            onChange={handleChange}
          />
        </div>

        {/* Department */}
        <div className="mb-4">
          <Label htmlFor="departmentId">Department</Label>
          <Select
            id="departmentId"
            name="departmentId"
            value={employee?.departmentId}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {fetchAllDepartments.data?.map((department) => {
                return (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* status */}
        <div className="mb-4">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={employee?.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button className="rounded-md bg-green-600 px-6 py-3 text-white">
          Edit
        </button>
      </form>
    </div>
  );
}
