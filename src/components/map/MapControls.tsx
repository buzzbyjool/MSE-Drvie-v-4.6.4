import { useState } from 'react';
import { Layers, Sun, Moon, Crosshair, ZoomIn, ZoomOut, Palette } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MapControlsProps {
  onLayerChange: (layer: 'streets' | 'satellite') => void;
  onStyleChange: (isDark: boolean) => void;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  coordinates: LatLngTuple[];
  currentLayer: 'streets' | 'satellite';
  isDarkMode: boolean;
  currentColor: string;
  currentOpacity: number;
}

const ROUTE_COLORS = [
  { name: 'Lime', value: '#84cc16' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' }
] as const;

const OPACITY_OPTIONS = [
  { label: '100%', value: 1 },
  { label: '75%', value: 0.75 },
  { label: '50%', value: 0.5 },
  { label: '25%', value: 0.25 }
] as const;

export default function MapControls({ 
  onLayerChange, 
  onStyleChange,
  onColorChange,
  onOpacityChange,
  coordinates,
  currentLayer,
  isDarkMode,
  currentColor,
  currentOpacity
}: MapControlsProps) {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const map = useMap();

  const centerOnRoute = () => {
    if (coordinates.length > 0) {
      map.fitBounds(coordinates);
    }
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
      <div className="relative">
        <Tooltip content="Change map layer" position="right">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="map-control-button"
          >
            <Layers className="w-5 h-5 text-lime-500" />
          </button>
        </Tooltip>

        {isLayerMenuOpen && (
          <div className="absolute left-full ml-2 top-0 bg-gray-800 border border-gray-700 
                       rounded-lg shadow-lg overflow-hidden min-w-[160px]">
            <button
              onClick={() => {
                onLayerChange('streets');
                setIsLayerMenuOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left flex items-center justify-between
                         ${currentLayer === 'streets' ? 'bg-gray-700' : ''}`}
            >
              <span>Streets</span>
              {currentLayer === 'streets' && <div className="w-2 h-2 rounded-full bg-lime-500" />}
            </button>
            <button
              onClick={() => {
                onLayerChange('satellite');
                setIsLayerMenuOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left flex items-center justify-between
                         ${currentLayer === 'satellite' ? 'bg-gray-700' : ''}`}
            >
              <span>Satellite</span>
              {currentLayer === 'satellite' && <div className="w-2 h-2 rounded-full bg-lime-500" />}
            </button>
          </div>
        )}
      </div>

      {currentLayer === 'streets' && (
        <div className="relative">
          <Tooltip content="Map appearance" position="right">
            <button
              onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
              className="map-control-button"
            >
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-lime-500" />
              ) : (
                <Sun className="w-5 h-5 text-lime-500" />
              )}
            </button>
          </Tooltip>

          {isStyleMenuOpen && (
            <div className="absolute left-full ml-2 top-0 bg-gray-800 border border-gray-700 
                         rounded-lg shadow-lg overflow-hidden min-w-[160px]">
              <div className="p-2 border-b border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Theme</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onStyleChange(true);
                      setIsStyleMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-sm text-gray-300 rounded hover:bg-gray-700 text-left 
                             flex items-center justify-between ${isDarkMode ? 'bg-gray-700' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </div>
                    {isDarkMode && <div className="w-2 h-2 rounded-full bg-lime-500" />}
                  </button>
                  <button
                    onClick={() => {
                      onStyleChange(false);
                      setIsStyleMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-sm text-gray-300 rounded hover:bg-gray-700 text-left 
                             flex items-center justify-between ${!isDarkMode ? 'bg-gray-700' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </div>
                    {!isDarkMode && <div className="w-2 h-2 rounded-full bg-lime-500" />}
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Route Opacity</p>
                <div className="space-y-1">
                  {OPACITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onOpacityChange(option.value);
                        setIsStyleMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-sm text-gray-300 rounded hover:bg-gray-700 text-left 
                               flex items-center justify-between ${currentOpacity === option.value ? 'bg-gray-700' : ''}`}
                    >
                      <span>{option.label}</span>
                      {currentOpacity === option.value && <div className="w-2 h-2 rounded-full bg-lime-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Tooltip content="Center on route" position="right">
        <button
          onClick={centerOnRoute}
          className="map-control-button"
        >
          <Crosshair className="w-5 h-5 text-lime-500" />
        </button>
      </Tooltip>

      <Tooltip content="Zoom in" position="right">
        <button
          onClick={handleZoomIn}
          className="map-control-button"
        >
          <ZoomIn className="w-5 h-5 text-lime-500" />
        </button>
      </Tooltip>

      <Tooltip content="Zoom out" position="right">
        <button
          onClick={handleZoomOut}
          className="map-control-button"
        >
          <ZoomOut className="w-5 h-5 text-lime-500" />
        </button>
      </Tooltip>

      <div className="relative">
        <Tooltip content="Change route color" position="right">
          <button
            onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
            className="map-control-button"
            style={{ borderBottom: `3px solid ${currentColor}` }}
          >
            <Palette className="w-5 h-5 text-lime-500" />
          </button>
        </Tooltip>

        {isColorMenuOpen && (
          <div className="absolute left-full ml-2 top-0 bg-gray-800 border border-gray-700 
                       rounded-lg shadow-lg overflow-hidden min-w-[120px]">
            {ROUTE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  onColorChange(color.value);
                  setIsColorMenuOpen(false);
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
    </div>
  );
}