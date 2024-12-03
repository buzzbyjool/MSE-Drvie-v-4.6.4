import { TrendingUp, TrendingDown, ArrowDown, ArrowUp } from 'lucide-react';

interface ElevationStatsProps {
  elevationGain: number;
  elevationLoss: number;
  minElevation: number;
  maxElevation: number;
}

export default function ElevationStats({
  elevationGain,
  elevationLoss,
  minElevation,
  maxElevation
}: ElevationStatsProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Elevation Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-lime-500" />
            <h4 className="text-sm font-medium text-gray-300">Elevation Gain</h4>
          </div>
          <p className="text-2xl font-bold text-gray-100">{elevationGain.toFixed(0)}m</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h4 className="text-sm font-medium text-gray-300">Elevation Loss</h4>
          </div>
          <p className="text-2xl font-bold text-gray-100">{elevationLoss.toFixed(0)}m</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUp className="w-5 h-5 text-lime-500" />
            <h4 className="text-sm font-medium text-gray-300">Max Elevation</h4>
          </div>
          <p className="text-2xl font-bold text-gray-100">{maxElevation.toFixed(0)}m</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDown className="w-5 h-5 text-red-500" />
            <h4 className="text-sm font-medium text-gray-300">Min Elevation</h4>
          </div>
          <p className="text-2xl font-bold text-gray-100">{minElevation.toFixed(0)}m</p>
        </div>
      </div>
    </div>
  );
}