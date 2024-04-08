<script setup>
    import { ref, defineProps, onMounted } from 'vue';
    import moment from 'moment';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService';
    import { getDescLoc, getLocationName } from '@/api/gmaps/MapsService'
    import { kendaraan } from '@/api/Databodong';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
    const loading = ref(false);
    // const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const loads = ref({name:null, jabatan:null, wilayah:null, nomor_surat:null, atasan:null, lama_hari:null, berangkat:null, kembali: null, info: null, pemberitugas:null, kendaraan:null, keperluan:null})
    const destination = ref([])
    const destination2 = ref(null)

    const load_data = async () => {
        loading.value = true;
        try {
            const response = await User_SpdkFormService.getDetailMySPDK(datas.id)
            const load = response.data.data
            const transport = kendaraan.find(item => item.kendaraan == load.kendaraan)
            console.log(load);
            // Loads
            loads.value.name = load.user.name;
            loads.value.jabatan = load.jabatan;
            loads.value.atasan = '-';
            loads.value.pemberitugas = load.pemberiTugas.name;
            loads.value.info = load.info;
            loads.value.nomor_surat = load.nomor_surat;
            loads.value.lama_hari = load.lama_hari;
            loads.value.keperluan = load.keperluan;
            loads.value.berangkat = moment(`${load.tgl_berangkat} ${load.jam_pergi}`).format('DD MMM YYYY - HH:mm:ss');
            loads.value.kembali =  moment(`${load.tgl_kembali} ${load.jam_pergi}`).format('DD MMM YYYY - HH:mm:ss');
            loads.value.kendaraan = transport.name;

            // Destination
            if (load.destinations.length > 0) {
                loads.value.wilayah = load.wilayah == '1' ? 'Within the region' : load.wilayah == '2' ? 'Outside the region' : 'Abroad';
                const get_placestart = await getLocationName(load.destinations[0].start_latitude, load.destinations[0].start_longitude);
                const placestart = await getDescLoc(get_placestart.place_id)
                destination.value[0]= {
                    description: get_placestart.formatted_address,
                    place_id: get_placestart.place_id,
                    main_text: placestart.name,
                    placeholder: 'Start Location',
                    color: 'pink',
                }
                // console.log(loads.value);
                const dest = load.destinations;
                for (let i = 0; i < dest.length; i++) {
                    const get_placestart = await getLocationName(dest[i].latitude, dest[i].longitude);
                    const placestart = await getDescLoc(get_placestart.place_id)
                    if (dest.length > 1) {
                        destination.value[i+1]= {
                            description: get_placestart.formatted_address,
                            place_id: get_placestart.place_id,
                            main_text: placestart.name,
                            placeholder: `Destination Location - ${i+1}`,
                            color: 'green',
                        }
                    } else {
                        destination.value[i+1]= {
                            description: get_placestart.formatted_address,
                            place_id: get_placestart.place_id,
                            main_text: placestart.name,
                            placeholder: 'Destination Location',
                            color: 'green',
                        }
                    }
                }
            } else {
                loads.value.wilayah = load.wilayah.toUpperCase();
                destination2.value = load.tujuan;
            }
            loading.value = false;
        } catch (error) {
            loads.value = {}
            loading.value = false;
        }
    }

    onMounted(() => {
        load_data()
    });

</script>
<template>
    <div v-show="loading == true" class="text-center">
        <h3>Loading...</h3>
        <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>
    <div class="mt-2 md:mt-0" v-show="loading == false">
        <Divider align="left" type="solid">
            <span class="font-bold text-lg text-yellow-500"><i class="pi pi-user mr-2"></i> DETAIL USER</span>
        </Divider>
        <div class="grid mt-2">
            <div class="col-12 md:col-6 grid">
                <div class="col-4 font-semibold">Number</div>
                <div class="col-8">: {{ loads.nomor_surat }}</div>
                <div class="col-4 font-semibold">User Name</div>
                <div class="col-8">: {{ loads.name }}</div>
                <div class="col-4 font-semibold">Position</div>
                <div class="col-8">: {{ loads.jabatan }}</div>
                <div class="col-4 font-semibold">Assignor</div>
                <div class="col-8">: {{ loads.pemberitugas }}</div>
            </div>
            <div class="col-12 md:col-6 grid">
                <div class="col-4 font-semibold">Transport Type</div>
                <div class="col-8">: {{ loads.kendaraan }}</div>
                <div class="col-4 font-semibold">Departure</div>
                <div class="col-8">: {{ loads.berangkat }} WIB</div>
                <div class="col-4 font-semibold">Arrival</div>
                <div class="col-8">: {{ loads.kembali }} WIB</div>
                <div class="col-4 font-semibold">Duration</div>
                <div class="col-8">: {{ loads.lama_hari }} {{loads.lama_hari > 1 ? 'Days': 'Day'}}</div>
            </div>
        </div>
        <Divider align="left" type="solid">
            <span class="font-bold text-lg text-yellow-500"><i class="pi pi-map mr-2"></i> DESTINATION</span>
        </Divider>
        <p><span class="font-semibold">REGION <i class="pi pi-angle-double-right mx-2"></i> {{ loads.wilayah }}</span></p>
        <div>
            <div v-if="destination.length < 1">
                <p :class="`font-medium align-items-center bg-green-100 p-1 border-round`"><i class="pi pi-map-marker mr-2" :class="`text-green-500`"></i> <span :class="`text-green-500`">DESTINATION</span> : </p>
                <span class="ml-5 font-semibold">{{ destination2 }}</span>
            </div>
            <div v-else v-for="(location, index) in destination" :key="index" class="mb-4">
                <p :class="`font-medium align-items-center bg-${location.color}-100 p-1 border-round`"><i class="pi pi-map-marker mr-2" :class="`text-${location.color}-500`"></i> <span :class="`text-${location.color}-500`">{{ location.placeholder.toUpperCase() }}</span> : </p>
                <span class="ml-5 font-semibold">{{ location.main_text }} - <span class="font-light">{{ location.description }}</span></span>
            </div>
        </div>
        <Divider align="left" type="solid">
            <span class="font-bold text-lg text-yellow-500"><i class="pi pi-shield mr-2"></i> ETC</span>
        </Divider>
        <div class="grid">
            <div class="col-4 md:col-2 font-semibold">Needs</div>
            <div class="col-8 md:col-10">: {{ loads.keperluan }}</div>
            <div class="col-4 md:col-2 font-semibold">Info</div>
            <div class="col-8 md:col-10">: <span class="text-red-500 font-semibold">{{ loads.info }}</span></div>
        </div>
    </div>
</template>