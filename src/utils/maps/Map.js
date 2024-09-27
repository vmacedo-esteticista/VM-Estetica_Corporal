import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { geocodeLoc, geocodeEnd } from "./geocode";
import { MapPin } from "lucide-react";
import { createLucideIcon } from "./createLucideIcon";

const customIcon = createLucideIcon(MapPin, 40);

const Map = ({ address, onSelectPosition, setAddress }) => {
  //Local em tempo Real.
  const [initialPosition, setInitialPosition] = useState(null);
  const [selectedAddresslocal, setSelectedAddresslocal] = useState("");

  //Local direcionado.
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  //Location capturado
  useEffect(() => {
    if(address) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        geocodeLoc(`lat=${latitude}&lon=${longitude}`).then((location) => {
          if (location) {
            const { formattedAddress} = location;
            setSelectedAddresslocal(formattedAddress);
          }
        });
        setInitialPosition([latitude, longitude]);
        onSelectPosition([latitude, longitude]);
      }, function(error) {
        console.error("Erro ao obter localização:", error.message);
      });
    } else {
      console.log("Geolocalização não suportada.");
    }
  }, [onSelectPosition, setInitialPosition]);

  //Location informado
  useEffect(() => {
    if(address){
      geocodeEnd(address).then(result => {
      if (result) {
        const { formattedAddress, lat, lon } = result;
        setSelectedAddress(formattedAddress);
        setSelectedPosition({ lat, lon })
      } else {
        console.log('No data found for the given address.');
      }});
    }else{
      console.log("sem address.")
    }

  }, [address])

 //Location informado 
 const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedPosition({ lat, lng });
    onSelectPosition([lat, lng]);

    geocodeLoc(`lat=${lat}&lon=${lng}`).then((location) => {
      if (location) {
        const { formattedAddress} = location;
        setSelectedAddress(formattedAddress);
        setAddress(formattedAddress);
      }
    });
  };

  return (
    <>
      {initialPosition && (
        <MapContainer center={initialPosition} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {initialPosition && (
            <Marker position={initialPosition} icon={customIcon}>
              <Popup>{selectedAddresslocal || "Carregando endereço atual..."}</Popup>
            </Marker>
          )}
          {selectedPosition && (
            <Marker position={selectedPosition} icon={customIcon}>
                <Popup>{selectedAddress || "Carregando endereço..."}</Popup>
            </Marker>
          )}
          <MapEventsHandler onClick={handleMapClick} />
        </MapContainer>
      )}
    </>
  );
};

const MapEventsHandler = ({ onClick }) => {
  const map = useMapEvents({
    click: (e) => {
      onClick(e);
    },
  });
  return null;
};

export default Map;
