import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Camera } from 'lucide-react';
import { ScenicSpot } from '../../utils/elevationAnalysis';

interface ScenicMarkersProps {
  spots: ScenicSpot[];
}

export default function ScenicMarkers({ spots }: ScenicMarkersProps) {
  const getMarkerIcon = (ranking: number) => {
    const colors = {
      1: '#fbbf24',
      2: '#fb7185',
      3: '#c084fc'
    };
    
    const iconHtml = `
      <div class="relative">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${colors[ranking as keyof typeof colors]}" 
             style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.3));">
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 7 13s7-7.75 7-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center mt-0.5">
          <svg class="w-3 h-3 text-gray-900" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="3">
            ${Camera.toString()}
          </svg>
        </div>
      </div>
    `;

    return divIcon({
      html: iconHtml,
      className: 'scenic-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  };

  return (
    <>
      {spots.map((spot, index) => (
        <Marker
          key={`spot-${index}`}
          position={spot.coordinates}
          icon={getMarkerIcon(spot.ranking)}
        >
          <Popup className="scenic-popup">
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg shadow-xl border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold">Vista Point {spot.ranking}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">
                  Elevation: <span className="text-amber-400 font-semibold">
                    {Math.round(spot.elevation)}m
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Great spot for photos!
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}