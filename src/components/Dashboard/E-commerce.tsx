"use client";
import React from "react";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import SensorChartsGrid from "@/components/Charts/SensorChartsGrid";
import ChartOne from "@/components/Charts/ChartOne";

const ECommerce: React.FC = () => {
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 md:mt-6 2xl:mt-9">
        <ChartOne />
      </div>

      {/* Grid for Sensor Charts */}
      <SensorChartsGrid />
    </>
  );
};

export default ECommerce;
