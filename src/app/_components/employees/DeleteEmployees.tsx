"use client";

import React from "react";
import { api } from "~/trpc/react";

export default function DeleteEmployee({ id }: { id: string }) {
  const utils = api.useUtils();
  const deleteEmployee = api.employees.deleteEmployee.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Delete with Unique ID
  function handleDelete(id: string) {
    deleteEmployee.mutate({
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
