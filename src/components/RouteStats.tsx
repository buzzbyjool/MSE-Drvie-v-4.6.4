import { Map, Mountain, Route } from 'lucide-react';

interface RouteStatsProps {
  distance: number;
  elevation: number;
  duration: number;
  startLocation?: string;
  endLocation?: string;
}

export default function RouteStats({ 
  distance, 
  elevation, 
  duration,
  startLocation,
  endLocation
}: RouteStatsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Route className="w-6 h-6 text-lime-500" />
          <h2 className="text-xl font-bold text-gray-100">Roadtrip Details</h2>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
            </div>
            <div className="ml-2">
              <p className="text-sm text-gray-400">Starting Point</p>
              <p className="text-lg font-semibold text-gray-100">
                {startLocation || 'Loading...'}
              </p>
            </div>
          </div>

          <div className="ml-4 border-l-2 border-dashed border-gray-700 pl-4 py-2">
            <div className="flex items-center text-gray-300">
              <Route className="w-4 h-4 mr-2 text-lime-500" />
              <span>{distance.toFixed(1)} km total distance</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-2">
              <p className="text-sm text-gray-400">Destination</p>
              <p className="text-lg font-semibold text-gray-100">
                {endLocation || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
          <div className="flex items-center space-x-2">
            <Route className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Distance</h3>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{distance.toFixed(1)} km</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
          <div className="flex items-center space-x-2">
            <Mountain className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Elevation</h3>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{elevation.toFixed(0)} m</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
          <div className="flex items-center space-x-2">
            <Map className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Est. Duration</h3>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{Math.floor(duration / 3600)}h {Math.floor((duration % 3600) / 60)}m</p>
        </div>
      </div>
    </div>
  );
}