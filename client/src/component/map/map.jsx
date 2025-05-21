import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import api from '../../utlis/axios';
import 'leaflet/dist/leaflet.css';

const Maps = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        const fetchedProperty = response.data;
        setProperty(fetchedProperty);
        setMapData([
          {
            latitude: fetchedProperty.latitude,
            longitude: fetchedProperty.longitude,
            title: fetchedProperty.title || 'Property',
            address: fetchedProperty.address || 'No address provided',
          },
        ]);
      } catch (error) {
        setError('Failed to load property!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <p>Loading map...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const mapCenter =
    mapData.length > 0 && mapData[0].latitude && mapData[0].longitude
      ? [mapData[0].latitude, mapData[0].longitude]
      : [51.505, -0.09];

  return (
    <MapContainer center={mapCenter} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {mapData.map((property, index) => {
        if (property.latitude && property.longitude) {
          return (
            <Marker key={index} position={[property.latitude, property.longitude]}>
              <Popup>
                <strong>{property.title}</strong>
                <br />
                {property.address}
              </Popup>
              <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                <strong>{property.title}</strong>
                <br />
                {property.address}
              </Tooltip>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default Maps;
