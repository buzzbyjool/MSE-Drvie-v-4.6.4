import { CalendarDays, Clock, Euro, Users } from 'lucide-react';
import { Event } from '../types/events';
import { formatDate } from '../utils/dateFormatter';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const isFull = event.reservedCount >= event.maxCars;

  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-lime-500 
                 transition-all cursor-pointer group hover:shadow-xl hover:shadow-lime-500/10"
    >
      {event.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 
                     group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        </div>
      )}

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-100">{event.name}</h3>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-300">
            <CalendarDays className="w-4 h-4 text-lime-500" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4 text-lime-500" />
            <span>{formatDate(event.endDate)}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <Euro className="w-4 h-4 text-lime-500" />
            <span>{event.price}€</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-lime-500" />
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  isFull ? 'bg-red-500' : 'bg-lime-500'
                }`}
                style={{
                  width: `${(event.reservedCount / event.maxCars) * 100}%`
                }}
              />
            </div>
            <span className={`text-sm ${isFull ? 'text-red-500' : 'text-lime-500'}`}>
              {event.reservedCount}/{event.maxCars}
            </span>
          </div>
        </div>

        {isFull && (
          <p className="text-sm text-red-500 mt-2">
            Event is full - Waiting list only
          </p>
        )}
      </div>
    </div>
  );
}