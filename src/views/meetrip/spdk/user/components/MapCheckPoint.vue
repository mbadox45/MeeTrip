<template>
    <div>
        <!-- <p class="mt-3">
            <i class="pi pi-arrow-right-arrow-left mr-2 text-xl text-red-500"></i> <strong class="mr-2 text-cyan-500">Distance :</strong> <span class="font-semibold">{{ jarak }} Meters</span>
        </p> -->
        <div ref="mapDiv" style="width: 100%; height: 500px;"></div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, defineEmits, defineProps } from 'vue';
    import { Loader } from '@googlemaps/js-api-loader';

    // API
    import User_PelaksanaService from '@/api/user/PelaksanaService';
    import { GOOGLE_MAPS_API_KEYS } from '@/api/env'
    import { getLongLat } from '@/api/gmaps/MapsService'

    // Components

    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])
    
    const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEYS;
    const loaders = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
    const mapDiv = ref(null);
    let map = ref(null);
    // const distances = ref(null);
    let distances = null;
    const jarak = ref(null)
    const load_data = props.data_dialog;
    
    onMounted(() => {
        onLoader();
    });
    
    const onLoader = async () => {
        await loaders.load();
        const id_place = await getLongLat(load_data[0].place_id)
        const id_place1 = await getLongLat(load_data[1].place_id)
        map.value = new google.maps.Map(mapDiv.value, {
            center: {lat: 0, lng:117.200642},
            zoom: 5,
        });
      
        // Add a marker for the current position
        const markers = [];
        markers.push(createMarker(id_place, map.value, `<div style="width:200px;"><h6>${load_data[0].name} <br><small>Destination</small></h6> <small>${load_data[0].address} <br><strong>${load_data[0].latitude.toFixed(6)}, ${load_data[0].longitude.toFixed(6)}</strong></small> </div>`));
        markers.push(createMarker2(id_place1, map.value, `<div style="width:200px;"><h6>${load_data[1].name} <br><small>My Location</small></h6> <small>${load_data[1].address} <br><strong>${load_data[1].latitude.toFixed(6)}, ${load_data[1].longitude.toFixed(6)}</strong></small> </div>`));

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

        const circle = new google.maps.Circle({
            map: map.value,
            center: id_place,
            radius: 500, // Set the radius in meters (adjust as needed)
            fillColor: '#F1948A', // Set the fill color
            fillOpacity: 0.3, // Set the fill opacity
            strokeColor: '#F1948A', // Set the stroke color
            strokeOpacity: 0.8, // Set the stroke opacity
            strokeWeight: 0.3, // Set the stroke weight
        });

        // Find the bounds that contains all markers and the circle
        bounds.union(circle.getBounds());

        // Call fitBounds with the calculated bounds
        map.value.fitBounds(bounds);
        // distances = await calculateDistance(markers[0].getPosition(), markers[1].getPosition())
        jarak.value = parseFloat(Number(await calculateDistance(markers[0].getPosition(), markers[1].getPosition())).toFixed(2));
        // console.log(jarak.value)
    };

    const createMarker = (latlng, map, label) => {
        const infoWindow = new google.maps.InfoWindow();
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url:'/layout/meetrip.png',
                anchor: new google.maps.Point(25, 25),
                scaledSize: new google.maps.Size(50, 50),
            }
            // label: label,
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.setContent(label);
            infoWindow.open(map, marker);
        });

        return marker;
    };

    const createMarker2 = (latlng, map, label) => {
        const infoWindow = new google.maps.InfoWindow();
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.setContent(label);
            infoWindow.open(map, marker);
        });

        return marker;
    };

    const calculateDistance = async (latLng1, latLng2) => {
        return google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
    };
    
    const submit = async() => {
        try {
            const distance = distances
            console.log(distance)
            if (distance > 100) {
                emit('submit','luar')
                console.log('luar')
            } else {
                const response = await User_PelaksanaService.putAttendSPDK(load_data[1].id, {current_latitude: load_data[1].latitude, current_longitude: load_data[1].longitude});
                const data = response.data;
                // console.log(response)
                if (data.status == true) {
                    emit('submit','success')
                } else {
                    emit('submit','error')
                }
            }
        } catch (error) {
            emit('submit','distance_out')
        }
        
    }
</script>
  