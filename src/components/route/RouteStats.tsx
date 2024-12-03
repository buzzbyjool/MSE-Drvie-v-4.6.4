import { Map, Route, CornerDownRight } from 'lucide-react';
import { useMemo } from 'react';
import { bearing, point } from '@turf/turf';
import { LatLngTuple } from 'leaflet';

interface RouteStatsProps {
  distance: number;
  duration: number;
  startLocation?: string;
  endLocation?: string;
  coordinates: LatLngTuple[];
}

export default function RouteStats({ 
  distance, 
  duration,
  startLocation,
  endLocation,
  coordinates
}: RouteStatsProps) {
  const curveCount = useMemo(() => {
    if (coordinates.length < 3) return 0;

    let curves = 0;
    const CURVE_THRESHOLD = 20;

    for (let i = 1; i < coordinates.length - 1; i++) {
      const prev = point([coordinates[i-1][1], coordinates[i-1][0]]);
      const current = point([coordinates[i][1], coordinates[i][0]]);
      const next = point([coordinates[i+1][1], coordinates[i+1][0]]);

      const bearing1 = bearing(prev, current);
      const bearing2 = bearing(current, next);

      let bearingDiff = Math.abs(bearing1 - bearing2);
      if (bearingDiff > 180) {
        bearingDiff = 360 - bearingDiff;
      }

      if (bearingDiff > CURVE_THRESHOLD) {
        curves++;
      }
    }

    return curves;
  }, [coordinates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-lime-500" />
          <h3 className="text-gray-300 font-medium">Distance</h3>
        </div>
        <p className="text-2xl font-bold text-gray-100 mt-2">{distance.toFixed(1)} km</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-lime-500" />
          <h3 className="text-gray-300 font-medium">Est. Duration</h3>
        </div>
        <p className="text-2xl font-bold text-gray-100 mt-2">{Math.floor(duration / 3600)}h {Math.floor((duration % 3600) / 60)}m</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <CornerDownRight className="w-5 h-5 text-lime-500" />
          <h3 className="text-gray-300 font-medium">Est. Curves</h3>
        </div>
        <p className="text-2xl font-bold text-gray-100 mt-2">{curveCount}</p>
      </div>

      <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Route className="w-6 h-6 text-lime-500" />
          <h2 className="text-xl font-bold text-gray-100">Route Details</h2>
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
    </div>
  );
}