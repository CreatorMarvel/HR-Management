"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Employee {
  name: string;
  telephone: string;
  surname: string;
  email: string;
  manager: string;
  status: string;
  department: string;
}

export default function AddEmployee() {
  const fetchDepartments = api.department.getAll.useQuery().data; // render the department select fields
  const utils = api.useUtils();
  const createNewEmployee = api.employees.createNewEmployee.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const [employee, setEmployee] = useState<Employee>({
    name: "",
    telephone: "",
    surname: "",
    email: "",
    manager: "",
    status: "active",
    department: "",
  });

  const router = useRouter();

  // Update employee state when the selected status changes
  function handleStatusChange(value: string) {
    setEmployee((prevItem) => ({
      ...prevItem,
      status: value, // Update the status field
    }));
  }

  // Update employee state when the selected department changes
  function handleDepartmentChange(value: string) {
    setEmployee((prevItem) => ({
      ...prevItem,
      department: value, // Update the department field
    }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setEmployee((prevItem) => {
      return { ...prevItem, [name]: value }; // Update all other fields
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      createNewEmployee.mutate({
        status: employee.status,
        name: employee.name,
        email: employee.email,
        surname: employee.surname,
        telephone: employee.telephone,
        departmentId: employee.department,
        managerId: employee.manager,
      });
      console.log("Created employee successfully");
      setEmployee({
        name: "",
        telephone: "",
        surname: "",
        email: "",
        manager: "",
        status: "active",
        department: "",
      });
      router.push("/admin/employees");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <h3 className="mb-10 p-4 shadow-md">Add Employee</h3>
      <form
        className="m-auto w-[80%] p-6 shadow-md"
        action=""
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name:</label>
          <Input
            name="name"
            className="mb-6"
            type="name"
            placeholder="Name"
            id="name"
            value={employee.name}
            onChange={handleChange}
          />
        </div>
        
        {/* surname */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Surname:</label>
          <Input
            className="mb-6"
            name="surname"
            type="text"
            placeholder="Surname"
            id="surname"
            value={employee.surname}
            onChange={handleChange}
          />
        </div>

        {/* telephone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="telephone">Telephone:</label>
          <Input
            className="mb-6"
            name="telephone"
            type="text"
            placeholder="+000 000 0000"
            id="telephone"
            value={employee.telephone}
            onChange={handleChange}
          />
        </div>

        {/* email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email:</label>
          <Input
            className="mb-6"
            type="email"
            name="email"
            placeholder="Email"
            id="email"
            value={employee.email}
            onChange={handleChange}
          />
        </div>

        {/* manager */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Manager:</label>
          <Input
            className="mb-6"
            type="text"
            name="manager"
            placeholder="Manager"
            id="manager"
            value={employee.manager}
            onChange={handleChange}
          />
        </div>

        {/* status */}
        <div className="flex flex-col gap-2">
          <label htmlFor="status">Status:</label>
          <Select
            name="status"
            value={employee.status}
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
        {/* Department */}
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="department">Department:</label>
          <Select
            name="department"
            value={employee.department}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {fetchDepartments?.map((dep) => {
                return (
                  <SelectItem key={dep.id} value={dep.id}>
                    {dep.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <button className="mt-6 rounded-sm bg-green-600 px-8 py-3 text-sm text-white transition-all hover:bg-green-500">
          Add
        </button>
      </form>
    </div>
  );
}
