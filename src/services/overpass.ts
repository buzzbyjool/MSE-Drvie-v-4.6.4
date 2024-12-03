import { LatLngTuple } from 'leaflet';

interface OverpassResult {
  coordinates: LatLngTuple;
  tags: Record<string, string>;
}

export async function findScenicViewpoints(bounds: LatLngTuple[]): Promise<OverpassResult[]> {
  const [[south, west], [north, east]] = bounds;
  
  const query = `
    [out:json][timeout:25];
    (
      way["tourism"="viewpoint"](${south},${west},${north},${east});
      node["tourism"="viewpoint"](${south},${west},${north},${east});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch viewpoints');
    }

    const data = await response.json();
    
    return data.elements
      .filter((element: any) => element.lat && element.lon)
      .map((element: any) => ({
        coordinates: [element.lat, element.lon] as LatLngTuple,
        tags: element.tags || {}
      }));
  } catch (error) {
    console.error('Error fetching viewpoints:', error);
    return [];
  }
}