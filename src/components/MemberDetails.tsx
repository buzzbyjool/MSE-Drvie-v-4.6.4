import { ArrowLeft, User, Mail, Phone, MapPin, Home, UserCircle, Crown, AtSign, Edit2, Car, CreditCard } from 'lucide-react';
import { Region } from '../types/airtable';
import Navigation from './Navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import { getTimeBasedImage } from '../services/unsplash';

interface MemberDetailsProps {
  member: {
    id: string;
    Avatar?: string;
    Nom: string;
    Prenom: string;
    Pseudo: string;
    Region: Region;
    Rang: string;
    Email?: string;
    Telephone?: string;
    Address?: string;
    Grade?: string;
    CarModel?: string;
    Abonnement?: 'Active' | 'Pending' | 'Unpaid';
    Car_number?: string;
  };
  onBack: () => void;
  onUpdate: (updatedData: Partial<MemberDetailsProps['member']>) => Promise<void>;
}

const REGION_LABELS: Record<Region, string> = {
  'France-Nord': 'Northern France',
  'France-Sud': 'Southern France',
  'France-Est': 'Eastern France',
  'France-Ouest': 'Western France',
  'Luxembourg': 'Luxembourg',
  'Belgique': 'Belgium',
  'Andorre': 'Andorra'
};

export default function MemberDetails({ member, onBack, onUpdate }: MemberDetailsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mseLogo, setMseLogo] = useState<string | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [imageCredit, setImageCredit] = useState<{ name: string; link: string } | null>(null);
  const { user } = useAuth();
  const isOwnProfile = user?.username === member.Pseudo;
  const canViewSubscription = isOwnProfile || user?.role === 'Administrateur';

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Use a specific mountain road image for member profiles
        setHeaderImage('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80');
        setImageCredit({
          name: 'Benjamin Voros',
          link: 'https://unsplash.com/@vorosbenisop'
        });
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    loadImages();
  }, []);

  const handleUpdateProfile = async (updatedData: Partial<MemberDetailsProps['member']>) => {
    try {
      await onUpdate(updatedData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-lime-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to members</span>
          </button>

          <div className="flex items-center space-x-4">
            {canViewSubscription && member.Abonnement && (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                member.Abonnement === 'Active' ? 'bg-green-500/20 text-green-300' :
                member.Abonnement === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">{member.Abonnement}</span>
              </div>
            )}

            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="relative">
            <div className="h-48 relative">
              {headerImage && (
                <div className="absolute inset-0">
                  <img
                    src={headerImage}
                    alt="Profile background"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
                </div>
              )}
              {!headerImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
              )}
              {imageCredit && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Photo by{' '}
                  <a
                    href={imageCredit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-500 hover:text-lime-400"
                  >
                    {imageCredit.name}
                  </a>
                  {' '}on Unsplash
                </div>
              )}
            </div>
            <div className="absolute -bottom-16 left-8">
              {member.Avatar ? (
                <div className="relative">
                <img
                  src={member.Avatar}
                  alt={`${member.Prenom} ${member.Nom}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-xl"
                />
                  {member.Car_number && (
                    <div className="absolute -right-4 -bottom-4 w-14 h-14 rounded-full flex items-center justify-center border-2 border-lime-500 bg-gray-800 overflow-hidden">
                      <img
                        src={mseLogo || ''}
                        alt="MSE Logo"
                        className="absolute inset-0 w-full h-full object-contain opacity-20"
                      />
                      <span className="relative text-lime-500 text-xl font-bold">
                        {member.Car_number}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-800">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <UserCircle className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="text-lg text-gray-100">{member.Prenom} {member.Nom}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <AtSign className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Username</p>
                      <p className="text-lg text-gray-100">{member.Pseudo}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <Crown className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <p className="text-lg text-gray-100">{member.Rang}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Region</p>
                      <p className="text-lg text-gray-100">{REGION_LABELS[member.Region]}</p>
                    </div>
                  </div>

                  {member.CarModel && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-700 p-2 rounded-lg">
                        <Car className="w-5 h-5 text-lime-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Car Model</p>
                        <p className="text-lg text-gray-100">{member.CarModel}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      {member.Email ? (
                        <a
                          href={`mailto:${member.Email}`}
                          className="text-lg text-lime-500 hover:text-lime-400"
                        >
                          {member.Email}
                        </a>
                      ) : (
                        <p className="text-lg text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <Phone className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      {member.Telephone ? (
                        <a
                          href={`tel:${member.Telephone}`}
                          className="text-lg text-lime-500 hover:text-lime-400"
                        >
                          {member.Telephone}
                        </a>
                      ) : (
                        <p className="text-lg text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <Home className="w-5 h-5 text-lime-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      {member.Address ? (
                        <p className="text-lg text-gray-100">{member.Address}</p>
                      ) : (
                        <p className="text-lg text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {member.Grade && (
              <div className="mt-8">
                <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Member Grade</h2>
                <img
                  src={member.Grade}
                  alt="Member Grade"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-lime-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          member={member}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
}