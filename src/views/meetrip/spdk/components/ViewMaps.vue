<template>
    <div>
        <div ref="mapDiv" style="width: 100%; height: 500px;"></div>
        <div class="p-fluid">
            <p>Current Address: {{ currentAddress }}</p>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, onUnmounted, watch, computed, defineProps } from 'vue';
    import { Loader } from '@googlemaps/js-api-loader';
    import axios from 'axios';

    // Components
    import { GOOGLE_MAPS_API_KEYS } from '@/api/env'
    import { useGeolocation } from './useGeolocation';

    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });
    
    const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEYS;
    const loaders = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
    const mapDiv = ref(null);
    let map = ref(null);
    let currMarker = null;
    const load_data = props.data_dialog;
    
    const { coords } = useGeolocation();
    const currPos = computed(() => ({
        lat: coords.value.latitude,
        lng: coords.value.longitude,
    }));
    
    // Store the addresses
    const currentAddress = ref(null);
    
    // Autocomplete variables
    const searchQuery = ref('');
    const searchResults = ref([]);
    
    onMounted(() => {
        onLoader();
    });
    
    const onLoader = async () => {
        await loaders.load();
        const id_place = await getLongLat(load_data[0].locate.place_id)
        map.value = new google.maps.Map(mapDiv.value, {
            center: id_place,
            zoom: 5,
        });
      
        // Add a marker for the current position
        currMarker = new google.maps.Marker({
            position: currPos.value,
            map: map.value,
            title: 'Current Position',
        });


        for (let i = 0; i < load_data.length; i++) {
            const place = load_data[i].locate.place_id
            const longlat = await getLongLat(place)
            console.log(longlat)
            new google.maps.Marker({
                position: longlat,
                map: map.value,
                title: 'Current Position',
            });
        }
        // Reverse geocode the current position
        reverseGeocode(currPos.value, currentAddress);
    };

    const getLongLat = async(place) => {
        const response = await axios.get('http://localhost:3031/v1/api/maps/by_place_id', {
            params: {
                place_id: place,
                fields: 'geometry',
                key: GOOGLE_MAPS_API_KEY,
            },
        });
        const result = response.data.data.result;
        return result.geometry.location;
    }
    
    // Function to perform reverse geocoding
    const reverseGeocode = async (position, addressRef) => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                  latlng: `${position.lat},${position.lng}`,
                  key: GOOGLE_MAPS_API_KEY,
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
    
    // Function to clear markers from the map
    const clearMarkers = () => {
        if (map.value) {
            map.value.markers.forEach((marker) => {
              marker.setMap(null);
            });
        }
    };
</script>
  