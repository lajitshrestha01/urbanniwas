import { useState, useEffect } from "react";
import api from "../../utlis/axios.js";
import { useParams } from "react-router-dom";

const HeroSection = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0); // State to keep track of the current image index

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
        // console.log(response);
      } catch (error) {
        setError("Failed to load property!");
        console.error(error);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle the next and previous image navigation
  const nextImage = () => {
    if (property && property.images) {
      setImageIndex((prevIndex) => (prevIndex + 1) % property.images.length); // Loop back to the first image when reaching the end
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length); // Loop back to the last image when reaching the start
    }
  };

  // Auto slide the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [property]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!property) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <img
        src={property.images?.[imageIndex] || "https://via.placeholder.com/1200x600"}
        alt={property.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/70">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-4">
          {property.title}
          
        </h1>
        <p className="text-xl text-white font-lato">
          {property.city}, {property.address}
        </p>
      </div>

      {/* Left Arrow for Previous Image */}
      <button
        onClick={prevImage}
        className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30"
      >
        &#10094;
      </button>

      {/* Right Arrow for Next Image */}
      <button
        onClick={nextImage}
        className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30"
      >
        &#10095;
      </button>
    </div>
  );
};

export default HeroSection;
