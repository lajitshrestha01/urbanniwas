import { useEffect, useState } from "react";
import api from "../../utlis/axios";
import { Home, Loader2, AlertCircle } from "lucide-react";
import PropertyCard from "../../component/common/propertyCard";

const KathmanduProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("properties/city/kathmandu");
        setProperties(res.data);
        setError(false);
      } catch (error) {
        console.error("Error fetching Kathmandu Properties:", error);
        setError(true);
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-600">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-red-50 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load properties</h2>
        <p className="text-gray-600 text-center">
          We encountered an error while fetching properties in Kathmandu. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Home className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Properties in Kathmandu</h1>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => {
                console.log("Clicked on:", property.title);
                // Optional: navigate to detail page
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-600 mb-2">No properties found for Kathmandu</p>
          <p className="text-gray-500">Check back later for new listings or try a different location.</p>
        </div>
      )}
    </div>
  );
};

export default KathmanduProperties;
