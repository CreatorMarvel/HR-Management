"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";

export default function DepartmentForm() {
  const [department, setDepartment] = useState<string>("");
  const utils = api.useUtils();
  const router = useRouter();

  const createNewDep = api.department.createNewDep.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Create new Department on submit
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    try {
      createNewDep.mutate({ name: department }); // Created with a name 
      setDepartment("");
      router.push("/admin/departments");
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <h3 className="mb-10 p-4 shadow-md">Add Department</h3>
      <form
        className="m-auto w-[80%] p-6 shadow-md"
        action=""
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Department Name:</label>
          <Input
            className="mb-6"
            type="name"
            placeholder="Department Name"
            id="name"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <button className="rounded-sm bg-green-600 px-8 py-3 text-sm text-white transition-all hover:bg-green-500">
          Add
        </button>
      </form>
    </div>
  );
}
