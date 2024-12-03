import { useEffect, useState } from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { createCustomIcon } from '../../utils/leafletSetup';
import { getLocationName } from '../../utils/geocoding';

interface RouteLayerProps {
  coordinates: LatLngTuple[];
  color: string;
  weight: number;
  opacity: number;
}

export default function RouteLayer({
  coordinates,
  color,
  weight,
  opacity
}: RouteLayerProps) {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');

  useEffect(() => {
    if (coordinates.length > 0) {
      const fetchLocations = async () => {
        try {
          const [start, end] = await Promise.all([
            getLocationName(coordinates[0]),
            getLocationName(coordinates[coordinates.length - 1])
          ]);
          setStartLocation(start.name);
          setEndLocation(end.name);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
      };
      fetchLocations();
    }
  }, [coordinates]);

  // Calculate checkpoints
  const checkpoints = coordinates.length > 0 ? 
    [0, 0.25, 0.5, 0.75, 1].map(percent => {
      const index = Math.floor(coordinates.length * percent);
      return coordinates[Math.min(index, coordinates.length - 1)];
    }) : [];

  return (
    <>
      <Polyline
        positions={coordinates}
        pathOptions={{
          color,
          weight,
          opacity,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />

      {coordinates.length > 0 && (
        <>
          <Marker 
            position={coordinates[0]}
            icon={createCustomIcon('#22c55e')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Start:</strong> {startLocation}
              </div>
            </Popup>
          </Marker>

          {checkpoints.slice(1, -1).map((position, index) => (
            <Marker
              key={index}
              position={position}
              icon={createCustomIcon(color)}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Checkpoint {index + 1}</strong>
                </div>
              </Popup>
            </Marker>
          ))}

          <Marker 
            position={coordinates[coordinates.length - 1]}
            icon={createCustomIcon('#ef4444')}
          >
            <Popup>
              <div className="text-sm">
                <strong>End:</strong> {endLocation}
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </>
  );
}