import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Calendar, MapPin, Users, DollarSign, Minus, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingSchema = Yup.object().shape({
  quantity: Yup.number().min(1, 'Minimum 1 ticket').max(10, 'Maximum 10 tickets').required('Quantity is required'),
});

// Mock data - same as Dashboard
const mockConcerts = [
  {
    id: 1,
    title: 'Rock Festival 2024',
    artist: 'The Rockers',
    venue: 'Madison Square Garden',
    date: '2024-06-15T20:00:00Z',
    price: 150.00,
    total_seats: 5000,
    available_seats: 4850,
    description: 'An amazing rock festival featuring top artists from around the world. Experience the energy and excitement of live rock music.',
    image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
  },
  {
    id: 2,
    title: 'Jazz Night',
    artist: 'Smooth Jazz Collective',
    venue: 'Blue Note',
    date: '2024-06-20T19:30:00Z',
    price: 85.00,
    total_seats: 300,
    available_seats: 275,
    description: 'Intimate jazz performance in a classic venue. Enjoy smooth melodies and sophisticated rhythms in an elegant setting.',
    image_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg'
  },
  {
    id: 3,
    title: 'Electronic Beats',
    artist: 'DJ Pulse',
    venue: 'Electric Arena',
    date: '2024-06-25T22:00:00Z',
    price: 120.00,
    total_seats: 2000,
    available_seats: 1900,
    description: 'High-energy electronic music experience with cutting-edge sound and visual effects. Dance the night away.',
    image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'
  },
  {
    id: 4,
    title: 'Classical Symphony',
    artist: 'City Orchestra',
    venue: 'Concert Hall',
    date: '2024-07-01T19:00:00Z',
    price: 95.00,
    total_seats: 800,
    available_seats: 750,
    description: 'Beautiful classical music performance featuring timeless compositions. Experience the elegance of orchestral music.',
    image_url: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'
  }
];

const BookingPage: React.FC = () => {
  const { concertId } = useParams<{ concertId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: concert, isLoading } = useQuery({
    queryKey: ['concert', concertId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockConcerts.find(c => c.id === parseInt(concertId || '0'));
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Concert Not Found</h2>
          <p className="text-gray-300 mb-4">The concert you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

  const totalPrice = concert.price * quantity;

  const handleBooking = async (values: any) => {
    // Mock booking creation
    const bookingData = {
      concert_id: concert.id,
      quantity: values.quantity,
      total_price: totalPrice
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to payment with booking data
    navigate('/payment', { state: { booking: bookingData, concert } });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
          {/* Concert Header */}
          <div className="relative h-64 md:h-80">
            <img
              src={concert.image_url}
              alt={concert.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{concert.title}</h1>
              <p className="text-xl text-purple-200">{concert.artist}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Concert Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Event Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                      {formatDate(concert.date)}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                      {concert.venue}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-purple-400" />
                      {concert.available_seats} / {concert.total_seats} seats available
                    </div>
                    <div className="flex items-center text-green-400 font-semibold">
                      <DollarSign className="h-5 w-5 mr-2" />
                      ${concert.price} per ticket
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{concert.description}</p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Book Your Tickets</h2>
                
                <Formik
                  initialValues={{ quantity: 1 }}
                  validationSchema={BookingSchema}
                  onSubmit={handleBooking}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Number of Tickets
                        </label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              const newQuantity = Math.max(1, values.quantity - 1);
                              setFieldValue('quantity', newQuantity);
                              setQuantity(newQuantity);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Minus className="h-4 w-4 text-white" />
                          </button>
                          
                          <Field
                            name="quantity"
                            type="number"
                            min="1"
                            max="10"
                            className="w-20 text-center px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = parseInt(e.target.value) || 1;
                              setFieldValue('quantity', value);
                              setQuantity(value);
                            }}
                          />
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newQuantity = Math.min(10, values.quantity + 1);
                              setFieldValue('quantity', newQuantity);
                              setQuantity(newQuantity);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Plus className="h-4 w-4 text-white" />
                          </button>
                        </div>
                        <ErrorMessage name="quantity" component="div" className="text-red-400 text-sm mt-1" />
                      </div>

                      {/* Price Summary */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Ticket Price</span>
                          <span className="text-white">${concert.price}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">Quantity</span>
                          <span className="text-white">{values.quantity}</span>
                        </div>
                        <hr className="border-white/20 my-3" />
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Total</span>
                          <span className="text-lg font-bold text-green-400">${(concert.price * values.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || concert.available_seats < values.quantity}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;