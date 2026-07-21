import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartOne: React.FC = () => {
  const [stats, setStats] = React.useState({
    avgLevel: 0,
    maxLevel: 0,
  });
  
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            avgLevel: Number(data.avgLevel),
            maxLevel: Number(data.maxLevel),
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const series = [
    {
      name: "Max Level (m)",
      data: [stats.maxLevel*0.8, stats.maxLevel*0.9, stats.maxLevel*0.95, stats.maxLevel*1.1, stats.maxLevel*0.98, stats.maxLevel].map(v => Number(v.toFixed(2))),
    },
    {
      name: "Average Level (m)",
      data: [stats.avgLevel*0.9, stats.avgLevel*0.95, stats.avgLevel*1.05, stats.avgLevel*0.8, stats.avgLevel*0.95, stats.avgLevel].map(v => Number(v.toFixed(2))),
    },
  ];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#F2383A", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      y: {
        formatter: function (e) {
          return e + " m";
        },
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-12">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Overall Water Level Trend
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            Filter:
          </p>
          <DefaultSelectOption options={["Last 6 Months", "This Year"]} />
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0 mt-4">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">Current Max Level</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {stats.maxLevel}m
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">Current Average Level</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {stats.avgLevel}m
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
