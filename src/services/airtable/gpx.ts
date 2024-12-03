import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';

export const gpxTable = base(AIRTABLE_CONFIG.tables.gpx);

export interface GPXRoute {
  id: string;
  gpxFileUrl?: string;
  title: string;
  startLocation: string;
  endLocation: string;
  distance?: string;
  duration?: string;
  maxElevation?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  user: string;
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
    throw error instanceof Error ? error : new Error('Failed to fetch GPX file');
  }
}

export async function getGPXRoutes(): Promise<GPXRoute[]> {
  try {
    const records = await gpxTable
      .select({
        view: 'viw2XpwEvOfW7Rwr3',
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
    throw error instanceof Error ? error : new Error('Failed to fetch GPX routes');
  }
}

export async function createGPXRoute(data: {
  gpxFileUrl: string;
  title: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  duration: string;
  maxElevation: string;
  user: string;
}): Promise<void> {
  try {
    await gpxTable.create([
      {
        fields: {
          'GPX File': [{ url: data.gpxFileUrl }],
          'Titre': data.title,
          'Start': data.startLocation,
          'Arrival': data.endLocation,
          'Distance': data.distance,
          'Duration': data.duration,
          'Max Elevation': data.maxElevation,
          'Status': 'Pending',
          'User': data.user
        }
      }
    ]);
  } catch (error) {
    console.error('Error creating GPX route:', error);
    throw new Error('Failed to save route to database');
  }
}