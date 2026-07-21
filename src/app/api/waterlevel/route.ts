import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://smartflood.my.id/latest/stations.json", {
      cache: "no-store"
    });
    const data = await response.json();
    
    // Sync to Postgres in the background
    if (data && data.stations) {
      // Run asynchronously without awaiting so we don't block the client response
      syncToDatabase(data.stations).catch(err => console.error("DB Sync error:", err));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch waterlevel API:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

async function syncToDatabase(stations: any) {
  for (const [key, station] of Object.entries(stations) as [string, any][]) {
    const level = Number(station.level);
    const flood = Number(station.flood);
    let status = "Normal";
    if (level >= flood) status = "Critical";
    else if (level >= flood * 0.8) status = "Warning";

    // Create a new record to build historical data (time-series)
    await prisma.waterlevelData.create({
      data: {
        sensorId: key,
        location: station.name || key,
        level: level,
        status: status,
        lat: station.lat,
        lng: station.lon,
      }
    });
  }
}
