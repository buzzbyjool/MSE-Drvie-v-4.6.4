import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';
import { Event } from '../../types/events';

const eventsTable = base('tbl5w2gKaZxGe5irV');

export async function getEvents(): Promise<Event[]> {
  try {
    const records = await eventsTable
      .select({
        view: 'viwUHSsutlSuz6JaE',
        filterByFormula: "{Status} = 'Active'",
        sort: [{ field: 'Start Date', direction: 'asc' }]
      })
      .all();

    return records.map(record => {
      // Get RegisteredUsers as string and convert to array
      const registeredUsersString = record.get('RegisteredUsers') as string || '';
      const registered = registeredUsersString
        .split(',')
        .filter(username => username.trim().length > 0);

      return {
        id: record.id,
        name: record.get('Name') as string,
        description: record.get('Description') as string,
        image: (record.get('Image') as any[])?.[0]?.url,
        status: record.get('Status') as Event['status'],
        startDate: record.get('Start Date') as string,
        endDate: record.get('End Date') as string,
        price: record.get('Price') as number,
        registered,
        maxCars: record.get('Cars') as number,
        reservedCount: record.get('Reserved') as number || 0
      };
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
}

export async function registerForEvent(eventId: string, username: string): Promise<void> {
  try {
    // First, get the current event data
    const event = await eventsTable.find(eventId);
    const currentReserved = event.get('Reserved') as number || 0;
    const maxCars = event.get('Cars') as number;
    const registeredUsersString = event.get('RegisteredUsers') as string || '';
    const registeredUsers = registeredUsersString
      .split(',')
      .filter(user => user.trim().length > 0);
    
    // Check if already registered
    if (registeredUsers.includes(username)) {
      throw new Error('Already registered for this event');
    }
    
    // Check if event is full
    if (currentReserved >= maxCars) {
      throw new Error('Event is full');
    }

    // Add new user and update counts
    registeredUsers.push(username);
    await eventsTable.update(eventId, {
      'Reserved': currentReserved + 1,
      'RegisteredUsers': registeredUsers.join(',')
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error instanceof Error ? error : new Error('Failed to register for event');
  }
}

export async function unregisterFromEvent(eventId: string, username: string): Promise<void> {
  try {
    const event = await eventsTable.find(eventId);
    const currentReserved = event.get('Reserved') as number || 0;
    const registeredUsersString = event.get('RegisteredUsers') as string || '';
    const registeredUsers = registeredUsersString
      .split(',')
      .filter(user => user.trim().length > 0);
    
    if (!registeredUsers.includes(username)) {
      throw new Error('Not registered for this event');
    }

    // Remove user and update counts
    const updatedUsers = registeredUsers.filter(user => user !== username);
    await eventsTable.update(eventId, {
      'Reserved': Math.max(0, currentReserved - 1),
      'RegisteredUsers': updatedUsers.join(',')
    });
  } catch (error) {
    console.error('Error unregistering from event:', error);
    throw error instanceof Error ? error : new Error('Failed to unregister from event');
  }
}