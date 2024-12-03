import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Map, Mountain, Clock } from 'lucide-react';

interface RoutePreviewProps {
  route: {
    startLocation: string;
    endLocation: string;
    distance: string;
    duration: string;
    maxElevation: string;
    coordinates: [number, number][];
  };
}

export default function RoutePreview({ route }: RoutePreviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Map className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Distance</h3>
          </div>
          <p className="text-xl font-bold text-gray-100">{route.distance}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Mountain className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Max Elevation</h3>
          </div>
          <p className="text-xl font-bold text-gray-100">{route.maxElevation}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-lime-500" />
            <h3 className="text-gray-300 font-medium">Est. Duration</h3>
          </div>
          <p className="text-xl font-bold text-gray-100">{route.duration}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-lime-500 rounded-full" />
          <span className="text-gray-300">{route.startLocation}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-gray-300">{route.endLocation}</span>
        </div>
      </div>

      <div className="h-64 bg-gray-700 rounded-lg overflow-hidden">
        <MapContainer
          bounds={route.coordinates}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: '#84cc16',
              weight: 3,
              opacity: 0.8
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}