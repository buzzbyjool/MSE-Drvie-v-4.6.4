import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { createSupportRequest } from '../services/airtable/support';
import { useAuth } from '../context/AuthContext';

interface CreateSupportRequestProps {
  onClose: () => void;
  onRequestCreated: () => void;
}

export default function CreateSupportRequest({ onClose, onRequestCreated }: CreateSupportRequestProps) {
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createSupportRequest({
        username: user.username,
        title: title.trim(),
        problem: problem.trim()
      });
      onRequestCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-100 mb-6">Create Support Request</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-2">
              Problem Description
            </label>
            <textarea
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:outline-none focus:border-lime-500"
              rows={6}
              placeholder="Detailed description of your problem..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-200">{error}</p>
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
              className="flex items-center space-x-2 px-4 py-2 bg-lime-500 text-black rounded-lg 
                       hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}