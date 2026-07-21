import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import WaterlevelClient from "./WaterlevelClient";

export const metadata: Metadata = {
  title: "Waterlevel | Waterlevel Dashboard",
  description: "Waterlevel monitoring page",
};

export const dynamic = "force-dynamic";

export default function WaterlevelPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <WaterlevelClient />
      </div>
    </DefaultLayout>
  );
}
