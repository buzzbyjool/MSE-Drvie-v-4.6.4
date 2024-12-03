import { base } from '../services/airtable/base';
import { AIRTABLE_CONFIG } from '../config/airtable';
import { getNews } from '../services/airtable/news';
import { GPXRoute } from '../types/airtable';

// Initialize tables
export const usersTable = base(AIRTABLE_CONFIG.tables.users);
export const gpxTable = base(AIRTABLE_CONFIG.tables.gpx);
export const newsTable = base(AIRTABLE_CONFIG.tables.news);

export { getNews };

export async function getGPXRoutes(): Promise<GPXRoute[]> {
  try {
    const records = await gpxTable
      .select({
        fields: ['GPX File', 'Titre', 'Start', 'Arrival', 'Distance', 'Duration', 'Max Elevation', 'Status', 'User']
      })
      .all();

    return records.map(record => ({
      id: record.id,
      gpxFileUrl: (record.get('GPX File') as any[])?.[0]?.url,
      title: record.get('Titre') as string || '',
      startLocation: record.get('Start') as string || '',
      endLocation: record.get('Arrival') as string || '',
      distance: record.get('Distance') as string,
      duration: record.get('Duration') as string,
      maxElevation: record.get('Max Elevation') as string,
      status: record.get('Status') as GPXRoute['status'],
      user: record.get('User') as string
    }));
  } catch (error) {
    console.error('Error fetching GPX routes:', error);
    throw error;
  }
}

export async function fetchGPXContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch GPX file');
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching GPX file:', error);
    throw error;
  }
}