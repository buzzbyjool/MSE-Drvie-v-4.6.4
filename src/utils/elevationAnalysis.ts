import { LatLngTuple } from 'leaflet';

export interface ElevationPoint {
  coordinates: LatLngTuple;
  elevation: number;
  distance: number;
}

export interface ScenicSpot {
  coordinates: LatLngTuple;
  elevation: number;
  description: string;
  ranking: number;
}

export function analyzeScenicSpots(elevationData: ElevationPoint[]): ScenicSpot[] {
  if (elevationData.length === 0) return [];

  const totalDistance = elevationData[elevationData.length - 1].distance;
  const sectionSize = totalDistance / 4; // Divide route into 4 sections to find 3 spots

  // Initialize sections
  const sections = [
    { start: sectionSize, end: sectionSize * 2 },     // First third
    { start: sectionSize * 2, end: sectionSize * 3 }, // Middle third
    { start: sectionSize * 3, end: totalDistance }    // Final third
  ];

  // Find highest points in each section
  const spots = sections.map((section, index) => {
    const sectionPoints = elevationData.filter(
      point => point.distance >= section.start && point.distance <= section.end
    );

    // Find highest elevation point in this section
    const highestPoint = sectionPoints.reduce((max, point) => 
      point.elevation > max.elevation ? point : max
    , sectionPoints[0]);

    return {
      coordinates: highestPoint.coordinates,
      elevation: highestPoint.elevation,
      description: `Peak ${index + 1} - ${Math.round(highestPoint.elevation)}m`,
      ranking: index + 1
    };
  });

  return spots;
}