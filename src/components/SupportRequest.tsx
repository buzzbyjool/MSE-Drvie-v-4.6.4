import { useState } from 'react';
import { MessageSquare, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { SupportRequest as SupportRequestType } from '../types/support';
import { useAuth } from '../context/AuthContext';
import { updateSupportRequest } from '../services/airtable/support';

interface SupportRequestProps {
  request: SupportRequestType;
  onUpdate: (updatedRequest: SupportRequestType) => void;
}

export default function SupportRequest({ request, onUpdate }: SupportRequestProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState(request.answer || '');
  const [status, setStatus] = useState(request.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'Administrateur';
  const isOwner = user?.username === request.username;
  const canEditStatus = isAdmin || (isOwner && request.status === 'Done');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status: SupportRequestType['status']) => {
    switch (status) {
      case 'Todo': return 'Todo';
      case 'InProgress': return 'In Progress';
      case 'Done': return 'Done';
      default: return status;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updates: Partial<{ answer: string; status: SupportRequestType['status'] }> = {};
      
      if (isAdmin && answer !== request.answer) {
        updates.answer = answer;
      }
      
      if (status !== request.status) {
        updates.status = status;
      }

      await updateSupportRequest(request.id, updates);
      onUpdate({
        ...request,
        ...updates
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-100">{request.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            status === 'Todo' ? 'bg-yellow-500/20 text-yellow-300' :
            status === 'InProgress' ? 'bg-blue-500/20 text-blue-300' :
            'bg-green-500/20 text-green-300'
          }`}>
            {getStatusDisplay(status)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-lime-500" />
            <span>{request.username}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-lime-500" />
            <span>Created: {formatDate(request.dateCreation)}</span>
          </div>
          {request.dateModification && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-lime-500" />
              <span>Last modified: {formatDate(request.dateModification)}</span>
            </div>
          )}
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-5 h-5 text-lime-500 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-300 mb-2">Problem Description</h4>
              <p className="text-gray-400 whitespace-pre-wrap">{request.problem}</p>
            </div>
          </div>
        </div>

        {(request.answer || isAdmin) && (
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-5 h-5 text-lime-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-300 mb-2">Answer</h4>
                {isEditing && isAdmin ? (
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                             text-gray-100 focus:outline-none focus:border-lime-500"
                    rows={4}
                    placeholder="Type your answer here..."
                  />
                ) : (
                  <p className="text-gray-400 whitespace-pre-wrap">
                    {request.answer || 'No answer yet'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {(isAdmin || isOwner) && (
          <div className="flex justify-end items-center space-x-4">
            {canEditStatus && !isEditing && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SupportRequestType['status'])}
                className="bg-gray-700 border border-gray-600 text-gray-300 rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="Todo">Todo</option>
                {isAdmin && <option value="InProgress">In Progress</option>}
                <option value="Done">Done</option>
              </select>
            )}
            
            {isAdmin && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-400 hover:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                               hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>{isSubmitting ? 'Saving...' : 'Save Answer'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                             hover:bg-lime-400"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Edit Answer</span>
                  </button>
                )}
              </>
            )}
            
            {!isAdmin && status !== 'Done' && (
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                         hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'Updating...' : 'Mark as Done'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}