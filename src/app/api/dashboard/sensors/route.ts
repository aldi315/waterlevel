import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allRecords = await prisma.waterlevelData.findMany({
      orderBy: { createdAt: 'asc' } // chronological order for chart
    });

    const sensorMap = new Map();

    allRecords.forEach(record => {
      if (!sensorMap.has(record.sensorId)) {
        sensorMap.set(record.sensorId, {
          sensorId: record.sensorId,
          location: record.location,
          level: record.level, // will be overwritten by latest
          history: [],
        });
      }
      const sensor = sensorMap.get(record.sensorId);
      sensor.level = record.level; // keeps updating to the latest
      sensor.location = record.location;
      sensor.history.push(record.level);
    });

    const sensors = Array.from(sensorMap.values()).map((sensor: any) => {
      // Limit history to last 50 points to prevent massive arrays
      if (sensor.history.length > 50) {
        sensor.history = sensor.history.slice(-50);
      }
      return sensor;
    });

    return NextResponse.json(sensors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sensors" }, { status: 500 });
  }
}
