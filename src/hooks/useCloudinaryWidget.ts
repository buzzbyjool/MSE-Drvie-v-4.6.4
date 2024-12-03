import { useCallback } from 'react';

interface CloudinaryUploadOptions {
  resourceType?: 'image' | 'raw';
  folder?: string;
  maxFileSize?: number;
  allowedFormats?: string[];
}

export function useCloudinaryWidget() {
  const openWidget = useCallback((
    onSuccess: (url: string) => void,
    onError: (error: string) => void,
    options: CloudinaryUploadOptions = {}
  ) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'dgqbkdow9',
        apiKey: '377418814742843',
        folder: 'msedrive',
        resourceType: options.resourceType || 'image',
        maxFileSize: options.maxFileSize || 5 * 1024 * 1024,
        allowedFormats: options.allowedFormats,
        sources: ['local'],
        multiple: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#1f2937',
            windowBorder: '#374151',
            tabIcon: '#84cc16',
            menuIcons: '#84cc16',
            textDark: '#1f2937',
            textLight: '#FFFFFF',
            link: '#84cc16',
            action: '#84cc16',
            inactiveTabIcon: '#4b5563',
            error: '#ef4444',
            inProgress: '#84cc16',
            complete: '#84cc16',
            sourceBg: '#1f2937'
          }
        }
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          onError(error.message || 'Upload failed');
          return;
        }

        if (result.event === 'success') {
          onSuccess(result.info.secure_url);
        }
      }
    );

    widget.open();
  }, []);

  return { openWidget };
}