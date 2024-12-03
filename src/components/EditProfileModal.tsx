import { useState, useEffect } from 'react';
import { X, Upload, Car } from 'lucide-react';
import { Region } from '../types/airtable';
import { uploadAvatar } from '../services/cloudinary/avatarService';
import { checkCarNumberAvailability } from '../services/airtable/users';

interface EditProfileModalProps {
  member: {
    Email?: string;
    Telephone?: string;
    Address?: string;
    Region: Region;
    CarModel?: string;
    Car_number?: string;
  };
  onClose: () => void;
  onUpdate: (data: Partial<EditProfileModalProps['member']>) => Promise<void>;
}

const REGION_OPTIONS: Region[] = [
  'France-Nord',
  'France-Sud',
  'France-Est',
  'France-Ouest',
  'Luxembourg',
  'Belgique',
  'Andorre'
];

export default function EditProfileModal({ member, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    Email: member.Email || '',
    Telephone: member.Telephone || '',
    Address: member.Address || '',
    Region: member.Region,
    CarModel: member.CarModel || '',
    Car_number: member.Car_number || '',
    Avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [carNumberError, setCarNumberError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarFile(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleCarNumberChange = async (value: string) => {
    setCarNumberError(null);
    
    // Validate that input is a number
    if (value && !/^\d+$/.test(value)) {
      setCarNumberError('Car number must be a number');
      return;
    }

    setFormData({ ...formData, Car_number: value });
    
    if (value && value !== member.Car_number) {
      try {
        const isAvailable = await checkCarNumberAvailability(value, member.id);
        if (!isAvailable) {
          setCarNumberError('This car number is already taken');
        }
      } catch (error) {
        setCarNumberError('Error checking car number availability');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);

    if (carNumberError) {
      setError('Please fix the car number error before submitting');
      setIsSubmitting(false);
      return;
    }

    try {
      let updatedData = { ...formData };

      if (avatarFile) {
        try {
          setUploadProgress(25);
          const cloudinaryUrl = await uploadAvatar(avatarFile);
          setUploadProgress(75);
          updatedData.Avatar = cloudinaryUrl;
        } catch (uploadError) {
          throw new Error(uploadError instanceof Error ? uploadError.message : 'Failed to upload profile picture');
        }
      }

      await onUpdate(updatedData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-100 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="space-y-4">
              {avatarPreview && (
                <div className="flex justify-center">
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-lime-500"
                  />
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700 
                         border-2 border-gray-600 border-dashed rounded-lg appearance-none 
                         cursor-pointer hover:border-lime-500 focus:outline-none"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-lime-500" />
                  <span className="text-sm text-gray-400">
                    {avatarFile ? 'Change profile picture' : 'Click to upload profile picture'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Max size: 5MB
                  </span>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {!member.Car_number && (
            <div>
              <label htmlFor="carNumber" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-lime-500" />
                  <span>Car Number</span>
                </div>
              </label>
              <input
                type="text"
                id="carNumber"
                value={formData.Car_number}
                pattern="\d*"
                onChange={(e) => handleCarNumberChange(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-gray-100 
                         focus:outline-none focus:border-lime-500 ${
                           carNumberError ? 'border-red-500' : 'border-gray-600'
                         }`}
                placeholder="Enter your car number (numbers only)"
              />
              {carNumberError && (
                <p className="mt-1 text-sm text-red-400">{carNumberError}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="carModel" className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-lime-500" />
                <span>Car Model</span>
              </div>
            </label>
            <input
              type="text"
              id="carModel"
              value={formData.CarModel}
              onChange={(e) => setFormData({ ...formData, CarModel: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              placeholder="Enter your car model"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.Telephone}
              onChange={(e) => setFormData({ ...formData, Telephone: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.Address}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">
              Region
            </label>
            <select
              id="region"
              value={formData.Region}
              onChange={(e) => setFormData({ ...formData, Region: e.target.value as Region })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
            >
              {REGION_OPTIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-400 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}