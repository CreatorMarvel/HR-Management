"use client";

import React from "react";
import { api } from "~/trpc/react";

export default function DeleteDepartment({ id }: { id: string }) { // Delete with unique ID
  const utils = api.useUtils();
  const deleteDepartment = api.department.deleteDep.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Delete Department from Database
  function handleDelete(id: string) {
    deleteDepartment.mutate({
      id,
    });
  }

  return (
    <span
      onClick={() => handleDelete(id)}
      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-slate-700 p-2 hover:bg-slate-100"
    >
      &times;
    </span>
  );
}
