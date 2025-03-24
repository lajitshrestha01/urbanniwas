import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../../utlis/axios";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const Maps = ({ properties }) => {
const [mapData, setMapData] = useState([]);
useEffect(()=>{
    api.get('/properties')
    .then((response) => setMapData(response.data))
    .catch((error) => console.error('Error fetching propertis: ', error));
    setError('failed to load properties');
    setLoading(false);
}, []);

  return (
    <MapContainer center={[0,0]} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {mapData.map((property, index) => (
        <Marker key={index} position={[property.lat, property.lng]}>
          <Popup>
            <strong>{property.name}</strong><br />
            {property.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Maps;
