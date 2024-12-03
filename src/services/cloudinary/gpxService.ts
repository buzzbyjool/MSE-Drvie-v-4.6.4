import { uploadToCloudinary } from '../cloudinary';

export async function uploadGPXFile(file: File): Promise<string> {
  try {
    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      throw new Error('Invalid file type. Please upload a GPX file.');
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    return await uploadToCloudinary(file, {
      resourceType: 'raw',
      folder: 'msedrive/gpx'
    });
  } catch (error) {
    console.error('Error uploading GPX file:', error);
    throw error instanceof Error ? error : new Error('Failed to upload GPX file');
  }
}