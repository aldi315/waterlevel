"use client";

import React, { useState, useMemo } from "react";
import CardsWaterlevel, { SensorAlert } from "@/components/Cards/CardsWaterlevel";
import TableOne from "@/components/Tables/TableOne";
import MapOne from "@/components/Maps/MapOne";

export default function WaterlevelClient() {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSensor, setSelectedSensor] = useState<SensorAlert | null>(null);
  const [apiData, setApiData] = useState<SensorAlert[]>([]);

  // Fetch real-time data from external API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/waterlevel");
        const json = await response.json();
        
        if (json.stations) {
          const parsedData: SensorAlert[] = Object.entries(json.stations).map(([key, station]: [string, any]) => {
            let statusText = "🟢 AMAN";
            let statusCss = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            let statusBarCss = "bg-green-500";
            let tableColor = "text-green-light-1";

            if (station.level >= station.flood) {
              statusText = "🔴 BAHAYA";
              statusCss = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
              statusBarCss = "bg-red-500";
              tableColor = "text-red-500";
            } else if (station.level >= station.flood * 0.8) {
              statusText = "🟠 WASPADA";
              statusCss = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
              statusBarCss = "bg-orange-400";
              tableColor = "text-orange-400";
            }

            // Convert date format from "YYYY-MM-DD HH:mm:ss" to "DD Bulan YYYY HH:mm:ss"
            let timeStr = station.time;
            if (timeStr) {
                const dateObj = new Date(timeStr);
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                const day = dateObj.getDate();
                const month = months[dateObj.getMonth()];
                const year = dateObj.getFullYear();
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                timeStr = `${day} ${month} ${year}|${hours}.${minutes}.${seconds}`;
            }

            return {
              id: key,
              location: station.name || key,
              level: `${Number(station.level).toFixed(2)} m`,
              flood: `${Number(station.flood).toFixed(2)} m`,
              lat: station.lat,
              lng: station.lon,
              photo: station.photo ? `https://smartflood.my.id/${station.photo}` : undefined,
              time: timeStr,
              statusText,
              statusCss,
              statusBarCss,
              tableColor,
            };
          });
          setApiData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching waterlevel data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // refresh every minute

    return () => clearInterval(intervalId);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return apiData;
    return apiData.filter(
      (sensor) =>
        sensor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.statusText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, apiData]);

  const handleViewLocation = (sensor: SensorAlert) => {
    setSelectedSensor(sensor);
  };

  const closeModal = () => {
    setSelectedSensor(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-dark dark:text-white">
          Waterlevel Dashboard
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search location or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-md border border-stroke bg-transparent px-5 py-2 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
            />
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2 rounded-md bg-gray-2 p-1 dark:bg-dark-2">
            <button
              onClick={() => setViewMode("card")}
              className={`rounded py-1 px-4 text-sm font-medium transition-colors ${
                viewMode === "card"
                  ? "bg-white text-dark shadow-1 dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded py-1 px-4 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-dark shadow-1 dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {viewMode === "card" ? (
          <CardsWaterlevel data={filteredData} onViewLocation={handleViewLocation} />
        ) : (
          <TableOne data={filteredData} onViewLocation={handleViewLocation} />
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-10 text-dark-5 dark:text-dark-6">
            No sensor data found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Dummy Map Modal */}
      {selectedSensor && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-6xl rounded-lg bg-white shadow-default dark:bg-boxdark overflow-hidden flex flex-col h-[90vh] max-h-[900px]">
            <div className="flex justify-between items-center p-5 border-b border-stroke dark:border-dark-3">
              <h3 className="text-xl font-bold text-dark dark:text-white">
                Location Map: {selectedSensor.location}
              </h3>
              <button
                onClick={closeModal}
                className="text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-0 relative bg-gray-100 dark:bg-gray-dark flex flex-col items-center justify-center">
              <div className="w-full h-full relative">
                 {selectedSensor.lat && selectedSensor.lng ? (
                   <iframe
                     width="100%"
                     height="100%"
                     frameBorder="0"
                     scrolling="no"
                     marginHeight={0}
                     marginWidth={0}
                     src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedSensor.lng - 0.05},${selectedSensor.lat - 0.05},${selectedSensor.lng + 0.05},${selectedSensor.lat + 0.05}&layer=mapnik&marker=${selectedSensor.lat},${selectedSensor.lng}`}
                     style={{ border: 0 }}
                   ></iframe>
                 ) : (
                   <MapOne />
                 )}
              </div>

              {/* Overlay dummy info */}
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-boxdark/90 backdrop-blur-sm p-4 rounded-lg shadow-2 text-center border border-stroke dark:border-dark-3 z-10 w-80">
                {selectedSensor.photo && (
                  <div className="mb-3 w-full h-32 overflow-hidden rounded-md">
                    <img src={selectedSensor.photo} alt={selectedSensor.location} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-medium text-dark dark:text-white mb-1">{selectedSensor.location}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6 mb-1">
                  Lat: {selectedSensor.lat ? selectedSensor.lat.toFixed(4) : "N/A"}, 
                  Lng: {selectedSensor.lng ? selectedSensor.lng.toFixed(4) : "N/A"}
                </p>
                {selectedSensor.time && (
                  <p className="text-xs text-dark-5 dark:text-dark-6 mb-2">
                    Updated: {selectedSensor.time}
                  </p>
                )}
                <span className={`inline-block rounded px-2.5 py-1 text-sm font-medium ${selectedSensor.statusCss}`}>
                  {selectedSensor.statusText}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
