import axios from 'axios';
import { GOOGLE_MAPS_API_KEYS, URL_MAPS_API } from '../env';

export const getLocationName = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${latitude},${longitude}`,
                key: GOOGLE_MAPS_API_KEYS,
            },
        });

        const locationName = response.data.results[0];
        return locationName
    } catch (error) {
        return 'Error fetching location name'
    }
};

export const getLongLat = async(place) => {
    const response = await axios.get(`${URL_MAPS_API}v1/api/maps/by_place_id`, {
        params: {
            place_id: place,
            fields: 'geometry',
            key: GOOGLE_MAPS_API_KEYS,
        },
    });
    const result = response.data.data.result;
    return result.geometry.location;
}

export const getDescLoc = async(place) => {
    const response = await axios.get(`${URL_MAPS_API}v1/api/maps/bylnglat`, {
        params: {
            place_id: place,
            key: GOOGLE_MAPS_API_KEYS,
        },
    });
    const result = response.data.data.result;
    return result;
}

// Function to perform reverse geocoding
export const reverseGeocode = async (position, addressRef) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              latlng: `${position.lat},${position.lng}`,
              key: GOOGLE_MAPS_API_KEYS,
            },
        });
    
        const results = response.data.results;
        if (results && results.length > 0) {
            addressRef.value = results[0].formatted_address;
          // console.log(results)
        } else {
          addressRef.value = 'Address not found';
        }
    } catch (error) {
        console.error('Error fetching address:', error.message);
    }
};