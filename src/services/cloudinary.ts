import axios from 'axios';

const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'ujgjhwlg', // Unsigned upload preset specifically for GPX files
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY
};

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    resourceType?: 'image' | 'raw' | 'auto';
  } = {}
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    const resourceType = options.resourceType || 'auto';
    const response = await axios.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
      formData
    );

    if (!response.data?.secure_url) {
      throw new Error('Failed to get secure URL from Cloudinary');
    }

    return response.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      console.error('Upload error details:', error.response);
      throw new Error(error.response.data.error?.message || 'Upload failed');
    }
    throw new Error('Upload failed');
  }
}