import { LatLngTuple } from 'leaflet';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const REQUEST_DELAY = 1000; // 1 second delay between requests

interface CacheEntry {
  data: LocationInfo;
  timestamp: number;
}

export interface LocationInfo {
  name: string;
  displayName: string;
}

const locationCache = new Map<string, CacheEntry>();
let lastRequestTime = 0;
let pendingRequests = new Map<string, Promise<LocationInfo>>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getCacheKey = ([lat, lon]: LatLngTuple): string => {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
};

const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_DURATION;
};

const formatLocationName = (address: any): string => {
  // First, try to get the most specific location name
  if (address.city) return address.city;
  if (address.town) return address.town;
  if (address.village) return address.village;
  if (address.municipality) return address.municipality;
  
  // If no specific city/town is found, try other components
  const components = [];
  
  if (address.suburb) components.push(address.suburb);
  else if (address.neighbourhood) components.push(address.neighbourhood);
  else if (address.road) components.push(address.road);
  
  // Add region info if available
  if (address.state && !components.some(c => c.includes(address.state))) {
    components.push(address.state);
  } else if (address.county && !components.some(c => c.includes(address.county))) {
    components.push(address.county);
  }
  
  // Add country as fallback
  if (components.length === 0 && address.country) {
    components.push(address.country);
  }
  
  return components.length > 0 
    ? components.join(', ')
    : 'Unknown Location';
};

export async function getLocationName(coords: LatLngTuple): Promise<LocationInfo> {
  const [lat, lon] = coords;
  const cacheKey = getCacheKey(coords);

  // Check cache first
  const cached = locationCache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    return cached.data;
  }

  // Check if there's already a pending request for this location
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const fetchLocation = async (): Promise<LocationInfo> => {
    try {
      // Ensure minimum delay between requests
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      if (timeSinceLastRequest < REQUEST_DELAY) {
        await delay(REQUEST_DELAY - timeSinceLastRequest);
      }

      const response = await fetch(
        `${NOMINATIM_API}/reverse?lat=${lat}&lon=${lon}&format=json&zoom=12`,
        {
          headers: {
            'User-Agent': 'GPX Route Viewer (https://stackblitz.com)'
          }
        }
      );
      
      lastRequestTime = Date.now();
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      const locationInfo: LocationInfo = {
        name: formatLocationName(data.address),
        displayName: data.display_name || 'Location details unavailable'
      };

      // Cache the result
      locationCache.set(cacheKey, {
        data: locationInfo,
        timestamp: Date.now()
      });
                   
      return locationInfo;
    } catch (error) {
      console.warn('Failed to fetch location name:', error);
      // Return a more user-friendly fallback
      return {
        name: 'Location unavailable',
        displayName: 'Location details unavailable'
      };
    } finally {
      // Clean up pending request
      pendingRequests.delete(cacheKey);
    }
  };

  // Store the promise in pending requests
  const locationPromise = fetchLocation();
  pendingRequests.set(cacheKey, locationPromise);
  
  return locationPromise;
}