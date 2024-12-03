import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../../config/airtable';

// Configure Airtable with API key
Airtable.configure({
  apiKey: AIRTABLE_CONFIG.apiKey
});

// Initialize and export base
export const base = Airtable.base(AIRTABLE_CONFIG.baseId);