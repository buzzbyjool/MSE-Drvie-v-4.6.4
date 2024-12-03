import { base } from './base';
import { AIRTABLE_CONFIG } from '../../config/airtable';

const uxImagesTable = base(AIRTABLE_CONFIG.tables.uxImages);

export async function getUXImage(name: string): Promise<string | null> {
  try {
    const records = await uxImagesTable
      .select({
        view: AIRTABLE_CONFIG.views.uxImages,
        filterByFormula: `AND({Name} = '${name.replace(/'/g, "\\'")}', {Status} = 'Active')`,
        fields: ['Name', 'Media', 'Status']
      })
      .firstPage();

    if (records.length === 0) {
      console.warn(`No image found with name: ${name}`);
      return null;
    }

    const record = records[0];
    const mediaField = record.get('Media');

    if (!mediaField || !Array.isArray(mediaField) || mediaField.length === 0) {
      console.warn(`No media found for image: ${name}`);
      return null;
    }

    return mediaField[0].url;
  } catch (error) {
    console.error('Error fetching UX image:', error);
    return null;
  }
}