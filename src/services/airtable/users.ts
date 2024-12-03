import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';
import { MobileUser, Region } from '../../types/airtable';

export const usersTable = base(AIRTABLE_CONFIG.tables.users);

export interface MemberInfo {
  username: string;
  firstName: string;
  lastName: string;
  carModel?: string;
}

export interface ProfileUpdateData {
  Email?: string | null;
  Telephone?: string | null;
  Address?: string | null;
  Region?: Region;
  Avatar?: string;
  Car_number?: string | null;
}

export async function checkCarNumberAvailability(carNumber: string, userId: string): Promise<boolean> {
  try {
    const numericCarNumber = parseInt(carNumber);
    if (isNaN(numericCarNumber)) {
      throw new Error('Car number must be a valid number');
    }

    const records = await usersTable
      .select({
        filterByFormula: `AND({Car_number} = ${numericCarNumber}, NOT({ID} = '${userId}'))`
      })
      .firstPage();
    
    return records.length === 0;
  } catch (error) {
    console.error('Error checking car number availability:', error);
    throw new Error('Failed to check car number availability');
  }
}

export async function validateUser(username: string, password: string): Promise<MobileUser | null> {
  try {
    const escapedUsername = username.replace(/'/g, "\\'");
    const escapedPassword = password.replace(/'/g, "\\'");

    const records = await usersTable
      .select({
        filterByFormula: `AND(
          {Pseudo} = '${escapedUsername}',
          {Password} = '${escapedPassword}',
          {Status} = 'Active'
        )`,
        maxRecords: 1,
        view: AIRTABLE_CONFIG.views.users
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    const record = records[0];
    return {
      id: record.id,
      username: record.get('Pseudo') as string,
      role: record.get('Rang') as MobileUser['role'],
      region: record.get('Region') as Region,
      status: record.get('Status') as MobileUser['status']
    };
  } catch (error) {
    console.error('Error validating user:', error);
    throw new Error('Failed to validate user credentials');
  }
}

export async function getMembersInfo(usernames: string[]): Promise<MemberInfo[]> {
  try {
    if (usernames.length === 0) return [];

    const formula = `OR(${usernames.map(username => 
      `{Pseudo} = '${username.replace(/'/g, "\\'")}'`
    ).join(',')})`;

    const records = await usersTable
      .select({
        filterByFormula: formula,
        fields: ['Pseudo', 'Prenom', 'Nom', 'CarModel']
      })
      .all();

    return records.map(record => ({
      username: record.get('Pseudo') as string,
      firstName: record.get('Prenom') as string,
      lastName: record.get('Nom') as string,
      carModel: record.get('CarModel') as string
    }));
  } catch (error) {
    console.error('Error fetching members info:', error);
    throw new Error('Failed to fetch members information');
  }
}

export async function updateUserProfile(userId: string, data: ProfileUpdateData): Promise<void> {
  try {
    const fields: Record<string, any> = {};

    if ('Email' in data) fields.Email = data.Email;
    if ('Telephone' in data) fields.Telephone = data.Telephone;
    if ('Address' in data) fields.Address = data.Address;
    if ('Region' in data) fields.Region = data.Region;
    if ('Avatar' in data && data.Avatar) {
      fields.Avatar = [{
        url: data.Avatar
      }];
    }
    if ('Car_number' in data && data.Car_number) {
      const numericCarNumber = parseInt(data.Car_number);
      if (isNaN(numericCarNumber)) {
        throw new Error('Car number must be a valid number');
      }
      fields.Car_number = numericCarNumber;
    }
    if ('CarModel' in data) fields.CarModel = data.CarModel;

    await usersTable.update(userId, fields);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}