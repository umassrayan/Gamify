import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

// Define types for location coordinates
interface LatLngLiteral {
    lat: number;
    lng: number;
}

// Define component props interface
interface LocationCheckerProps {
    apiKey: string;
    targetAddress: string;
    radius: number; // in meters
    userLocation: LatLngLiteral | null;
    onProximityChange: (isWithinRadius: boolean) => void;
}

// Map container style
const containerStyle = {
    width: '100%',
    height: '400px',
};

// Default center (will be updated)
const defaultCenter = {
    lat: 42.3732, // Approx. Amherst, MA
    lng: -72.5199,
};

// Libraries to load from Google Maps API
const libraries: ('geometry' | 'places' | 'drawing' | 'visualization')[] = ['geometry', 'places'];

const LocationChecker: React.FC<LocationCheckerProps> = ({ apiKey, targetAddress, radius, userLocation, onProximityChange }) => {
    // State for target location coordinates and map instance
    const [targetLocation, setTargetLocation] = useState<LatLngLiteral | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);

    // Load the Google Maps script
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries, // Ensure geometry library is loaded
    });

    // Geocode the target address when the component mounts or address changes
    useEffect(() => {
        if (!isLoaded || !window.google || !targetAddress) return;

        const geocoder = new window.google.maps.Geocoder();
        setGeocodingError(null); // Reset error

        geocoder.geocode({ address: targetAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                const newTargetLocation = {
                    lat: location.lat(),
                    lng: location.lng(),
                };
                setTargetLocation(newTargetLocation);
                // Center map on the new target location
                if (map) {
                    map.panTo(newTargetLocation);
                }
            } else {
                console.error(`Geocode was not successful for the following reason: ${status}`);
                setGeocodingError(`Could not find coordinates for address: ${targetAddress}. Status: ${status}`);
                setTargetLocation(null); // Clear target if geocoding fails
                onProximityChange(false); // Assume outside if target is unknown
            }
        });
    }, [isLoaded, targetAddress, onProximityChange, map]); // Added map dependency

    // Calculate distance and update proximity when locations change
    useEffect(() => {
        if (!isLoaded || !window.google || !userLocation || !targetLocation) {
            // If any required info is missing, user is considered outside
            onProximityChange(false);
            return;
        }

        const googleUserLoc = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        const googleTargetLoc = new google.maps.LatLng(targetLocation.lat, targetLocation.lng);

        // Calculate spherical distance
        const distance = google.maps.geometry.spherical.computeDistanceBetween(googleUserLoc, googleTargetLoc);

        // Check if distance is within the specified radius
        const isWithin = distance <= radius;
        onProximityChange(isWithin);
    }, [isLoaded, userLocation, targetLocation, radius, onProximityChange]);

    // Memoize map center to prevent unnecessary re-renders
    const center = useMemo(() => targetLocation || defaultCenter, [targetLocation]);

    // Callback when map loads
    const onMapLoad = useCallback(
        (mapInstance: google.maps.Map) => {
            setMap(mapInstance);
            // If target location is already known when map loads, pan to it
            if (targetLocation) {
                mapInstance.panTo(targetLocation);
            }
        },
        [targetLocation],
    ); // Added targetLocation dependency

    // Callback when map unmounts
    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Render loading state
    if (loadError) return <div>Error loading maps: {loadError.message}</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div>
            {geocodingError && <div style={{ color: 'red', marginBottom: '10px' }}>{geocodingError}</div>}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={targetLocation ? 15 : 10} // Zoom in more if target is found
                onLoad={onMapLoad}
                onUnmount={onUnmount}
                options={{
                    streetViewControl: false, // Optional: hide street view
                    mapTypeControl: false, // Optional: hide map type toggle
                }}
            >
                {/* Target Location Marker */}
                {targetLocation && <Marker position={targetLocation} title="Target Location" />}

                {/* Radius Circle */}
                {targetLocation && (
                    <Circle
                        center={targetLocation}
                        radius={radius} // Radius in meters
                        options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                        }}
                    />
                )}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Your Location"
                        icon={{
                            // Custom icon for user
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default LocationChecker;
