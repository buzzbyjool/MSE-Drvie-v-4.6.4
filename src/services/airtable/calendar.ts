import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';
import { Event } from '../../types/airtable';

export const calendarTable = base(AIRTABLE_CONFIG.tables.events);

export async function getCalendarEvents(): Promise<Event[]> {
  try {
    const records = await calendarTable
      .select({
        view: AIRTABLE_CONFIG.views.events,
        filterByFormula: "{Status} = 'Active'",
        sort: [{ field: 'Start Date', direction: 'asc' }],
        fields: ['Title', 'Description', 'Start Date', 'Status', 'Privacy']
      })
      .all();

    return records.map(record => ({
      id: record.id,
      title: record.get('Title') as string,
      description: record.get('Description') as string,
      startDate: record.get('Start Date') as string,
      status: record.get('Status') as Event['status'],
      privacy: record.get('Privacy') as Event['privacy']
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to load calendar events');
  }
}