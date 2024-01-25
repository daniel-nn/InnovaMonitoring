import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: 25.7617,
    lng: -80.1918
};

function AddressAutocompleteMap({ onSelectAddress }) {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");

    const onMapLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onMapClick = useCallback((event) => {
        const newMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        setMarker(newMarkerPosition);

        // Aquí implementarías la geocodificación para obtener la dirección y llamar a onSelectAddress
        // con la dirección obtenida.
        geocodeLatLng(newMarkerPosition);
    }, []);

    const geocodeLatLng = useCallback((latLng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setSelectedAddress(results[0].formatted_address);
                    onSelectAddress(results[0].formatted_address);
                } else {
                    window.alert("No results found");
                }
            } else {
                window.alert("Geocoder failed due to: " + status);
            }
        });
    }, [onSelectAddress]);

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBUweeGAvXbF7xmI0lafmVrhmiITTVZSzQ"
            libraries={['places']}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onMapLoad}
                onClick={onMapClick}
            >
                {marker && <Marker position={marker} />}
                {/* Agregar el Autocomplete si se requiere */}
                {/* ... */}
            </GoogleMap>
        </LoadScript>
    );
}


export default AddressAutocompleteMap;