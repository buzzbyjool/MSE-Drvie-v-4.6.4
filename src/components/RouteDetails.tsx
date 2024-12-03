import { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { LatLngTuple } from 'leaflet';
import { GPXRoute } from '../types/airtable';
import { parseGPX } from '../utils/gpxParser';
import { fetchGPXContent } from '../services/airtable/gpx';
import RouteStats from './route/RouteStats';
import ElevationChart from './route/ElevationChart';
import ElevationStats from './route/ElevationStats';
import EnhancedMapContainer from './map/MapContainer';
import FunScoreBadge from './FunScoreBadge';
import { calculateFunScore } from '../utils/funScore';
import { analyzeScenicSpots, ScenicSpot } from '../utils/elevationAnalysis';
import ScenicMarkers from './map/ScenicMarkers';

interface RouteDetailsProps {
  route: GPXRoute;
  onBack: () => void;
}

export default function RouteDetails({ route, onBack }: RouteDetailsProps) {
  const [coordinates, setCoordinates] = useState<LatLngTuple[]>([]);
  const [bounds, setBounds] = useState<LatLngTuple[]>([]);
  const [stats, setStats] = useState({
    distance: 0,
    elevation: 0,
    duration: 0,
    elevationGain: 0,
    elevationLoss: 0,
    minElevation: 0,
    maxElevation: 0,
    curves: 0
  });
  const [elevationData, setElevationData] = useState<Array<{ distance: number; elevation: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [funScore, setFunScore] = useState<number>(0);
  const [scenicSpots, setScenicSpots] = useState<ScenicSpot[]>([]);

  useEffect(() => {
    const loadRouteData = async () => {
      if (!route.gpxFileUrl) {
        setError('No GPX file URL provided');
        setLoading(false);
        return;
      }

      try {
        const gpxContent = await fetchGPXContent(route.gpxFileUrl);
        const parsedData = await parseGPX(gpxContent);
        
        setCoordinates(parsedData.coordinates);
        setBounds(parsedData.bounds);
        setStats(parsedData.stats);
        setElevationData(parsedData.elevationData);

        // Calculate fun score
        const score = calculateFunScore({
          curveCount: parsedData.stats.curves || 0,
          distance: parsedData.stats.distance,
          elevationGain: parsedData.stats.elevationGain,
          elevationLoss: parsedData.stats.elevationLoss,
          maxElevation: parsedData.stats.maxElevation
        });
        setFunScore(score);

        // Analyze scenic spots
        const spots = analyzeScenicSpots(parsedData.elevationData);
        setScenicSpots(spots);

        setError(null);
      } catch (err) {
        console.error('Error loading route data:', err);
        setError('Failed to load route data');
      } finally {
        setLoading(false);
      }
    };

    loadRouteData();
  }, [route]);

  const handleDownload = async () => {
    if (!route.gpxFileUrl) {
      setError('No GPX file available for download');
      return;
    }

    try {
      setDownloading(true);
      const gpxContent = await fetchGPXContent(route.gpxFileUrl);
      const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${route.startLocation}_to_${route.endLocation}.gpx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading GPX file:', err);
      setError('Failed to download GPX file');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-900 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-lime-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to routes</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                   hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>{downloading ? 'Downloading...' : 'Download GPX'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {route.title && (
          <h1 className="text-2xl font-bold text-lime-500">{route.title}</h1>
        )}
        <FunScoreBadge score={funScore} />
      </div>

      <RouteStats
        {...stats}
        startLocation={route.startLocation}
        endLocation={route.endLocation}
        coordinates={coordinates}
      />

      <div className="relative h-[700px] bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        {coordinates.length > 0 && bounds.length === 2 && (
          <EnhancedMapContainer
            coordinates={coordinates}
            bounds={bounds}
            routeColor="#84cc16"
            routeWeight={4}
            routeOpacity={0.8}
          >
            <ScenicMarkers spots={scenicSpots} />
          </EnhancedMapContainer>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Elevation Profile</h3>
        <ElevationChart data={elevationData} />
      </div>

      <ElevationStats
        elevationGain={stats.elevationGain}
        elevationLoss={stats.elevationLoss}
        minElevation={stats.minElevation}
        maxElevation={stats.maxElevation}
      />
    </div>
  );
}