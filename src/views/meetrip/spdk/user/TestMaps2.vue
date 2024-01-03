<template>
    <div>
      <div ref="mapDiv" style="width: 100%; height: 500px;"></div>
      <div class="p-fluid">
        <p>Current Address: {{ currentAddress }}</p>
        <!-- <input v-model="searchQuery" @input="onSearchInput" placeholder="Search for a place" /> -->
        <AutoComplete v-model="searchQuery" class="w-full" :suggestions="searchResults" @complete="onSearchInput" optionLabel="description"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  import axios from 'axios';
  import { useGeolocation } from './components/useGeolocation';
  
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDPjOjHUhjHkSMDAyD4Of6yhvV6ZwwBojM';
  const loaders = new Loader({ apiKey: GOOGLE_MAPS_API_KEY });
  const mapDiv = ref(null);
  let map = ref(null);
  let currMarker = null;
  let clickListener = null;
  
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
  
  onUnmounted(() => {
    if (clickListener) {
      clickListener.remove();
    }
  });
  
  const onLoader = async () => {
    await loaders.load();
    map.value = new google.maps.Map(mapDiv.value, {
      center: currPos.value,
      zoom: 7,
    });
  
    // Add a marker for the current position
    currMarker = new google.maps.Marker({
      position: currPos.value,
      map: map.value,
      title: 'Current Position',
    });
  
    // Reverse geocode the current position
    reverseGeocode(currPos.value, currentAddress);
  
    // Listen for click events on the map
    clickListener = map.value.addListener('click', ({ latLng }) => {
      // Clear existing markers
      clearMarkers();
  
      // Add a new marker for the clicked position
      const clickedMarker = new google.maps.Marker({
        position: latLng,
        map: map.value,
        title: 'Clicked Position',
      });
  
      // Reverse geocode the clicked position
      reverseGeocode({ lat: latLng.lat(), lng: latLng.lng() }, currentAddress);
    });
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
  
  // Function to handle input in the search box
  const onSearchInput = async () => {
    try {
      const response = await axios.get('http://localhost:3031/v1/api/maps/place_predictions', {
        params: {
          input: searchQuery.value,
        //   input: 'monas',
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      const data = response.data.data.predictions;
      const list = [];
      for (let i = 0; i < data.length; i++) {
        list[i] = {
            description: data[i].description,
            place_id: data[i].place_id,
            main_text: data[i].structured_formatting.main_text,
        }
      }
  
      searchResults.value = list;
      console,log(searchResults.value)
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };
  
  // Function to handle place selection from the search results
  const onPlaceSelect = (place) => {
    // Clear existing markers
    clearMarkers();
  
    // Fetch details for the selected place
    getPlaceDetails(place.place_id);
  };
  
  // Function to get details for a place using its place_id
  const getPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          key: GOOGLE_MAPS_API_KEY,
        },
      });
  
      const place = response.data.result;
      if (place) {
        // Add a marker for the selected place
        const selectedMarker = new google.maps.Marker({
          position: place.geometry.location,
          map: map.value,
          title: place.name,
        });
  
        // Reverse geocode the selected place
        reverseGeocode(place.geometry.location, currentAddress);
      }
    } catch (error) {
      console.error('Error fetching place details:', error.message);
    }
  };
  </script>
  