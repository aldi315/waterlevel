import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch the latest entry for each distinct sensor
    const allRecords = await prisma.waterlevelData.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Group by sensorId to get only the latest record for each sensor
    const latestSensorsMap = new Map();
    allRecords.forEach(record => {
      if (!latestSensorsMap.has(record.sensorId)) {
        latestSensorsMap.set(record.sensorId, record);
      }
    });
    const latestSensors = Array.from(latestSensorsMap.values());
    
    const totalSensors = latestSensors.length;
    const criticalSensors = latestSensors.filter((s: any) => s.status === "Critical").length;
    
    let totalLevel = 0;
    let maxLevel = 0;
    let maxLocation = "N/A";
    
    latestSensors.forEach((s: any) => {
      totalLevel += s.level;
      if (s.level > maxLevel) {
        maxLevel = s.level;
        maxLocation = s.location;
      }
    });
    
    const avgLevel = totalSensors > 0 ? (totalLevel / totalSensors).toFixed(2) : "0.00";
    
    return NextResponse.json({
      totalSensors,
      criticalSensors,
      avgLevel,
      maxLevel: maxLevel.toFixed(2),
      maxLocation
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
