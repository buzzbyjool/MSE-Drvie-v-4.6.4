import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Leaflet icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const createCustomIcon = (color: string = '#3B82F6') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color};" 
           class="marker-pin w-6 h-6 rounded-full border-2 border-white shadow-lg"></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Initialize Mapbox
if (import.meta.env.VITE_MAPBOX_TOKEN) {
  (window as any).mapboxgl = {
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN
  };
}