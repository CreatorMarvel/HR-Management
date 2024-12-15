"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="w-50 flex justify-center">
      <ul className="flex flex-col gap-4">
        <li className="p-3 hover:bg-slate-800">
          <Link
            className="flex items-center gap-3"
            href={pathname.startsWith("/admin") ? "/admin" : "/employee"}
          >
            <span>Dashboard</span>
          </Link>
        </li>
        {pathname.startsWith("/admin") ? (
          <>
            <li className="p-3 hover:bg-slate-800">
              <Link className="flex items-center gap-3" href="/admin/employees">
                <span>Employees</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-slate-800">
              <Link
                className="flex items-center gap-3"
                href="/admin/departments"
              >
                <span>Departments</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="p-3 hover:bg-slate-800">
              <Link
                className="flex items-center gap-3"
                href="/employee/details"
              >
                <span>Details</span>
              </Link>
            </li>
          </>
        )}
        <button
          className="rounded-full border-4 border-slate-900 p-2"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </ul>
    </div>
  );
}
