import { useState, useEffect } from 'react';
import { ArrowLeft, CalendarDays, Clock, Euro, Users, CheckCircle, XCircle } from 'lucide-react';
import { Event } from '../types/events';
import { useAuth } from '../context/AuthContext';
import { registerForEvent, unregisterFromEvent } from '../services/airtable/events';
import { formatDate } from '../utils/dateFormatter';
import CountdownTimer from './CountdownTimer';
import { getMembersInfo, MemberInfo } from '../services/airtable/users';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onUpdateEvent: (event: Event) => void;
}

export default function EventDetails({ event, onBack, onUpdateEvent }: EventDetailsProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredMembers, setRegisteredMembers] = useState<MemberInfo[]>([]);

  const isRegistered = user ? event.registered.includes(user.username) : false;
  const isFull = event.reservedCount >= event.maxCars;
  const canRegister = !isFull || isRegistered;

  useEffect(() => {
    const fetchRegisteredMembers = async () => {
      if (event.registered.length > 0) {
        try {
          const members = await getMembersInfo(event.registered);
          setRegisteredMembers(members);
        } catch (err) {
          console.error('Error fetching registered members:', err);
        }
      }
    };

    fetchRegisteredMembers();
  }, [event.registered]);

  const handleRegistration = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (isRegistered) {
        await unregisterFromEvent(event.id, user.username);
        onUpdateEvent({
          ...event,
          registered: event.registered.filter(username => username !== user.username),
          reservedCount: Math.max(0, event.reservedCount - 1)
        });
      } else {
        await registerForEvent(event.id, user.username);
        onUpdateEvent({
          ...event,
          registered: [...event.registered, user.username],
          reservedCount: event.reservedCount + 1
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-lime-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to events</span>
            </button>

            <div className="w-full sm:w-auto flex justify-center">
              <CountdownTimer targetDate={event.startDate} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {event.image && (
          <div className="relative w-full h-[70vh] sm:h-[80vh]">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-transparent to-gray-900/90" />
            
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 via-lime-300 to-green-400 drop-shadow-lg mb-8">
                    {event.name}
                  </h1>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
                    <div>
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="w-5 h-5 text-lime-500" />
                        <div>
                          <p className="text-sm text-gray-400">Start Date</p>
                          <p className="text-base font-medium text-gray-100">{formatDate(event.startDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-lime-500" />
                        <div>
                          <p className="text-sm text-gray-400">End Date</p>
                          <p className="text-base font-medium text-gray-100">{formatDate(event.endDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <Euro className="w-5 h-5 text-lime-500" />
                        <div>
                          <p className="text-sm text-gray-400">Price</p>
                          <p className="text-base font-medium text-gray-100">{event.price}€</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-lime-500" />
                        <div>
                          <p className="text-sm text-gray-400">Remaining Seats</p>
                          <p className={`text-base font-medium ${isFull ? 'text-red-500' : 'text-lime-500'}`}>
                            {event.maxCars - event.reservedCount}/{event.maxCars} cars
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {user && (
                <div className="p-4 sm:p-6 lg:p-8 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
                  <div className="max-w-7xl mx-auto">
                    <button
                      onClick={handleRegistration}
                      disabled={isSubmitting || (!canRegister && !isRegistered)}
                      className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-lg 
                        transition-colors font-medium text-lg ${
                          isRegistered
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : canRegister
                            ? 'bg-lime-500 hover:bg-lime-600 text-black'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {isRegistered ? (
                        <>
                          <XCircle className="w-6 h-6" />
                          <span>{isSubmitting ? 'Canceling...' : 'Cancel Registration'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span>
                            {isSubmitting 
                              ? 'Registering...' 
                              : isFull 
                              ? 'Join Waiting List' 
                              : 'Register Now'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 sm:py-8 lg:py-10 space-y-10">
            {error && (
              <div className="bg-red-900/50 border border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="bg-gray-800 p-6 sm:p-8 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Event Description</h2>
                <div className="space-y-4 text-gray-300 text-lg" dangerouslySetInnerHTML={{ __html: event.description }} />
              </div>
            </div>

            {registeredMembers.length > 0 && (
              <div className="bg-gray-800 p-6 sm:p-8 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">Registered Members</h2>
                <div className="space-y-4">
                  {registeredMembers.map((member) => (
                    <div 
                      key={member.username}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div>
                          <p className="text-lg text-gray-200">{member.firstName} {member.lastName}</p>
                          <p className="text-sm text-gray-400">@{member.username}</p>
                        </div>
                      </div>
                      {member.carModel && (
                        <p className="text-sm text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full">
                          {member.carModel}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}