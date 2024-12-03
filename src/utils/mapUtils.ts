import { divIcon } from 'leaflet';

export function createCheckpointMarker(label: string) {
  return divIcon({
    className: 'checkpoint-marker',
    html: `
      <div class="flex items-center justify-center w-1 h-1 rounded-full bg-gray-800 
                border-2 border-blue-500 text-blue-500 font-bold text-sm">
        ${label}
      </div>
    `,
    iconSize: [4, 4],
    iconAnchor: [2, 2]
  });
}