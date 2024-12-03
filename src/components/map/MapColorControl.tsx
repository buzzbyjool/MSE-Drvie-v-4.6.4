import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const ROUTE_COLORS = [
  { name: 'Lime', value: '#84cc16' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
];

interface MapColorControlProps {
  onColorChange: (color: string) => void;
}

export default function MapColorControl({ onColorChange }: MapColorControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(ROUTE_COLORS[0].value);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className="leaflet-top leaflet-right mt-16 mr-4">
      <div className="leaflet-control">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 border border-gray-700 
                     rounded-lg hover:bg-gray-700 transition-colors"
            title="Change route color"
            style={{ borderBottom: `3px solid ${selectedColor}` }}
          >
            <Palette className="w-5 h-5 text-lime-500" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg 
                          shadow-lg overflow-hidden">
              {ROUTE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}