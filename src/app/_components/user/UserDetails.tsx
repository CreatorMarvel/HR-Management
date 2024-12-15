"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function User() {
  const { data: session } = useSession();

  const userDetails = api.user.getUniqueWithEmail.useQuery({
    email: session?.user?.email ?? "",
  });

  return (
    <div>
      <div className="p-4 text-xl font-bold text-green-600 shadow-md">
        Your Details
      </div>
      <div className="mt-6 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Telephone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userDetails?.data?.employee.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <ul className="flex items-center gap-2">
                    <li className="underline">
                      <Link href={`/employee/edit/${employee.id}`}>Edit</Link>
                    </li>
                  </ul>
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.surname}</TableCell>
                <TableCell>{employee.telephone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
