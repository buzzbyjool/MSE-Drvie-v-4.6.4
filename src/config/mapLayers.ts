const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const MAP_LAYERS = {
  streets: {
    light: {
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
      name: 'Streets'
    },
    dark: {
      url: `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
      name: 'Streets'
    }
  },
  satellite: {
    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    name: 'Satellite'
  }
} as const;

export const DEFAULT_CENTER: [number, number] = [46.227638, 2.213749]; // Center of France
export const DEFAULT_ZOOM = 6;