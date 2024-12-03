import { useState } from 'react';
import { X, Map as MapIcon, Check } from 'lucide-react';
import { parseGPX } from '../utils/gpxParser';
import { createGPXRoute } from '../services/airtable/gpx';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../services/cloudinary';
import RoutePreview from './RoutePreview';

interface UploadGPXModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

interface ParsedRoute {
  startLocation: string;
  endLocation: string;
  distance: string;
  duration: string;
  maxElevation: string;
  coordinates: [number, number][];
}

export default function UploadGPXModal({ onClose, onUploadComplete }: UploadGPXModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedRoute, setParsedRoute] = useState<ParsedRoute | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setError('Please select a valid GPX file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const content = await file.text();
      const parsedData = await parseGPX(content);

      setParsedRoute({
        startLocation: parsedData.startLocation || '',
        endLocation: parsedData.endLocation || '',
        distance: `${parsedData.stats.distance.toFixed(1)} km`,
        duration: `${Math.floor(parsedData.stats.duration / 3600)}h ${Math.floor((parsedData.stats.duration % 3600) / 60)}m`,
        maxElevation: `${parsedData.stats.elevation.toFixed(0)} m`,
        coordinates: parsedData.coordinates
      });

      setStartLocation(parsedData.startLocation || '');
      setEndLocation(parsedData.endLocation || '');
      setGpxFile(file);
      setError(null);
    } catch (err) {
      console.error('Error processing GPX:', err);
      setError((err as Error).message || 'Failed to process GPX file');
      setParsedRoute(null);
      setGpxFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !parsedRoute || !gpxFile) return;

    if (!title.trim()) {
      setError('Please enter a title for the route');
      return;
    }

    if (!startLocation.trim() || !endLocation.trim()) {
      setError('Please enter both start and end locations');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      const cloudinaryUrl = await uploadToCloudinary(gpxFile, {
        resourceType: 'raw',
        folder: 'msedrive/gpx'
      });
      setUploadProgress(50);

      await createGPXRoute({
        gpxFileUrl: cloudinaryUrl,
        title: title.trim(),
        startLocation: startLocation.trim(),
        endLocation: endLocation.trim(),
        distance: parsedRoute.distance,
        duration: parsedRoute.duration,
        maxElevation: parsedRoute.maxElevation,
        user: user.username
      });

      setUploadProgress(100);
      setUploadSuccess(true);
      
      setTimeout(() => {
        onUploadComplete();
      }, 2000);
    } catch (err) {
      console.error('Error saving route:', err);
      setError((err as Error).message || 'Failed to save route');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-lime-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-100">Route Uploaded Successfully</h2>
            <p className="text-gray-400">Your route has been submitted and is waiting for validation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-gray-100">Upload New Route</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {!parsedRoute ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 
                           border-gray-800 border-dashed rounded-lg cursor-pointer 
                           hover:border-lime-500 bg-gray-800/50 backdrop-blur-sm transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <input
                  type="file"
                  className="hidden"
                  accept=".gpx"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                <MapIcon className="w-12 h-12 text-lime-500 mb-3" />
                <p className="mb-2 text-sm text-gray-300">
                  <span className="text-lime-500 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">GPX files only (max 10MB)</p>
              </div>
            </label>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Route Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:outline-none focus:border-lime-500"
                    placeholder="Enter route title"
                  />
                </div>

                <div>
                  <label htmlFor="startLocation" className="block text-sm font-medium text-gray-300 mb-2">
                    Start Location
                  </label>
                  <input
                    type="text"
                    id="startLocation"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:outline-none focus:border-lime-500"
                    placeholder="Enter start location"
                  />
                </div>

                <div>
                  <label htmlFor="endLocation" className="block text-sm font-medium text-gray-300 mb-2">
                    End Location
                  </label>
                  <input
                    type="text"
                    id="endLocation"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:outline-none focus:border-lime-500"
                    placeholder="Enter end location"
                  />
                </div>
              </div>

              <RoutePreview 
                route={{
                  ...parsedRoute,
                  startLocation,
                  endLocation
                }} 
              />

              {uploadProgress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          {parsedRoute && (
            <button
              onClick={handleSubmit}
              disabled={uploading || !title.trim() || !startLocation.trim() || !endLocation.trim()}
              className="px-6 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-400 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Saving...' : 'Save Route'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}