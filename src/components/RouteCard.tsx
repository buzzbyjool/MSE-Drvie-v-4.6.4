import { Map as MapIcon, Clock, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { GPXRoute } from '../utils/airtable';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { parseGPX } from '../utils/gpxParser';
import { fetchGPXContent } from '../utils/airtable';

interface RouteCardProps {
  route: GPXRoute;
  onClick: () => void;
}

export default function RouteCard({ route, onClick }: RouteCardProps) {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGPXData = async () => {
      if (route.gpxFileUrl) {
        try {
          setLoading(true);
          const gpxContent = await fetchGPXContent(route.gpxFileUrl);
          const parsedData = await parseGPX(gpxContent);
          setCoordinates(parsedData.coordinates);
          setError(null);
        } catch (err) {
          console.error('Error loading GPX data:', err);
          setError('Failed to load route data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadGPXData();
  }, [route.gpxFileUrl]);

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-lime-500 
                 transition-all cursor-pointer group hover:shadow-xl hover:shadow-lime-500/10 p-4"
    >
      <div className="flex flex-col space-y-4">
        {loading ? (
          <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-lime-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
            <MapIcon className="w-8 h-8 text-gray-500" />
          </div>
        ) : coordinates.length > 0 ? (
          <div className="w-full h-48 rounded-lg overflow-hidden relative">
            <MapContainer
              bounds={coordinates}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline
                positions={coordinates}
                pathOptions={{ 
                  color: '#84cc16', 
                  weight: 3,
                  opacity: 0.8
                }}
              />
            </MapContainer>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
            <MapIcon className="w-8 h-8 text-gray-500" />
          </div>
        )}

        <div className="space-y-4">
          {route.title && (
            <h3 className="text-xl font-bold text-lime-500 group-hover:text-lime-400 
                        transition-colors duration-300">
              {route.title}
            </h3>
          )}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-lime-500 rounded-full" />
              <span className="text-sm text-gray-300">{route.startLocation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-300">{route.endLocation}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {route.distance && (
              <div className="flex items-center space-x-2">
                <MapIcon className="w-4 h-4 text-lime-500" />
                <span className="text-sm text-gray-300">
                  {route.distance}
                </span>
              </div>
            )}
            {route.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-lime-500" />
                <span className="text-sm text-gray-300">
                  {route.duration}
                </span>
              </div>
            )}
          </div>

          {route.status === 'Pending' && (
            <div className="flex items-center space-x-2 text-yellow-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Pending Approval</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}