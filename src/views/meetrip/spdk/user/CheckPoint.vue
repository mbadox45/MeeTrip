<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';
    import axios from 'axios';

    // API
    import User_PelaksanaService from '@/api/user/PelaksanaService';
    import User_SpdkFormService from '@/api/user/SpdkFormService';
    import { GOOGLE_MAPS_API_KEYS } from '@/api/env'
    import { getDescLoc, getLocationName } from '@/api/gmaps/MapsService'

    // Components
    import MapCheckPoint from '@/views/meetrip/spdk/user/components/MapCheckPoint.vue'
    import { useGeolocation } from '@/views/meetrip/spdk/user/components/useGeolocation';

    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    const { coords } = useGeolocation();

    const id = route.params.id
    const loads = ref({id:id, name:null, nomor:null, jabatan: null, tgl_berangkat:null, tgl_kembali:null, pemberitugas:null, destinations:null})
    const destination = ref([])

    const load_data = async () => {
        const response = await User_SpdkFormService.getDetailMySPDK(id);
        const data = response.data.data
        loads.value = {
            id: id,
            name: data.user.name,
            jabatan: data.jabatan,
            pemberitugas: data.pemberiTugas.name,
            nomor: data.nomor_surat,
            destinations: data.destinations,
            tgl_berangkat: moment(`${data.tgl_berangkat} ${data.jam_pergi}`).format('DD MMM YYYY, HH:mm:ss'),
            tgl_kembali: moment(`${data.tgl_kembali} ${data.jam_sampai}`).format('DD MMM YYYY, HH:mm:ss'),
        }
        await viewmaps_destination(data.destinations)
    }

    const viewmaps_destination = async(data) => {
        if (data.length > 0) {
            const list = []
            const get_placenow = await getLocationName(coords.value.latitude, coords.value.longitude)
            const placenow = await getDescLoc(get_placenow.place_id)
            for (let i = 0; i < data.length; i++) {
                const get_placeid = await getLocationName(data[i].latitude, data[i].longitude)
                const place = await getDescLoc(get_placeid.place_id)
                list[i] = {
                    location: [
                        {id:data[i].id, place_id:get_placeid.place_id, latitude: get_placeid.geometry.location.lat, longitude: get_placeid.geometry.location.lng, address: get_placeid.formatted_address, name: place.name},
                        {id:data[i].id, place_id:get_placenow.place_id, latitude: get_placenow.geometry.location.lat, longitude: get_placenow.geometry.location.lng, address: get_placenow.formatted_address, name: placenow.name,}
                    ],
                    name: place.name,
                    attend: data[i].attend,
                }
            }
            destination.value = list
            console.log(destination.value)
        } else {
            destination.value = []
        }
    }

    onMounted(() => {
        load_data()
    });

    const postData = async (id_dest, data_dest) => {
        console.log(id_dest, data_dest)
        // data_dest = {
        //     current_latitude : 3.1319965,
        //     current_longitude : 99.3425704
        // }
        try {
            const response = await User_PelaksanaService.putAttendSPDK(id_dest, data_dest);
            const data = response.data;
            console.log(response)
            if (data.success == true) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Check point successfully`, life: 3000 });
                load_data()
            } else {
                toast.add({ severity: 'warn', summary: 'Warning', detail: `You are out of reach of your destination location`, life: 3000 });
            }
        } catch (error) {
            toast.add({ severity: 'danger', summary: 'Attention', detail: `Cannot attend when the distance is greater than 100 meters.`, life: 3000 });
        }
    }
</script>

<template>
    <Toast/>
    <div class="flex align-items-center justify-content-end md:justify-content-between mb-5 px-2">
        <div class="">
            <i class="mr-4 text-2xl md:text-5xl pi pi-star text-yellow-500"></i>
            <strong class="text-2xl md:text-5xl font-normal">Check Point</strong>
        </div>
        <div class="hidden md:block">
            <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> My BTO <i class="pi pi-angle-double-right mx-2"></i> Check Point</strong>
        </div>
    </div>
    <div class="card shadow-4">
        <div class="grid align-items-centers px-3">
            <div class="col-12 md:col-6 grid">
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Name</strong>
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> {{ loads.name }}
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Position</strong>
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> {{ loads.jabatan }}
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Assignor</strong> 
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> {{ loads.pemberitugas }}
                </div>
            </div>
            <div class="col-12 md:col-6 grid">
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Number</strong>
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> <strong class="text-yellow-500">{{ loads.nomor }}</strong>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Departure</strong> 
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> {{ loads.tgl_berangkat }} WIB
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <strong>Arrival</strong> 
                </div>
                <div class="col-12 md:col-9 p-fluid">
                    <strong class="mr-2">:</strong> {{ loads.tgl_kembali }} WIB
                </div>
            </div>
        </div>
        <Button label="Finish" severity="success" icon="pi pi-check" v-show="destination.length < 1"/>
        <Divider align="center" type="dotted" v-if="destination.length > 0">
            <strong>DESTINATION <span class="text-gray-400">-</span> <span class="text-pink-500">CHECK POINT</span></strong>
        </Divider>
        <Panel toggleable v-show="destination.length > 0" v-for="(lokasi, index) in destination" :key="index">
            <template #header>
                <strong class="font-semibold text-gray-500"><i class="pi pi-map-marker mr-2 text-pink-500 font-bold"></i> {{ lokasi.name.toUpperCase() }} <small v-show="lokasi.attend == true" class="ml-3 text-green-500">Done</small></strong>
            </template>
            <div class="flex align-items-center">
                <div class="w-full">
                    <p>
                        <i class="pi pi-map-marker mr-2 text-xl text-red-500"></i> <strong class="mr-2 text-green-500">My Location :</strong>{{ lokasi.location[1].name }} - {{ lokasi.location[1].address }}
                    </p>
                    <p>
                        <i class="pi pi-building mr-2 text-xl text-red-500"></i> <strong class="mr-2 text-yellow-500">Destination :</strong>{{ lokasi.location[0].name }} - {{ lokasi.location[0].address }}
                    </p>
                </div>
                <div class="w-full text-left md:text-right">
                    <Button v-if="lokasi.attend == false" label="Check Point" icon="pi pi-compass" class="mb-2" @click="postData(lokasi.location[1].id,{current_latitude: lokasi.location[1].latitude, current_longitude: lokasi.location[1].longitude})"/>
                    <span v-else class="text-green-500"><i class="pi pi-check mx-2 font-bold"></i>Check Point is <strong>Done</strong></span>
                </div>
            </div>
            <map-check-point :data_dialog="lokasi.location"/>
        </Panel>
        <Button label="Back" severity="secondary" icon="pi pi-times" outlined class="mt-4" @click="router.back()"/>
    </div>
</template>