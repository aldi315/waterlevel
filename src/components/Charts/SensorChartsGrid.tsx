"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type SensorChartData = {
  id: string;
  location: string;
  data: number[];
  color: string;
};

const colors = ["#5750F1", "#FF9C55", "#0ABEF9", "#F2383A", "#3FD97F"];

const SingleSensorChart = ({ sensor }: { sensor: SensorChartData }) => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Satoshi, sans-serif",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: [sensor.color],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: { show: false }, // Hide labels since it's just point indexes for now
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
        },
        formatter: (val) => `${val.toFixed(1)}m`,
      },
    },
    grid: {
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}m`,
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-title-sm font-bold text-dark dark:text-white">
            {sensor.location}
          </h4>
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
            ID: {sensor.id}
          </span>
        </div>
        <div className="text-right">
          <h5 className="text-title-sm font-bold text-dark dark:text-white">
            {sensor.data[sensor.data.length - 1]}m
          </h5>
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Current Level
          </span>
        </div>
      </div>
      <div className="-ml-4 -mr-5">
        <ReactApexChart
          options={options}
          series={[{ name: "Water Level", data: sensor.data }]}
          type="area"
          height={200}
        />
      </div>
    </div>
  );
};

const SensorChartsGrid = () => {
  const [sensors, setSensors] = React.useState<SensorChartData[]>([]);

  React.useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch("/api/dashboard/sensors");
        if (response.ok) {
          const data = await response.json();
          // Map DB records to Chart format
          const mapped = data.map((sensor: any, index: number) => {
            return {
              id: sensor.sensorId,
              location: sensor.location,
              data: sensor.history && sensor.history.length > 0 ? sensor.history : [sensor.level],
              color: colors[index % colors.length]
            };
          });
          setSensors(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch sensors for charts:", error);
      }
    };
    
    fetchSensors();
    const interval = setInterval(fetchSensors, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:mt-6 md:gap-6 xl:grid-cols-3 2xl:mt-9 2xl:gap-7.5">
      {sensors.map((sensor) => (
        <SingleSensorChart key={sensor.id} sensor={sensor} />
      ))}
    </div>
  );
};

export default SensorChartsGrid;
