import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import FileUpload from './FileUpload';
import { parseGPX } from '../utils/gpxParser';
import { gpxTable } from '../utils/airtable';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import html2canvas from 'html2canvas';

interface UploadModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function UploadModal({ onClose, onUploadComplete }: UploadModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const result = await parseGPX(file);
      setParsedData(result);
      setCoordinates(result.coordinates);
      setGpxFile(file);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setParsedData(null);
      setGpxFile(null);
      setCoordinates([]);
    }
  };

  const captureThumbnail = async (): Promise<string> => {
    if (!mapRef.current) throw new Error('Map reference not found');

    try {
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        backgroundColor: '#1f2937', // Dark background
        scale: 2, // Higher quality
      });

      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('Error capturing thumbnail:', err);
      throw new Error('Failed to capture thumbnail');
    }
  };

  const handleSubmit = async () => {
    if (!gpxFile || !parsedData) return;

    try {
      // Convert GPX file to base64
      const fileReader = new FileReader();
      fileReader.readAsDataURL(gpxFile);
      
      fileReader.onload = async () => {
        const gpxBase64 = fileReader.result as string;
        
        // Capture thumbnail
        const thumbnailBase64 = await captureThumbnail();

        // Create record with both GPX file and thumbnail
        await gpxTable.create({
          fields: {
            'GPX File': [{ url: gpxBase64 }],
            'Start': parsedData.startLocation || '',
            'Arrival': parsedData.endLocation || '',
            'Thumbnail': [{ url: thumbnailBase64 }],
          }
        });

        onUploadComplete();
      };
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload route');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-100 mb-6">Add New Route</h2>

        <div className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} />

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}

          {coordinates.length > 0 && (
            <div className="relative w-24 h-24" ref={mapRef}>
              <MapContainer
                bounds={coordinates}
                zoomControl={false}
                attributionControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                className="h-full w-full rounded-lg overflow-hidden"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="dark-tiles"
                />
                <Polyline
                  positions={coordinates}
                  pathOptions={{ 
                    color: '#84cc16', 
                    weight: 4,
                    opacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
              </MapContainer>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-900/50" />
            </div>
          )}

          {parsedData && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-400"
              >
                Upload Route
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}