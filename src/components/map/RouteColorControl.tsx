import { useState } from 'react';
import { Palette } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const ROUTE_COLORS = [
  { name: 'Lime', value: '#84cc16' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' }
] as const;

interface RouteColorControlProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

export default function RouteColorControl({ onColorChange, currentColor }: RouteColorControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Tooltip content="Change route color" position="right">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="map-control-button"
          style={{ borderBottom: `3px solid ${currentColor}` }}
        >
          <Palette className="w-5 h-5 text-lime-500" />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute left-full ml-2 top-0 bg-gray-800 border border-gray-700 
                     rounded-lg shadow-lg overflow-hidden min-w-[120px]">
          {ROUTE_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                onColorChange(color.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left 
                       flex items-center justify-between ${currentColor === color.value ? 'bg-gray-700' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.name}</span>
              </div>
              {currentColor === color.value && (
                <div className="w-2 h-2 rounded-full bg-lime-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}