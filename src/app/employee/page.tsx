import React from "react";
import { auth } from "~/server/auth";

export default async function page() {
  const session = await auth();
  return (
    <div className="text-md p-4 shadow-lg">Welcome, {session?.user.name}!</div>
  );
}
