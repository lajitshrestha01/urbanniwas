import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useParams } from "react-router-dom"; // Import useParams
import api from "../../utlis/axios"; // Assuming this is correct path
import "leaflet/dist/leaflet.css";

const Maps = ({ properties }) => {
  const { id } = useParams(); // Get the property ID from URL params
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [mapData, setMapData] = useState([]); // Initialize as an array, not 0
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.get(`/properties/${id}`);
        const fetchedProperty = response.data;
        setProperty(fetchedProperty);
        // Assuming the API returns an object with latitude and longitude
        setMapData([
          {
            latitude: fetchedProperty.latitude,
            longitude: fetchedProperty.longitude,
            title: fetchedProperty.title || "Property",
            address: fetchedProperty.address || "No address provided",
          },
        ]);
        // console.log(response);
      } catch (error) {
        setError("Failed to load property!");
        console.error(error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProperty();
  }, [id]);

  // If data is loading or there's an error, show messages
  if (loading) {
    return <p>Loading map...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Fallback center of the map
  const mapCenter =
    mapData.length > 0 && mapData[0].latitude && mapData[0].longitude
      ? [mapData[0].latitude, mapData[0].longitude]
      : [51.505, -0.09]; // Default to London if no valid coordinates

  return (
    <MapContainer center={mapCenter} zoom={15} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {mapData.map((property, index) => {
        // Check if latitude and longitude exist before rendering Marker
        if (property.latitude && property.longitude) {
          return (
            <Marker key={index} position={[property.latitude, property.longitude]}>
              <Popup>
                <strong>{property.title}</strong>
                <br />
                {property.address}
              </Popup>
            </Marker>
          );
        }
        return null; // Skip if no valid coordinates
      })}
    </MapContainer>
  );
};

export default Maps;