import React, { useState, useEffect, useCallback } from 'react';
import LocationChecker from './LocationChecker'; // Assuming LocationChecker.tsx is in the same folder
import './App.css'; //

// Define types for location coordinates
interface LatLngLiteral {
    lat: number;
    lng: number;
}

function App() {
    // --- State Declarations ---
    const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
    const [isWithinRadius, setIsWithinRadius] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(true); // Track loading state

    // --- Configuration ---
    const targetAddress = '740 N Pleasant St, Amherst, MA 01003'; // Example Address
    const radiusInMeters = 100; // Example Radius
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // For Vite

    // --- Location Fetching Function ---
    // Encapsulates the logic to get the current position
    const fetchUserLocation = useCallback(() => {
        if (!apiKey) {
            setLoadingLocation(false);
            setLocationError('Google Maps API key is missing.');
            setUserLocation(null);
            setIsWithinRadius(false);
            return;
        }

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            setLoadingLocation(false);
            setUserLocation(null);
            setIsWithinRadius(false);
            return;
        }

        setLoadingLocation(true); // Indicate loading starts/restarts
        setLocationError(null); // Reset previous errors

        const successCallback = (position: GeolocationPosition) => {
            console.log('Location Fetched:', position.coords);
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
            setLocationError(null);
            setLoadingLocation(false);
        };

        const errorCallback = (error: GeolocationPositionError) => {
            console.error('Error getting user location:', error);
            let errorMessage = 'Failed to retrieve location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Please enable location services.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is currently unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get user location timed out.';
                    break;
                default:
                    errorMessage = `An unknown error occurred (Code: ${error.code}).`;
                    break;
            }
            setLocationError(errorMessage);
            // Keep previous location if available, or set to null if none was ever found
            // setUserLocation(null); // Optionally clear location on error
            setIsWithinRadius(false); // Assume outside if location fails
            setLoadingLocation(false); // Stop loading indicator on error
        };

        // --- Use getCurrentPosition (called once per fetch) ---
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0, // Don't use a cached position for refresh
        });
    }, [apiKey]); // Dependency on apiKey

    // --- Initial Load Effect ---
    // Fetch location once when the component mounts
    useEffect(() => {
        fetchUserLocation();
    }, [fetchUserLocation]); // Run when fetchUserLocation function is stable

    // --- Proximity Change Handler ---
    // Callback function for LocationChecker to update proximity status
    const handleProximityChange = useCallback(
        (isWithin: boolean) => {
            if (isWithin !== isWithinRadius) {
                setIsWithinRadius(isWithin);
            }
        },
        [isWithinRadius],
    );

    // --- Conditional Return for Missing API Key ---
    if (!apiKey) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                <h2>Configuration Error</h2>
                <p>Google Maps API key is missing.</p>
                <p>
                    Please create a <code>.env</code> file and add <code>VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY</code>.
                </p>
            </div>
        );
    }

    // --- Event Handlers & Derived State ---
    // Handler for the proximity-based action button
    const handleActionButtonClick = () => {
        if (isWithinRadius) {
            console.log('Action Button clicked! User is within radius.');
            alert('Action performed: User is within the designated area!');
        }
    };

    // Handler for the new Refresh button
    const handleRefreshLocation = () => {
        console.log('Refresh button clicked - fetching location...');
        fetchUserLocation(); // Call the function to get location again
    };

    // Determine Action button disabled state
    const isActionButtonDisabled = loadingLocation || !!locationError || !isWithinRadius;

    // --- Render Logic ---
    return (
        <div className="App">
            <h1>Location Proximity Checker</h1>
            <p>
                Checking if you are within {radiusInMeters} meters of: <br />
                <strong>{targetAddress}</strong>
            </p>

            {/* Refresh Button */}
            <div style={{ marginBottom: '15px' }}>
                <button onClick={handleRefreshLocation} disabled={loadingLocation}>
                    {loadingLocation ? 'Refreshing...' : 'Refresh Location'}
                </button>
            </div>

            {/* Status Messages */}
            {loadingLocation && <p>Getting location...</p>}
            {locationError && <p style={{ color: locationError === 'Google Maps API key is missing.' ? 'red' : 'orange' }}>Error: {locationError}</p>}
            {!loadingLocation && !locationError && userLocation && (
                <p>
                    Your current location: Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                </p>
            )}
            {!loadingLocation && !locationError && !userLocation && locationError !== 'Google Maps API key is missing.' && <p>Could not determine your location.</p>}
            {!loadingLocation && !locationError && (
                <p style={{ fontWeight: 'bold', color: isWithinRadius ? 'green' : 'red' }}>Status: You are currently {isWithinRadius ? 'INSIDE' : 'OUTSIDE'} the radius.</p>
            )}

            {/* Render the Map Component */}
            <LocationChecker
                apiKey={apiKey}
                targetAddress={targetAddress}
                radius={radiusInMeters}
                userLocation={userLocation} // Pass the current location state
                onProximityChange={handleProximityChange}
            />

            {/* Conditional Action Button */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleActionButtonClick}
                    disabled={isActionButtonDisabled}
                    title={isActionButtonDisabled ? 'You must be within the radius to enable this action' : 'Perform action'}
                >
                    Confirm Attendance (Enabled when Inside Radius)
                </button>
            </div>
        </div>
    );
}

export default App;
