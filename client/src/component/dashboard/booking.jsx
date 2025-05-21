import api from '../../utlis/axios';
import DashboardLayout from '../../component/layout/dashboardLayout';
import { Calendar, MapPin, User } from 'lucide-react';
import useUserStore from '../../zustand/store';
import { useEffect, useState } from 'react';

const BookingRequest = () => {
  const { user, isAuthenticated } = useUserStore();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchBooking = async () => {
      try {
        const endpoint = user.role === 'AGENT' ? '/bookings/agent' : '/bookings/user';
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      }
    };
    fetchBooking();
  }, [user, isAuthenticated]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(
        `/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookings(bookings.map(b => (b.id === id ? { ...b, status } : b)));
    } catch (err) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-[#1A2B3C]">Please log in</p>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-playfair font-bold text-[#1A2B3C] mb-6">My Bookings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[#1A2B3C]">
                <th className="p-3">Property</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                {user.role === 'AGENT' && <th className="p-3">Client</th>}
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-t">
                  <td className="p-3 flex items-center">
                    <MapPin className="text-[#D4AF37] w-5 h-5 mr-2" />
                    {booking.property.title}
                  </td>
                  <td className="p-3">
                    <Calendar className="text-[#D4AF37] w-5 h-5 inline mr-2" />
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{booking.timeSlot}</td>
                  <td className="p-3">{booking.status}</td>
                  {user.role === 'AGENT' && (
                    <td className="p-3">
                      <User className="text-[#D4AF37] w-5 h-5 inline mr-2" />
                      {booking.user.email}
                    </td>
                  )}
                  <td className="p-3">
                    {user.role === 'AGENT' && booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                          className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          className="mr-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookingRequest;
