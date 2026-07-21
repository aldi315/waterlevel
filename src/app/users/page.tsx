import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import TableUsers from "@/components/Tables/TableUsers";

export const metadata: Metadata = {
  title: "Users | Waterlevel Dashboard",
  description: "User management page",
};

export default function UsersPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <TableUsers />
      </div>
    </DefaultLayout>
  );
}
