import { useState, useEffect } from 'react';

interface GeolocationData {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    timestamp: number | null;
    address: string | null;
    error: string | null;
}

export function useGeolocation() {
    const [location, setLocation] = useState<GeolocationData>({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        address: null,
        error: null
    });
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser'
            }));
            return;
        }

        setLoading(true);
        setLocation(prev => ({ ...prev, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Try to get address from coordinates (reverse geocoding)
                let address = null;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    address = data.display_name || null;
                } catch (err) {
                    console.log('Could not fetch address:', err);
                }

                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                    timestamp: position.timestamp,
                    address,
                    error: null
                });
                setLoading(false);
            },
            (error) => {
                let errorMessage = 'Unknown error occurred';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setLocation(prev => ({
                    ...prev,
                    error: errorMessage
                }));
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Auto-get location on mount
    useEffect(() => {
        getLocation();
    }, []);

    return {
        location,
        loading,
        refreshLocation: getLocation
    };
}
