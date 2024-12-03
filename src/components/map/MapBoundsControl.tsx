import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngTuple, LatLngBounds } from 'leaflet';

interface BoundsControlProps {
  bounds: LatLngTuple[];
}

export default function MapBoundsControl({ bounds }: BoundsControlProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length === 2) {
      const latLngBounds = new LatLngBounds(bounds[0], bounds[1]);
      map.fitBounds(latLngBounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
}