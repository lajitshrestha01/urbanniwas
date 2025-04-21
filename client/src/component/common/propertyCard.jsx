import useUserStore from "../../zustand/store";
import { useEffect, useState } from "react";
import { Heart, Bed, Bath, Ruler } from "lucide-react";
import { Link } from "react-router-dom"; 
import api from '../../utlis/axios'
const PropertyCard = ({ property, onClick }) => {
  const { title, location, price, area, type, bedrooms, bathrooms, images, id } = property;
  const { user, isAuthenticated } = useUserStore();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (isAuthenticated && user) {
        try {
          const { data } = await api.get('/favorites', {
            withCredentials: true, // Send JWT cookie
          });
          setIsFavorited(data.some((fav) => fav.propertyId === id));
        } catch (error) {
          console.error('Check favorite error:', error);
        }
      }
    };
    checkFavorite();
  }, [user, isAuthenticated, id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isAuthenticated || !user) return alert('Please log in');
    if (user.role !== 'CLIENT') return alert('Only clients can favorite');

    try {
      if (isFavorited) {
        await api.delete(`/favorites/remove/${id}`, {
          withCredentials: true,
        });
        setIsFavorited(false);
      } else {
        await api.post(
          '/favorites/add',
          { propertyId: id },
          { withCredentials: true }
        );
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Favorite error:', error.response?.data?.message);
      alert(error.response?.data?.message || 'Failed to update favorite');
    }
  };

  return (
    <>
    <Link to={`/property/${property.id}`}>
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 w-[300px] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={images?.[0] || '/api/placeholder/400/300'}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <button
            className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100"
            onClick={toggleFavorite}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorited ? 'red' : 'none'}
              color={isFavorited ? 'red' : 'gray'}
            />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded">{type}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{location}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-bold">Rs. {price}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Bed className="mr-2" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="mr-2" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Ruler className="mr-2" />
            <span>{area} sqft</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
   
    </>
   
  );
};

export default PropertyCard;