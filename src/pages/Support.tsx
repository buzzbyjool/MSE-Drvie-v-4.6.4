import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import SupportRequest from '../components/SupportRequest';
import CreateSupportRequest from '../components/CreateSupportRequest';
import { useAuth } from '../context/AuthContext';
import { getSupportRequests } from '../services/airtable/support';
import { SupportRequest as SupportRequestType } from '../types/support';
import { MessageSquare, Plus } from 'lucide-react';

export default function Support() {
  const [requests, setRequests] = useState<SupportRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrateur';

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedRequests = await getSupportRequests(user.username, isAdmin);
      setRequests(fetchedRequests);
      setError(null);
    } catch (err) {
      setError('Failed to load support requests');
      console.error('Error fetching support requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user, isAdmin]);

  const handleRequestUpdate = (updatedRequest: SupportRequestType) => {
    setRequests(requests.map(request =>
      request.id === updatedRequest.id ? updatedRequest : request
    ));
  };

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
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-lime-500" />
              <h1 className="text-2xl font-bold text-gray-100">Support Requests</h1>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                         hover:bg-lime-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Request</span>
              </button>
            )}
          </div>
          <p className="text-gray-400">
            {isAdmin 
              ? "Here is a list of request from users"
              : "You can send bug, idea or any request to our Admins, they will review and answer."}
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {requests.map((request) => (
            <SupportRequest
              key={request.id}
              request={request}
              onUpdate={handleRequestUpdate}
            />
          ))}

          {requests.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-400">No support requests available</p>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateSupportRequest
          onClose={() => setShowCreateModal(false)}
          onRequestCreated={fetchRequests}
        />
      )}
    </div>
  );
}