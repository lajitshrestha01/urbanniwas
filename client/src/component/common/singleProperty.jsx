import { useParams } from 'react-router-dom';
import api from '../../utlis/axios';
import { useState, useEffect } from 'react';
import HeroSection from './heroSectionSingleProperty';
import Footer from './footer';
import { Bed, Bath, Ruler, MapPin, Car, Calendar, User } from 'lucide-react';
import Maps from '../map/map';
import Navbar from './navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from '../../zustand/store';
import { toast, ToastContainer } from 'react-toastify';

const SingleProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const { user, isAuthenticated } = useUserStore();

  const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setError('Failed to load property!');
        console.error(error);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = async e => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please log in');
    try {
      await api.post(
        '/bookings',
        { propertyId: property.id, date: selectedDate, timeSlot },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Booking request sent!');
      setIsBookingModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error creating booking');
    }
  };

  const handleMessage = async e => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please log in');
    try {
      await api.post(
        '/messages',
        { propertyId: property.id, receiverId: property.agentId, message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success('Message sent');
      setIsMessageModalOpen(false);
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending message');
    }
  };

  const propertyDisplayRules = {
    APARTMENT: [
      { key: 'bedrooms', label: 'Beds', Icon: Bed },
      { key: 'bathrooms', label: 'Baths', Icon: Bath },
      { key: 'area', label: 'Sq.Ft.', Icon: Ruler },
      { key: 'floor_number', label: 'Floor', Icon: MapPin },
    ],
    LAND: [
      { key: 'area', label: 'Sq.Ft.', Icon: Ruler },
      { key: 'zoning_type', label: 'Zoning', Icon: MapPin },
      { key: 'dimensions', label: 'Dimensions', Icon: Ruler },
    ],
    HOUSE: [
      { key: 'bedrooms', label: 'Beds', Icon: Bed },
      { key: 'bathrooms', label: 'Baths', Icon: Bath },
      { key: 'area', label: 'Sq.Ft.', Icon: Ruler },
      { key: 'garage', label: 'Garage', Icon: Car },
      { key: 'year_built', label: 'Year Built', Icon: Calendar },
    ],
    COMMERCIAL: [
      { key: 'area', label: 'Sq.Ft.', Icon: Ruler },
      { key: 'parking_spaces', label: 'Parking', Icon: Car },
      { key: 'building_type', label: 'Type', Icon: MapPin },
    ],
  };

  const renderAttributes = property => {
    const attributesToShow = propertyDisplayRules[property.type] || [];
    return attributesToShow.map(({ key, label, Icon }) =>
      property[key] !== undefined ? (
        <div key={key} className="flex items-center space-x-3">
          <div className="bg-[#F8F9FA] rounded-full p-3 flex items-center justify-center">
            <Icon className="text-[#D4AF37] w-5 h-5" />
          </div>
          <div>
            <span className="block text-lg font-medium">{property[key]}</span>
            <span className="block text-sm text-gray-500">{label}</span>
          </div>
        </div>
      ) : null
    );
  };

  if (!property) {
    return (
      <div>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p>{error || 'Loading property...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-black">
          {/* Property Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-4xl font-playfair font-bold text-[#1A2B3C]">
                ${property.price.toLocaleString()}
              </h2>
              <div className="flex space-x-3">
                {isAuthenticated && user.role === 'CLIENT' && property.agent && (
                  <>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C09C2C] transition-colors duration-300 font-medium flex items-center"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Visit
                    </button>
                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#FDF9E8] transition-colors duration-300 font-medium flex items-center"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Message Agent
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 p-8">
              <div className="prose max-w-none mb-8">
                <p className="text-lg text-gray-700 font-lato leading-relaxed">
                  {property.description}
                </p>
              </div>

              <h3 className="text-2xl font-playfair font-bold text-[#1A2B3C] mb-6">
                Property Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 mb-8">
                {renderAttributes(property)}
              </div>

              {/* Agent Card - Desktop (moved inside main content) */}
              {isAuthenticated && user.role === 'CLIENT' && property.agent && (
                <div className="mt-8 p-6 bg-[#F8F9FA] rounded-lg border border-gray-100 hidden lg:block">
                  <h3 className="text-2xl font-playfair font-bold text-[#1A2B3C] mb-4 flex items-center">
                    <User className="text-[#D4AF37] w-6 h-6 mr-2" />
                    Agent Information
                  </h3>
                  <div className="flex items-center">
                    <img
                      src={property.agent.avatar || 'https://via.placeholder.com/80'}
                      alt="Agent"
                      className="w-20 h-20 rounded-full mr-4 border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="text-lg font-semibold">{property.agent.name}</p>
                      <p className="text-gray-600">{property.agent.email}</p>
                      <p className="text-gray-600">{property.agent.phoneNumber || 'N/A'}</p>
                      <p className="text-gray-600">
                        {property.agent.agencyName || 'Independent Agent'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Images */}
            <div className="lg:col-span-1 bg-gray-50 p-8">
              <div className="grid grid-cols-1 gap-4">
                {property.images.slice(0, 2).map((img, index) => (
                  <div key={index} className={index === 0 ? 'col-span-2' : ''}>
                    <img
                      src={img || '/placeholder.svg'}
                      alt={`Property view ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Agent Card - Mobile */}
              {isAuthenticated && user.role === 'CLIENT' && property.agent && (
                <div className="mt-8 p-6 bg-[#F8F9FA] rounded-lg border border-gray-100 lg:hidden">
                  <h3 className="text-2xl font-playfair font-bold text-[#1A2B3C] mb-4 flex items-center">
                    <User className="text-[#D4AF37] w-6 h-6 mr-2" />
                    Agent Information
                  </h3>
                  <div className="flex items-center">
                    <img
                      src={property.agent.avatar || 'https://via.placeholder.com/80'}
                      alt="Agent"
                      className="w-20 h-20 rounded-full mr-4 border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="text-lg font-semibold">{property.agent.name}</p>
                      <p className="text-gray-600">{property.agent.email}</p>
                      <p className="text-gray-600">{property.agent.phoneNumber || 'N/A'}</p>
                      <p className="text-gray-600">
                        {property.agent.agencyName || 'Independent Agent'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl border border-black">
            <h2 className="text-2xl font-bold mb-6 text-[#1A2B3C] font-playfair">Book a Visit</h2>
            <form onSubmit={handleBooking}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Time</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="mr-4 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!timeSlot}
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C09C2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-[#1A2B3C] font-playfair">Message Agent</h2>
            <form onSubmit={handleMessage}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  rows="5"
                  placeholder="I'm interested in this property and would like more information..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="mr-4 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C09C2C] transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        <Maps />
      </div>
      <div>
        <Footer />
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default SingleProperty;
