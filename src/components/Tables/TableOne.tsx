import { ReactNode } from "react";
import { SensorAlert } from "../Cards/CardsWaterlevel";

type Props = {
  data: SensorAlert[];
  onViewLocation: (sensor: SensorAlert) => void;
};

const TableOne = ({ data, onViewLocation }: Props) => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px] flex flex-col">
          <div className="grid grid-cols-5">
            <div className="px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Sensor ID
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Location
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Water Level
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
              </h5>
            </div>
          </div>

          {data.map((sensor, key) => (
            <div
              className={`grid grid-cols-5 ${
                key === data.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
              }`}
              key={key}
            >
              <div className="flex items-center px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {sensor.id}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {sensor.location}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium text-dark dark:text-white">
                  {sensor.level}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p
                  className={`font-medium ${sensor.tableColor}`}
                >
                  {sensor.statusText}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <button
                  onClick={() => onViewLocation(sensor)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableOne;
