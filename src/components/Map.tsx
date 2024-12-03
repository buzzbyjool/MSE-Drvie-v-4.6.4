import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, Marker, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocationName } from '../utils/geocoding';
import { createCustomIcon, applyMapStyle } from '../utils/leafletSetup';
import MapLayerControl from './map/MapLayerControl';
import MapStyleControl from './map/MapStyleControl';
import { MAP_LAYERS, DEFAULT_CENTER, DEFAULT_ZOOM } from '../config/mapLayers';

interface MapProps {
  coordinates: LatLngTuple[];
  bounds: LatLngTuple[];
}

function MapController({ coordinates }: { coordinates: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = map.getBounds();
      map.fitBounds(bounds.extend(coordinates));
    }
  }, [coordinates, map]);

  return null;
}

export default function Map({ coordinates, bounds }: MapProps) {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [currentLayer, setCurrentLayer] = useState(MAP_LAYERS.default);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (coordinates.length > 0) {
      const fetchLocations = async () => {
        try {
          const start = await getLocationName(coordinates[0]);
          const end = await getLocationName(coordinates[coordinates.length - 1]);
          setStartLocation(start.name);
          setEndLocation(end.name);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
      };
      fetchLocations();
    }
  }, [coordinates]);

  const handleLayerChange = useCallback((layer: typeof MAP_LAYERS[keyof typeof MAP_LAYERS]) => {
    setCurrentLayer(layer);
  }, []);

  const handleStyleChange = useCallback((dark: boolean) => {
    setIsDarkMode(dark);
  }, []);

  // Calculate checkpoints every 25% of the route
  const checkpoints = coordinates.length > 0 ? 
    [0, 0.25, 0.5, 0.75, 1].map(percent => {
      const index = Math.floor(coordinates.length * percent);
      return coordinates[Math.min(index, coordinates.length - 1)];
    }) : [];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        bounds={bounds}
        className={`w-full h-full rounded-lg ${isDarkMode ? 'map-dark' : ''}`}
        zoomControl={true}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
      >
        <TileLayer
          url={currentLayer.url}
          attribution={currentLayer.attribution}
        />

        <MapController coordinates={coordinates} />
        <MapLayerControl onLayerChange={handleLayerChange} />
        <MapStyleControl onStyleChange={handleStyleChange} />

        {/* Route Line */}
        <Polyline
          positions={coordinates}
          pathOptions={{
            color: '#84cc16',
            weight: 4,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />

        {/* Start Marker */}
        {coordinates.length > 0 && (
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
        )}

        {/* Checkpoint Markers */}
        {checkpoints.slice(1, -1).map((position, index) => (
          <Marker
            key={index}
            position={position}
            icon={createCustomIcon('#84cc16')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Checkpoint {index + 1}</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* End Marker */}
        {coordinates.length > 0 && (
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
        )}
      </MapContainer>
    </div>
  );
}