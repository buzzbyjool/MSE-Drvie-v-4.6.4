import { ReactNode, useState, useEffect, useCallback } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { MAP_LAYERS, DEFAULT_CENTER, DEFAULT_ZOOM } from '../../config/mapLayers';
import MapControls from './MapControls';
import RouteLayer from './RouteLayer';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  coordinates: LatLngTuple[];
  bounds: LatLngTuple[];
  routeColor?: string;
  routeWeight?: number;
  routeOpacity?: number;
  children?: ReactNode;
}

function MapController({ coordinates }: { coordinates: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      map.fitBounds(coordinates);
    }
  }, [coordinates, map]);

  return null;
}

export default function EnhancedMapContainer({
  coordinates,
  bounds,
  routeColor = '#84cc16',
  routeWeight = 4,
  routeOpacity = 0.8,
  children
}: MapContainerProps) {
  const [currentLayer, setCurrentLayer] = useState<'streets' | 'satellite'>('streets');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [routeColorState, setRouteColor] = useState(routeColor);
  const [routeOpacityState, setRouteOpacity] = useState(routeOpacity);

  const getCurrentTileLayer = useCallback(() => {
    if (currentLayer === 'satellite') {
      return MAP_LAYERS.satellite;
    }
    return isDarkMode ? MAP_LAYERS.streets.dark : MAP_LAYERS.streets.light;
  }, [currentLayer, isDarkMode]);

  const handleLayerChange = useCallback((layer: 'streets' | 'satellite') => {
    setCurrentLayer(layer);
  }, []);

  const handleStyleChange = useCallback((dark: boolean) => {
    setIsDarkMode(dark);
  }, []);

  const tileLayer = getCurrentTileLayer();

  return (
    <div className="relative w-full h-full">
      <LeafletMap
        bounds={bounds}
        className="w-full h-full rounded-lg"
        zoomControl={false}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
      >
        <TileLayer
          key={`${currentLayer}-${isDarkMode}`}
          url={tileLayer.url}
          attribution={tileLayer.attribution}
          maxZoom={20}
          tileSize={512}
          zoomOffset={-1}
        />

        <MapController coordinates={coordinates} />
        
        <MapControls 
          onLayerChange={handleLayerChange}
          onStyleChange={handleStyleChange}
          onColorChange={setRouteColor}
          onOpacityChange={setRouteOpacity}
          coordinates={coordinates}
          currentLayer={currentLayer}
          isDarkMode={isDarkMode}
          currentColor={routeColorState}
          currentOpacity={routeOpacityState}
        />

        <RouteLayer
          coordinates={coordinates}
          color={routeColorState}
          weight={routeWeight}
          opacity={routeOpacityState}
        />

        {children}
      </LeafletMap>
    </div>
  );
}