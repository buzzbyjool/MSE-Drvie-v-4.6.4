export const AIRTABLE_CONFIG = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  tables: {
    users: 'tblQu73j2SHRHRD4U',    // Users/Members table
    gpx: 'tblC38k8MBfuK7vie',      // GPX/Roadtrips table
    news: 'tblF3pAYOU9DJcQ1W',     // News table
    events: 'tblVYpIT6dYBW6FJn',   // Events table
    uxImages: 'tblMXiz5aqafoLdu6'  // UX Images table
  },
  views: {
    users: 'viwWIdOfp4BcEzsy4',
    events: 'viw2atAovuBUdgDmD',
    uxImages: 'viwQkLh5Qb79AvX7I'
  }
} as const;