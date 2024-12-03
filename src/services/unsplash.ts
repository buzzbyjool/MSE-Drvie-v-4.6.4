const CACHE_PREFIX = 'unsplash_cache_';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// Static fallback images
const FALLBACK_IMAGES = {
  morning: [
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366', // Mountain sunrise
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Lake view
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7', // Sports car
  ],
  afternoon: [
    'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf', // Mountain road
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', // Lake view
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70', // Sports car
  ],
  evening: [
    'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35', // Mountain sunset
    'https://images.unsplash.com/photo-1511516412963-801b050c92aa', // Lake view
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a', // Sports car
  ],
  night: [
    'https://images.unsplash.com/photo-1494905998402-395d579af36f', // Mountain night
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6', // Lake view
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888', // Sports car
  ]
} as const;

interface CachedImage {
  data: UnsplashImage;
  timestamp: number;
}

interface UnsplashImage {
  url: string;
  credit: {
    name: string;
    link: string;
  };
}

function getFallbackImage(timeOfDay: keyof typeof FALLBACK_IMAGES): UnsplashImage {
  // Get the current rotation index from cache
  const rotationKey = `${CACHE_PREFIX}rotation_${timeOfDay}`;
  let currentIndex = parseInt(localStorage.getItem(rotationKey) || '0');
  
  // Get the images array for the current time of day
  const images = FALLBACK_IMAGES[timeOfDay];
  
  // Get the current image URL
  const imageUrl = images[currentIndex];
  
  // Update rotation index for next time
  currentIndex = (currentIndex + 1) % images.length;
  localStorage.setItem(rotationKey, currentIndex.toString());
  
  return {
    url: `${imageUrl}?auto=format&fit=crop&w=1920&q=80`,
    credit: {
      name: 'Unsplash Community',
      link: 'https://unsplash.com/backgrounds/nature/mountain'
    }
  };
}

export async function getTimeBasedImage(timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): Promise<UnsplashImage | null> {
  // Check cache first
  const cacheKey = `${CACHE_PREFIX}${timeOfDay}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const parsedCache = JSON.parse(cached) as CachedImage;
    const isValid = Date.now() - parsedCache.timestamp < CACHE_DURATION;
    
    // Return cached image if it's still valid
    if (isValid) { 
      return parsedCache.data;
    } else {
      // Clear expired cache
      localStorage.removeItem(cacheKey);
    }
  }

  // Get fallback image and cache it
  const fallbackImage = getFallbackImage(timeOfDay);
  
  // Cache the new image
  localStorage.setItem(cacheKey, JSON.stringify({
    data: fallbackImage,
    timestamp: Date.now()
  }));
  
  return fallbackImage;
}