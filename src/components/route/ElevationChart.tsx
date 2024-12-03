import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceDot } from 'recharts';
import { LatLngTuple } from 'leaflet';
import { Flag, MapPin } from 'lucide-react';

interface ElevationPoint {
  distance: number;
  elevation: number;
  coordinates: LatLngTuple;
  isCheckpoint?: boolean;
  checkpointIndex?: number;
}

interface ElevationChartProps {
  data: ElevationPoint[];
}

export default function ElevationChart({ data }: ElevationChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          {point.isCheckpoint && (
            <div className="flex items-center space-x-2 mb-2 text-sm">
              {point.checkpointIndex === 0 && (
                <>
                  <Flag className="w-4 h-4 text-lime-500" />
                  <span className="text-lime-500 font-medium">Start Point</span>
                </>
              )}
              {point.checkpointIndex === 4 && (
                <>
                  <Flag className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 font-medium">End Point</span>
                </>
              )}
              {point.checkpointIndex > 0 && point.checkpointIndex < 4 && (
                <>
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 font-medium">Checkpoint {point.checkpointIndex}</span>
                </>
              )}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-gray-300">
              Distance: {point.distance.toFixed(1)} km
            </p>
            <p className="text-sm text-gray-300">
              Elevation: {point.elevation.toFixed(0)} m
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="distance"
            tickFormatter={(value) => `${value.toFixed(1)} km`}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value}m`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#84cc16"
            strokeWidth={2}
            fill="url(#elevationGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#84cc16' }}
          />
          {data.map((point, index) => {
            if (point.isCheckpoint) {
              let color;
              if (point.checkpointIndex === 0) {
                color = '#22c55e'; // Start point (green)
              } else if (point.checkpointIndex === 4) {
                color = '#ef4444'; // End point (red)
              } else {
                color = '#3b82f6'; // Intermediate checkpoints (blue)
              }

              return (
                <ReferenceDot
                  key={`checkpoint-${index}`}
                  x={point.distance}
                  y={point.elevation}
                  r={5}
                  fill={color}
                  stroke="#1f2937"
                  strokeWidth={2}
                />
              );
            }
            return null;
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}