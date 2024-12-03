import { uploadToCloudinary } from '../cloudinary';

export async function uploadAvatar(file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    return await uploadToCloudinary(file, {
      resourceType: 'image',
      folder: 'msedrive/avatars'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error instanceof Error ? error : new Error('Failed to upload avatar');
  }
}