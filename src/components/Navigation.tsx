import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { Map, Users, LogOut, LayoutDashboard, Menu, X, Newspaper, Calendar, Car, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getUXImage } from '../services/airtable/uxImages';

export default function Navigation() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mseLogo, setMseLogo] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await getUXImage('logo_mse');
        setMseLogo(logoUrl);
      } catch (error) {
        console.error('Error loading MSE logo:', error);
      }
    };
    loadLogo();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'view_routes' },
    { name: 'Roadtrips', href: '/viewer', icon: Map, permission: 'view_routes' },
    { name: 'Events', href: '/events', icon: Car, permission: 'view_routes' },
    { name: 'News', href: '/news', icon: Newspaper, permission: 'view_routes' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, permission: 'view_routes' },
    { name: 'Members', href: '/members', icon: Users, permission: 'view_routes' },
    { name: 'Support', href: '/support', icon: MessageSquare, permission: 'view_routes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const filteredNavigation = navigation.filter(item => 
    !item.permission || usePermissions().hasPermission(item.permission)
  );

  const NavLinks = () => (
    <>
      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              isActive(item.href)
                ? 'bg-gray-900 text-lime-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-lime-500'
            } w-full px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 
            transition-colors duration-200`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-gray-800 border-b border-gray-700 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a 
                href="https://msegt.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity"
              >
                {mseLogo ? (
                  <img
                    src={mseLogo}
                    alt="MSE Drivers Club"
                    className="h-8 w-auto"
                    onError={(e) => {
                      console.error('Error loading MSE logo:', e);
                      const img = e.target as HTMLImageElement;
                      console.log('Failed URL:', img.src);
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
                )}
              </a>
            </div>
            <div className="hidden md:flex md:ml-10 md:space-x-1">
              <NavLinks />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                       text-gray-300 hover:bg-gray-700 hover:text-lime-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                       hover:text-lime-500 hover:bg-gray-700 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute w-full bg-gray-800 shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLinks />
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="px-2 space-y-1">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                       text-gray-300 hover:bg-gray-700 hover:text-lime-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}