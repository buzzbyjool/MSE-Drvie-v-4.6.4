import { useState } from 'react';
import { Layers } from 'lucide-react';
import Tooltip from '../common/Tooltip';

interface OpacityControlProps {
  onOpacityChange: (opacity: number) => void;
  currentOpacity: number;
}

export default function OpacityControl({ onOpacityChange, currentOpacity }: OpacityControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const opacityOptions = [
    { label: '100%', value: 1 },
    { label: '75%', value: 0.75 },
    { label: '50%', value: 0.5 },
    { label: '25%', value: 0.25 }
  ];

  return (
    <div className="relative">
      <Tooltip content="Change route opacity" position="right">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="map-control-button"
          style={{ opacity: currentOpacity }}
        >
          <Layers className="w-5 h-5 text-lime-500" />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute left-full ml-2 top-0 bg-gray-800 border border-gray-700 
                     rounded-lg shadow-lg overflow-hidden min-w-[120px]">
          {opacityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onOpacityChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left 
                       flex items-center justify-between ${currentOpacity === option.value ? 'bg-gray-700' : ''}`}
            >
              <span>{option.label}</span>
              {currentOpacity === option.value && (
                <div className="w-2 h-2 rounded-full bg-lime-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}