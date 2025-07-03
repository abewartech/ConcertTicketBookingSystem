import React from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Concert {
  id: number;
  title: string;
  artist: string;
  venue: string;
  date: string;
  price: number;
  available_seats: number;
  total_seats: number;
  image_url: string;
  description: string;
}

interface ConcertCardProps {
  concert: Concert;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const availabilityPercentage = (concert.available_seats / concert.total_seats) * 100;
  const isLowAvailability = availabilityPercentage < 20;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={concert.image_url}
          alt={concert.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{concert.title}</h3>
          <p className="text-purple-200">{concert.artist}</p>
        </div>
        {isLowAvailability && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Limited Seats
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <p className="text-gray-300 text-sm line-clamp-2">{concert.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
            {formatDate(concert.date)}
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-purple-400" />
            {concert.venue}
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Users className="h-4 w-4 mr-2 text-purple-400" />
            {concert.available_seats} / {concert.total_seats} seats available
          </div>
          <div className="flex items-center text-green-400 text-sm font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            ${concert.price}
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isLowAvailability ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>

        <Link
          to={`/booking/${concert.id}`}
          className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ConcertCard;