import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CreditCard, Lock, CheckCircle, Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PaymentSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be MM/YY format')
    .required('Expiry date is required'),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .required('CVV is required'),
  cardholderName: Yup.string().required('Cardholder name is required'),
});

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { booking, concert } = location.state || {};

  if (!booking || !concert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">No Booking Found</h2>
          <p className="text-gray-300 mb-4">Please select a concert and create a booking first.</p>
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

  const handlePayment = async (values: any, { setSubmitting }: any) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      setPaymentSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-300 mb-4">
            Your booking for {concert.title} has been confirmed.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={concert.image_url}
                  alt={concert.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{concert.title}</h3>
                  <p className="text-purple-200">{concert.artist}</p>
                </div>
              </div>

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
                  {booking.quantity} ticket(s)
                </div>
              </div>

              <hr className="border-white/20" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Ticket Price</span>
                  <span>${concert.price}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Quantity</span>
                  <span>{booking.quantity}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Service Fee</span>
                  <span>$5.00</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>${(booking.total_price + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
            </div>

            <Formik
              initialValues={{
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                cardholderName: user?.first_name + ' ' + user?.last_name || ''
              }}
              validationSchema={PaymentSchema}
              onSubmit={handlePayment}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <Field
                      name="cardholderName"
                      type="text"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="John Doe"
                    />
                    <ErrorMessage name="cardholderName" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <Field
                        name="cardNumber"
                        type="text"
                        maxLength="16"
                        className="w-full px-3 py-2 pl-10 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="1234567890123456"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFieldValue('cardNumber', value);
                        }}
                      />
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <ErrorMessage name="cardNumber" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <Field
                        name="expiryDate"
                        type="text"
                        maxLength="5"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="MM/YY"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setFieldValue('expiryDate', value);
                        }}
                      />
                      <ErrorMessage name="expiryDate" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <Field
                        name="cvv"
                        type="text"
                        maxLength="4"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="123"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFieldValue('cvv', value);
                        }}
                      />
                      <ErrorMessage name="cvv" component="div" className="text-red-400 text-sm mt-1" />
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-blue-400 mr-2" />
                      <p className="text-sm text-blue-200">
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing Payment...' : `Pay $${(booking.total_price + 5).toFixed(2)}`}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;