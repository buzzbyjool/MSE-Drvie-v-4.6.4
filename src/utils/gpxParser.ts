import { LatLngTuple } from 'leaflet';
import { gpx } from '@tmcw/togeojson';

interface ParsedGPX {
  coordinates: LatLngTuple[];
  bounds: LatLngTuple[];
  stats: {
    distance: number;
    elevation: number;
    duration: number;
    elevationGain: number;
    elevationLoss: number;
    minElevation: number;
    maxElevation: number;
  };
  elevationData: Array<{
    distance: number;
    elevation: number;
    coordinates: LatLngTuple;
    isCheckpoint?: boolean;
    checkpointIndex?: number;
  }>;
}

export const parseGPX = async (input: File | Blob | string): Promise<ParsedGPX> => {
  try {
    let gpxContent: string;
    if (typeof input === 'string') {
      gpxContent = input;
    } else {
      gpxContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(input);
      });
    }

    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxContent, 'text/xml');
    
    if (!gpxDoc.querySelector('gpx')) {
      throw new Error('Invalid GPX file format');
    }

    const geoJson = gpx(gpxDoc);
    
    if (!geoJson.features.length) {
      throw new Error('No track data found in GPX file');
    }

    const track = geoJson.features[0];
    if (!track.geometry || track.geometry.type !== 'LineString') {
      throw new Error('Invalid track data in GPX file');
    }

    const coordinates: LatLngTuple[] = track.geometry.coordinates.map(
      ([lon, lat, ele]) => [lat, lon] as LatLngTuple
    );

    if (!coordinates.length) {
      throw new Error('No coordinates found in GPX file');
    }

    let minLat = coordinates[0][0];
    let maxLat = coordinates[0][0];
    let minLon = coordinates[0][1];
    let maxLon = coordinates[0][1];
    let minElevation = track.geometry.coordinates[0][2] || 0;
    let maxElevation = track.geometry.coordinates[0][2] || 0;
    let elevationGain = 0;
    let elevationLoss = 0;

    coordinates.forEach(([lat, lon], index) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);

      const elevation = track.geometry.coordinates[index][2] || 0;
      minElevation = Math.min(minElevation, elevation);
      maxElevation = Math.max(maxElevation, elevation);

      // Calculate elevation gain/loss
      if (index > 0) {
        const prevElevation = track.geometry.coordinates[index - 1][2] || 0;
        const elevationDiff = elevation - prevElevation;
        if (elevationDiff > 0) {
          elevationGain += elevationDiff;
        } else {
          elevationLoss += Math.abs(elevationDiff);
        }
      }
    });

    const bounds: LatLngTuple[] = [
      [minLat, minLon],
      [maxLat, maxLon]
    ];

    let totalDistance = 0;
    const elevationData: Array<{
      distance: number;
      elevation: number;
      coordinates: LatLngTuple;
      isCheckpoint?: boolean;
      checkpointIndex?: number;
    }> = [];

    // Calculate checkpoint indices
    const checkpointIndices = [
      0, // Start point
      Math.floor(coordinates.length * 0.25),
      Math.floor(coordinates.length * 0.5),
      Math.floor(coordinates.length * 0.75),
      coordinates.length - 1 // End point
    ];

    coordinates.forEach((coord, index) => {
      if (index > 0) {
        const [lat1, lon1] = coordinates[index - 1];
        const [lat2, lon2] = coord;

        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        totalDistance += distance;
      }

      // Add point to elevation data
      const checkpointIdx = checkpointIndices.indexOf(index);
      elevationData.push({
        distance: totalDistance,
        elevation: track.geometry.coordinates[index][2] || 0,
        coordinates: coord,
        isCheckpoint: checkpointIdx !== -1,
        checkpointIndex: checkpointIdx !== -1 ? checkpointIdx : undefined
      });
    });

    // Calculate duration based on average speed (80 km/h)
    const averageSpeed = 80; // km/h
    const estimatedDuration = (totalDistance / averageSpeed) * 3600 * 1.1; // Add 10% for stops

    return {
      coordinates,
      bounds,
      stats: {
        distance: totalDistance,
        elevation: maxElevation - minElevation,
        duration: estimatedDuration,
        elevationGain,
        elevationLoss,
        minElevation,
        maxElevation
      },
      elevationData
    };
  } catch (error) {
    console.error('Error parsing GPX:', error);
    throw new Error(`Failed to parse GPX file: ${(error as Error).message}`);
  }
};