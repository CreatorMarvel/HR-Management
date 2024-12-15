"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between bg-slate-800 px-4 py-6 text-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold">
            HR Administration System |{" "}
            {pathname.startsWith("/admin")
              ? "Admin Dashboard"
              : "Employee Dashboard"}
          </h4>
        </div>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
