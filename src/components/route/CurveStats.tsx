import { CornerDownRight } from 'lucide-react';
import { useMemo } from 'react';
import { bearing, point } from '@turf/turf';
import { LatLngTuple } from 'leaflet';

interface CurveStatsProps {
  coordinates: LatLngTuple[];
}

export default function CurveStats({ coordinates }: CurveStatsProps) {
  const curveCount = useMemo(() => {
    if (coordinates.length < 3) return 0;

    let curves = 0;
    const CURVE_THRESHOLD = 20; // Minimum angle change to consider as a curve

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
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Route Curves</h3>
      
      <div className="bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CornerDownRight className="w-5 h-5 text-lime-500" />
          <h4 className="text-sm font-medium text-gray-300">Total Curves</h4>
        </div>
        <p className="text-2xl font-bold text-gray-100">{curveCount}</p>
        <p className="text-sm text-gray-400 mt-1">
          Significant direction changes (&gt;20°)
        </p>
      </div>
    </div>
  );
}