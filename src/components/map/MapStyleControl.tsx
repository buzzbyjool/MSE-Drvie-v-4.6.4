import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Sun, Moon } from 'lucide-react';
import { applyMapStyle } from '../../utils/leafletSetup';

interface MapStyleControlProps {
  onStyleChange: (isDark: boolean) => void;
}

export default function MapStyleControl({ onStyleChange }: MapStyleControlProps) {
  const map = useMap();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    applyMapStyle(map, isDark);
  }, [map, isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    onStyleChange(!isDark);
  };

  return (
    <div className="leaflet-top leaflet-right mt-4 mr-4">
      <div className="leaflet-control">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 bg-gray-800 border border-gray-700 
                   rounded-lg hover:bg-gray-700 transition-colors"
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-lime-500" />
          ) : (
            <Moon className="w-5 h-5 text-lime-500" />
          )}
        </button>
      </div>
    </div>
  );
}