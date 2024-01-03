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
    import { getLongLat } from '@/api/gmaps/MapsService'
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
            center: {lat: 0, lng:117.200642},
            zoom: 5,
        });
      
        // Add a marker for the current position
        const markers = [];
        // markers.push(new google.maps.Marker({
        //     position: id_place,
        //     map: map.value,
        //     title: 'Current Position',
        // }));
        markers.push(createMarker(id_place, map.value, `<div style="width:200px;"><h6>${load_data[0].locate.main_text} <br><small>Start Location</small></h6> <small>${load_data[0].locate.description} <br><strong>${id_place.lat.toFixed(6)}, ${id_place.lng.toFixed(6)}</strong></small> </div>`));

        // with Polyline
        const polyline = new google.maps.Polyline({
            map: map.value,
            path: markers.map(marker => marker.getPosition()),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });


        for (let i = 1; i < load_data.length; i++) {
            const place = load_data[i].locate.place_id
            const longlat = await getLongLat(place)
            console.log(longlat);
            // markers.push(new google.maps.Marker({
            //     position: longlat,
            //     map: map.value,
            //     title: 'Current Position',
            // }));
            markers.push(createMarker(longlat, map.value, `<div style="width:200px;"><h6>${load_data[i].locate.main_text} <br><small>Destination ${i}</small></h6> <small>${load_data[i].locate.description} <br><strong>${longlat.lat.toFixed(6)}, ${longlat.lng.toFixed(6)}</strong></small> </div>`));
        }

        // Update polyline path to include new markers
        polyline.setPath(markers.map(marker => marker.getPosition()));

        // Find the bounds that contains all markers
        var latMax = -Infinity;
        var lngMax = -Infinity;
        var latMin = Infinity;
        var lngMin = Infinity;

        for (var i = 0; i < markers.length; i++) {
            var lat = markers[i].getPosition().lat();
            var lng = markers[i].getPosition().lng();

            if (lat > latMax) {
                latMax = lat;
            }
            if (lng > lngMax) {
                lngMax = lng;
            }
            if (lat < latMin) {
                latMin = lat;
            }
            if (lng < lngMin) {
                lngMin = lng;
            }
        }

        // Create a LatLngBounds with the calculated coordinates
        var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(latMin, lngMin),
            new google.maps.LatLng(latMax, lngMax)
        );

        // Call fitBounds with the calculated bounds
        map.value.fitBounds(bounds);

        // Reverse geocode the current position
        reverseGeocode(currPos.value, currentAddress);
    };

    const createMarker = (latlng, map, label) => {
        const infoWindow = new google.maps.InfoWindow();
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            // label: label,
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.setContent(label);
            infoWindow.open(map, marker);
        });

        // google.maps.event.addListener(marker, 'mouseout', () => {
        //     infoWindow.close();
        // });

        return marker;
    };
    
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
  