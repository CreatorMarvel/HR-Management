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

export default function EditDepartment() {
  const { id } = useParams<{ id: string }>(); // Make sure id is a string
  const utils = api.useUtils();
  const router = useRouter(); // Redirect to the homepage

  const changeDataInDatabase = api.department.editDepartment.useMutation({
    // Variable used for making changed to the DB
    onSuccess: async () => {
      await utils.invalidate();
    },
  });
  const { data } = api.department.getUnique.useQuery({ id }); // Get data from DB
  const [department, setDepartment] = useState<{
    name: string;
    status: string;
  } | null>(null);

  // Handle changes to the input field
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setDepartment((prevItem) => {
      return { ...prevItem!, [name]: value };
    });
  }

  // Handle changes to the status select field
  function handleStatusChange(value: string) {
    setDepartment((prevItem) => {
      return { ...prevItem!, status: value };
    });
  }

  // Submit, make changes in the database
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      if (department) {
        changeDataInDatabase.mutate({
          id,
          name: department.name,
          status: department.status,
        });
      }
      router.push("/admin/departments");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data) {
      setDepartment({
        name: data.name,
        status: data.status,
      });
    }
  }, [data]);

  return (
    <div>
      <h3 className="p-4 shadow-md">Edit Department</h3>

      <form className="p-6" action="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Department Name</Label>
          <Input
            type="name"
            placeholder="Department Name"
            name="name"
            id="name"
            value={department?.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <Label>Status</Label>
          <Select
            name="status"
            value={department?.status}
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
