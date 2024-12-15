"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import React, { useEffect, useState } from "react";

export default function EditUser() {
  const { id } = useParams<{ id: string }>(); // Make sure ID is a string
  const utils = api.useUtils();
  const router = useRouter();

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
      router.push("/employee/details"); // Redirect back
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

        <button className="rounded-md bg-green-600 px-6 py-3 text-white">
          Edit
        </button>
      </form>
    </div>
  );
}
