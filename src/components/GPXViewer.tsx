import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import RouteCard from './RouteCard';
import RouteDetails from './RouteDetails';
import UploadGPXModal from './UploadGPXModal';
import { getGPXRoutes, GPXRoute } from '../utils/airtable';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { Plus } from 'lucide-react';

export default function GPXViewer() {
  const [routes, setRoutes] = useState<GPXRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<GPXRoute | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  const fetchRoutes = async () => {
    try {
      const fetchedRoutes = await getGPXRoutes();
      // Filter routes based on status, user role, and ownership
      const filteredRoutes = fetchedRoutes.filter(route => {
        // Always show active routes
        if (route.status === 'Active') return true;
        
        // Show pending routes only to admins and the route owner
        if (route.status === 'Pending') {
          return isAdmin() || route.user === user?.username;
        }
        
        // Never show inactive routes
        return false;
      });
      
      setRoutes(filteredRoutes);
      setError(null);
    } catch (err) {
      setError('Failed to load routes');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!selectedRoute ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-100">Roadtrips</h1>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black 
                         rounded-lg hover:bg-lime-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Route</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onClick={() => setSelectedRoute(route)}
                />
              ))}
            </div>

            {routes.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-400">No routes available</p>
              </div>
            )}
          </>
        ) : (
          <RouteDetails
            route={selectedRoute}
            onBack={() => setSelectedRoute(null)}
          />
        )}
      </main>

      {showUploadModal && (
        <UploadGPXModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={() => {
            setShowUploadModal(false);
            fetchRoutes();
          }}
        />
      )}
    </div>
  );
}