import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

interface CloudinaryImageProps {
  publicId: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export default function CloudinaryImage({ 
  publicId, 
  width = 400, 
  height = 400, 
  className,
  alt 
}: CloudinaryImageProps) {
  // Extract public ID from URL if full URL is provided
  const id = publicId.includes('/')
    ? publicId.split('/').pop()?.split('.')[0]
    : publicId;

  if (!id) return null;

  const myImage = cld
    .image(id)
    .format(auto())
    .quality(autoQuality())
    .resize(fill().width(width).height(height).gravity(autoGravity()));

  return (
    <AdvancedImage 
      cldImg={myImage} 
      className={className} 
      alt={alt || 'Image'} 
    />
  );
}