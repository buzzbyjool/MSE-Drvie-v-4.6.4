import { base } from './base';
import { SupportRequest } from '../../types/support';

const supportTable = base('tbl4K3n92aEj62VEr');

export async function getSupportRequests(username: string, isAdmin: boolean): Promise<SupportRequest[]> {
  try {
    const filterFormula = isAdmin 
      ? "{Status} != ''" // Get all requests for admin
      : `{Username} = '${username.replace(/'/g, "\\'")}'`; // Get only user's requests

    const records = await supportTable
      .select({
        view: 'viwxPOcUuo91Mi16s',
        filterByFormula: filterFormula,
        sort: [{ field: 'Date creation', direction: 'desc' }]
      })
      .all();

    return records.map(record => ({
      id: record.id,
      username: record.get('Username') as string,
      title: record.get('Title') as string,
      problem: record.get('Problem') as string,
      answer: record.get('Answer') as string,
      status: record.get('Status') as SupportRequest['status'],
      dateCreation: record.get('Date creation') as string,
      dateModification: record.get('Date modification') as string
    }));
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw new Error('Failed to fetch support requests');
  }
}

export async function createSupportRequest(data: {
  username: string;
  title: string;
  problem: string;
}): Promise<void> {
  try {
    await supportTable.create([
      {
        fields: {
          Username: data.username,
          Title: data.title,
          Problem: data.problem,
          Status: 'Todo'
        }
      }
    ]);
  } catch (error) {
    console.error('Error creating support request:', error);
    throw new Error('Failed to create support request');
  }
}

export async function updateSupportRequest(
  requestId: string,
  data: Partial<{
    answer: string;
    status: SupportRequest['status'];
  }>
): Promise<void> {
  try {
    const fields: Record<string, any> = {};
    if (data.answer !== undefined) fields.Answer = data.answer;
    if (data.status !== undefined) fields.Status = data.status;

    await supportTable.update(requestId, fields);
  } catch (error) {
    console.error('Error updating support request:', error);
    throw new Error('Failed to update support request');
  }
}