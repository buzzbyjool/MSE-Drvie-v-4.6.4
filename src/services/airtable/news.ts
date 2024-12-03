import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';

export const newsTable = base(AIRTABLE_CONFIG.tables.news);

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
  publicationDate: string;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const records = await newsTable
      .select({
        filterByFormula: "{Status} = 'Published'",
        sort: [{ field: 'date_publication', direction: 'desc' }],
        fields: ['Titre', 'Contenu', 'Image', 'date_publication']
      })
      .all();

    return records.map(record => ({
      id: record.id,
      title: record.get('Titre') as string,
      content: record.get('Contenu') as string,
      image: (record.get('Image') as any[])?.[0]?.url,
      publicationDate: record.get('date_publication') as string,
      date: record.get('date_publication') as string
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}