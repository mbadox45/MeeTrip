<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import axios from 'axios';

    // Components
    import { useGeolocation } from './components/useGeolocation'
    import { Loader } from '@googlemaps/js-api-loader';

    // Coordinate PT INL
    const center2 = ref({ latitude: 3.132010, longitude: 99.342732 });

    // Coordinate My Home
    const center = ref({ lat:3.170170, lng: 99.339503 });
    // const center = { lat: 3.170115, lng: 99.339445 }
    const loc_now = ref({ lat: 3.170115, lng: 99.339445 })

    const locations = ref([
        {position:{ lat: center.value.lat, lng: center.value.lng }, info:'Start Location'},
    ])
    const startLoc = ref(null);
    const listStartLoc = ref(null);
    const destinationLoc = ref(null);
    const listDestinationLoc = ref([]);
    const directions = ref(null);
    const zoom = ref(12);
    const api_keys = ref('AIzaSyDPjOjHUhjHkSMDAyD4Of6yhvV6ZwwBojM');
    const flightPlanCoordinates = ref(null);
    const flightPath = ref({});

    const GOOGLE_MAPS_API_KEY = 'AIzaSyDPjOjHUhjHkSMDAyD4Of6yhvV6ZwwBojM';
    const loaders = new Loader({apiKey:GOOGLE_MAPS_API_KEY});
    const otherPos = ref(null)
    const mapDiv = ref(null);
    let map = ref(null)
    let currMarker = null;
    let clickListener = null
    
    // Store the addresses
    const currentAddress = ref(null);
    const otherAddress = ref(null);

    const {coords} = useGeolocation();
    const currPos = computed(() => ({
        lat: coords.value.latitude,
        lng: coords.value.longitude
    }))

    onMounted(() => {
        onLoader();
    });
    onUnmounted( async() => {
        if (clickListener) {
            clickListener.remove()
        }
    });

    // Kondisi Kedua
    const onLoader = async () => {
        await loaders.load()
        map.value = new google.maps.Map(mapDiv.value, {
            center: currPos.value,
            zoom: 10
        })
        // Add a marker for the current position
        currMarker = new google.maps.Marker({
            position: currPos.value,
            map: map.value,
            title: 'Current Position',
        });

        // Reverse geocode the current position
        reverseGeocode(currPos.value, currentAddress);

        clickListener = map.value.addListener( 'click', ({latLng: {lat,lng}}) => {
            otherPos.value = {lat: lat(), lng:lng()}
            reverseGeocode(otherPos.value, otherAddress);
        })
    }
    
    let line = null
    watch([map, currPos, otherPos], () => {
        if (line) {
            line.setMap(null)
        }
        if (map.value && otherPos.value != null) {
            line = new google.maps.Marker({
                // path:[currPos.value, otherPos.value],
                position:otherPos.value,
                map: map.value,
                title: 'Marker Title'
            })
        }
    })

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
            } else {
                addressRef.value = 'Address not found';
            }
        } catch (error) {
            console.error('Error fetching address:', error.message);
        }
    };

    const searchStartLoc = () => {
        listStartLoc.value = [
            { label: 'Your Location', value: 'Your Location', lat:loc_now.value.lat, lng:loc_now.value.lng, icon:true },
            { label: 'Medan', value: 'Medan', lat: 3.595138, lng: 98.672307 },
            { label: 'Berastagi', value: 'Berastagi', lat: 3.188807, lng: 98.509589 },
            { label: 'Bekasi', value: 'Bekasi', lat:-6.250883, lng:106.978775 },
        ]
    }
    const searchDestinationLoc = () => {
        listDestinationLoc.value = [
            { label: 'Medan', value: 'Medan', lat: 3.595138, lng: 98.672307 },
            { label: 'Berastagi', value: 'Berastagi', lat: 3.188807, lng: 98.509589 },
            { label: 'Bekasi', value: 'Bekasi', lat:-6.250883, lng:106.978775 },
        ]
    }

    // Kondisi Pertama
    const coordinate_device_position = () => {
        // Check if the Geolocation API is available
        if ('geolocation' in navigator) {
            // Request the user's current location
            navigator.geolocation.getCurrentPosition(
            (position) => {
                // Set the user's location as the center of the map
                loc_now.value = { lat: position.coords.latitude, lng: position.coords.longitude };
            },
            (error) => {
                console.error('Error getting user location:', error.message);
            }
            );
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    }

    const testing = () => {
        if (destinationLoc.value != null && !startLoc.value !=null) {
            locations.value = [
                {position:{lat:startLoc.value.lat, lng:startLoc.value.lng}, info:'Start Location', label: '1'},
                {position:{lat:destinationLoc.value.lat, lng:destinationLoc.value.lng}, info:'Destination Location', label: '2'},
            ]
            getDirections()
        } else {
            zoom.value = 12;
            locations.value = [
                {position:loc_now.value, info:'Start Location'},
            ]
        }
    }

    const getDirections = async () => {
        try {
            const response = await axios.get('http://localhost:3031/v1/api/kendaraan/maps', {
            // const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin: `${startLoc.value.lat},${startLoc.value.lng}`,
                    destination: `${destinationLoc.value.lat},${destinationLoc.value.lng}`,
                    key: api_keys.value,
                },
            });
            const load = response.data;
            const rute = load.routes[0].legs[0].steps;
            const list = [];
            for (let i = 0; i < rute.length; i++) {
                list[i] = {lat:rute[i].end_location.lat, lng:rute[i].end_location.lng};
            }
            directions.value = load;

            flightPlanCoordinates.value = load.routes[0].legs[0].distance.value;
            flightPath.value = {
                path: list,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            }
            if (flightPlanCoordinates.value > 1701863) {
                zoom.value = 5;
            } else {
                zoom.value = 8;
            }
            // Now you can use the directions data as needed
            console.log(directions.value);
            console.log(list);
        } catch (error) {
            console.error('Error fetching directions:', error.message);
        }
    };

</script>
<template>
    <div class="">
        
    </div>
</template>