import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Map, Users, Newspaper, Calendar, Car, MessageSquare } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';
import { usersTable } from '../services/airtable/users';
import { useEffect, useState } from 'react';
import { getTimeBasedImage } from '../services/unsplash';
import { getTimeBasedGreeting } from '../utils/timeGreeting';

interface MenuItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  permission?: string;
}

function MenuItem({ title, description, icon: Icon, href, permission }: MenuItemProps) {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  if (permission && !hasPermission(permission)) {
    return null;
  }

  return (
    <div
      onClick={() => navigate(href)}
      className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 cursor-pointer 
                 transition-all duration-200 hover:bg-gray-700 hover:border-lime-500 
                 hover:shadow-lg hover:shadow-lime-500/10 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 p-3 rounded-lg border border-lime-500">
            <Icon className="h-6 w-6 text-lime-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-100">{title}</h3>
        </div>
        <p className="text-gray-400 flex-grow">{description}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [firstName, setFirstName] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageCredit, setImageCredit] = useState<{ name: string; link: string } | null>(null);
  const { user } = useAuth();
  const timeInfo = getTimeBasedGreeting();
  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    const loadBackgroundImage = async () => {
      const image = await getTimeBasedImage(timeInfo.timeOfDay);
      if (image) {
        setBackgroundImage(image.url);
        setImageCredit(image.credit);
      }
    };
    
    loadBackgroundImage();
    
    // Set up periodic refresh
    const intervalId = setInterval(loadBackgroundImage, REFRESH_INTERVAL);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [timeInfo.timeOfDay, REFRESH_INTERVAL]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.username) {
        try {
          const records = await usersTable
            .select({
              filterByFormula: `{Pseudo} = '${user.username}'`,
              fields: ['Prenom']
            })
            .firstPage();

          if (records.length > 0) {
            setFirstName(records[0].get('Prenom') as string);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const menuItems = [
    {
      title: "Roadtrips",
      description: "View and analyze roadtrip routes across different regions",
      icon: Map,
      href: "/viewer",
      permission: "view_routes"
    },
    {
      title: "Events",
      description: "Register and participate in upcoming driving events",
      icon: Car,
      href: "/events",
      permission: "view_routes"
    },
    {
      title: "Calendar",
      description: "Stay updated with upcoming events and activities in your region",
      icon: Calendar,
      href: "/calendar",
      permission: "view_routes"
    },
    {
      title: "Club News",
      description: "Read the latest news and announcements from the club",
      icon: Newspaper,
      href: "/news",
      permission: "view_routes"
    },
    {
      title: "Club Members",
      description: "Connect with fellow members and view member profiles",
      icon: Users,
      href: "/members",
      permission: "view_routes"
    },
    {
      title: "Support",
      description: "Get help and support from our administrators",
      icon: MessageSquare,
      href: "/support",
      permission: "view_routes"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="relative rounded-xl overflow-hidden">
            {backgroundImage && (
              <div className="absolute inset-0">
                <img
                  src={backgroundImage}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60" />
              </div>
            )}
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-400 mb-4">
                    {timeInfo.greeting}, {firstName}!
                  </h1>
                  <p className="text-xl text-gray-200">
                    Welcome to the MSE Drive Community. Your gateway to exciting roadtrips and adventures.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-lime-500">
                    @{user?.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </div>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                href={item.href}
                permission={item.permission}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}