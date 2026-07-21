import React, { useState } from "react";

export type SensorAlert = {
  id: string;
  location: string;
  level: string;
  flood: string;
  lat?: number;
  lng?: number;
  photo?: string;
  time?: string;
  statusText: string;
  statusCss: string;
  statusBarCss: string;
  tableColor: string;
};

type Props = {
  data: SensorAlert[];
  onViewLocation: (sensor: SensorAlert) => void;
};

const CardsWaterlevel = ({ data, onViewLocation }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3">
      {data.map((sensor, key) => (
        <div
          key={key}
          className="rounded-[12px] border border-stroke bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card relative overflow-hidden flex flex-col"
        >
          {/* Top Image & Header Section */}
          <div className="relative rounded-t-[12px] overflow-hidden group">
            {sensor.photo ? (
              <div 
                className="w-full h-48 cursor-pointer relative"
                onClick={() => setPreviewImage(sensor.photo!)}
              >
                <img
                  src={sensor.photo}
                  alt={`Photo of ${sensor.location}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-24 bg-gray-100 dark:bg-meta-4"></div>
            )}
            
            {/* Status bar */}
            <div className={`absolute top-0 left-0 h-1.5 w-full ${sensor.statusBarCss}`} />

            {/* Overlaid Title and Badge */}
            <div className={`absolute bottom-4 left-5 right-5 flex items-end justify-between ${!sensor.photo && "bottom-auto top-5"}`}>
              <h3 className={`text-xl font-bold drop-shadow-md ${sensor.photo ? "text-white" : "text-dark dark:text-white"}`}>
                {sensor.location}
              </h3>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm bg-opacity-90 ${sensor.statusCss}`}>
                {sensor.statusText}
              </span>
            </div>
          </div>

          {/* Data Fields */}
          <div className="p-5 flex-grow flex flex-col">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-stroke dark:border-dark-3">
                <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Level Air</span>
                <span className="text-base font-bold text-dark dark:text-white">{sensor.level}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stroke dark:border-dark-3">
                <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Batas Banjir</span>
                <span className="text-base font-bold text-dark dark:text-white">{sensor.flood}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stroke dark:border-dark-3">
                <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Lokasi</span>
                <div className="text-right flex flex-col text-sm font-bold text-dark dark:text-white">
                  <span>{sensor.lat}</span>
                  <span>{sensor.lng}</span>
                </div>
              </div>
              {sensor.time && (
                <div className="flex items-center justify-between pb-1">
                  <span className="text-sm font-medium text-dark-5 dark:text-dark-6">Update</span>
                  <div className="text-right flex flex-col text-sm font-bold text-dark dark:text-white">
                    <span>{sensor.time.split('|')[0]}</span>
                    <span>{sensor.time.split('|')[1]}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-5">
              <button
                onClick={() => onViewLocation(sensor)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-theme-1 hover:bg-opacity-90 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C16 16.5 19 12.5 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.5 8 16.5 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Lihat Peta
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-999999 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CardsWaterlevel;
