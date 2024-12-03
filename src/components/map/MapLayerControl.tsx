import { useState } from 'react';
import { Layers } from 'lucide-react';
import { MAP_LAYERS } from '../../config/mapLayers';

interface MapLayerControlProps {
  onLayerChange: (layer: {
    url: string;
    attribution: string;
    name: string;
  }) => void;
}

export default function MapLayerControl({ onLayerChange }: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLayerSelect = (layerKey: keyof typeof MAP_LAYERS.mapbox | 'osm') => {
    if (layerKey === 'osm') {
      onLayerChange(MAP_LAYERS.osm);
    } else {
      onLayerChange(MAP_LAYERS.mapbox[layerKey]);
    }
    setIsOpen(false);
  };

  return (
    <div className="leaflet-top leaflet-right mt-28 mr-4">
      <div className="leaflet-control">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 border border-gray-700 
                     rounded-lg hover:bg-gray-700 transition-colors"
            title="Change map style"
          >
            <Layers className="w-5 h-5 text-lime-500" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg 
                          shadow-lg overflow-hidden min-w-[160px] z-[1000]">
              <div className="py-1">
                <button
                  onClick={() => handleLayerSelect('osm')}
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                >
                  OpenStreetMap
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                {(Object.keys(MAP_LAYERS.mapbox) as Array<keyof typeof MAP_LAYERS.mapbox>).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleLayerSelect(key)}
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                  >
                    {MAP_LAYERS.mapbox[key].name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}