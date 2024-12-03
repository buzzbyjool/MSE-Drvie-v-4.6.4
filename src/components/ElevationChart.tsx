import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LatLngTuple } from 'leaflet';

interface ElevationPoint {
  distance: number;
  elevation: number;
  coordinates: LatLngTuple;
}

interface ElevationChartProps {
  data: ElevationPoint[];
}

export default function ElevationChart({ data }: ElevationChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-lg">
          <p className="text-sm text-gray-300">
            Distance: {payload[0].payload.distance.toFixed(1)} km
          </p>
          <p className="text-sm text-gray-300">
            Elevation: {payload[0].payload.elevation.toFixed(0)} m
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48 w-full bg-gray-800 rounded-lg p-4">
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}