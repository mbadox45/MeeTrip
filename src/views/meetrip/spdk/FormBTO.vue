<script setup>
    import { ref, onMounted } from 'vue';
    import moment from 'moment';
    import axios from 'axios';

    // Components
    import ViewMaps from './components/ViewMaps.vue'

    // API
    import { kendaraan, down_payment } from '@/api/Databodong';
    import UserService from '@/api/UserService'

    // Variable
    const list_atasan = ref([]);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, atasan_id:null, keperluan:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', lama_hari:null, barang:null, kendaraan:null, lokasi:[], rombongan:'', uang_panjar: null})
    const kendaraan_list = ref(kendaraan);
    const dp_list = ref(down_payment);
    const visible = ref(false);
    const start_location = ref('')
    const list_start_location = ref([])

    const GOOGLE_MAPS_API_KEY = 'AIzaSyDPjOjHUhjHkSMDAyD4Of6yhvV6ZwwBojM';


    const load_data = async () => {
        loadUser();
        reset_form();
    }

    const perhitungan_waktu = (t_berangkat, j_berangkat, t_sampai, j_sampai) => {
        // Assuming t_berangkat, j_berangkat, t_sampai, and j_sampai are strings
        const w_berangkat = moment(`${t_berangkat} ${j_berangkat}`);
        const w_sampai = moment(`${t_sampai} ${j_sampai}`);

        // Calculate the difference in days
        const durationInDays = w_sampai.diff(w_berangkat, 'days');

        return durationInDays;

        // console.log(`Duration: ${durationInDays} days`);
    };

    onMounted(() => {
        load_data()
    });

    const reset_form = () => {
        form.value = {
            id:null, 
            atasan_id:null, 
            keperluan:'', 
            tgl_berangkat:null, 
            tgl_kembali:null, 
            barang:null, 
            rombongan:''
        }
    }

    const loadUser = async() => {
        try {
            const response = await UserService.getUsers();
            const load = response.data;
            const data = load.data;
            list_atasan.value = []
            for (let i = 0; i < data.length; i++) {
                const grade = Number(data[i].grade)
                // if (grade >= 3 && data[i].departemen == payload.value.division.divisi) {
                if (grade >= 3) {
                    if (grade > Number(payload.value.grade)) {
                        list_atasan.value.push({
                            id: data[i].id,
                            name: data[i].name +' - '+data[i].divisi,
                            grade: grade,
                        })
                    }
                }
            }
            // console.log(list_atasan.value, Number(payload.value.grade))
        } catch (error) {
            list_atasan.value = []
            console.log(error);
        }
    }

    // Show Dialog Maps
    const viewMap = () => {
        visible.value = true;
    }

    // Search Location By GMaps API
    const onSearchInput = async () => {
        try {
            const response = await axios.get('http://localhost:3031/v1/api/maps/place_predictions', {
                params: {
                input: start_location.value,
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
        
            list_start_location.value = list;
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    };

    // Post Data to BE_API
    const postData = async (ket) => {
        form.value.lama_hari = perhitungan_waktu(form.value.tgl_berangkat, form.value.jam_pergi, form.value.tgl_kembali, form.value.jam_sampai) - 1
        console.log(form.value.lama_hari)
    }

</script>
<template>
    <form class="">
        <Dialog v-model:visible="visible" :draggable="false" header="View Maps" modal :style="{ width: '80rem' }">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">
                    <i class="pi pi-map"></i>
                    <span class="font-bold white-space-nowrap">View Maps</span>
                </div>
            </template>
            <view-maps/>
        </Dialog>
        <div class="flex align-items-center justify-content-end md:justify-content-between mb-5 px-2">
            <div class="">
                <i class="mr-4 text-2xl md:text-5xl pi pi-ticket"></i>
                <strong class="text-2xl md:text-5xl font-normal">Form BTO</strong>
            </div>
            <div class="hidden md:block">
                <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> My BTO <i class="pi pi-angle-double-right mx-2"></i> Form BTO</strong>
            </div>
        </div>
        <div class="card shadow-4">
            <div class="grid">
                <div class="col-12 md:col-12 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">ASSIGNOR</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-rolodex" viewBox="0 0 16 16">
                                <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                                <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1H1Zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1V2Z"/>
                            </svg>
                        </span>
                        <Dropdown v-model="form.atasan_id" :options="list_atasan" filter optionLabel="name" optionValue="id" placeholder="Choose a assignor" class="w-full">e> -->
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <Avatar icon="pi pi-user" style="background-color: #E59866 color: #ffffff" class="mr-2" shape="circle" />
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="col-12 md:col-12">
                    <p class="text-lg font-semibold text-gray-500">ROUTE TRIP <small class="border-1 py-1 px-2 border-round ml-3 text-sm text-orange-500 cursor-pointer hover:text-teal-500" @click="viewMap()"><i class="pi pi-map mr-2"></i> View Maps</small></p>
                    <div class="border-2 border-round border-bluegray-200 p-3">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon bg-pink-500 text-white">
                                <i class="pi pi-map-marker"></i>
                            </span>
                            <AutoComplete v-model="start_location" :suggestions="list_start_location" @complete="onSearchInput" class="w-full" optionLabel="description" placeholder="Pick up location"/>
                        </div>
                        <div class="p-inputgroup mt-3">
                            <span class="p-inputgroup-addon bg-cyan-500 text-white">
                                <i class="pi pi-map-marker"></i>
                            </span>
                            <AutoComplete class="w-full" optionLabel="description" placeholder="Destination location"/>
                            <Button icon="pi pi-plus" severity="info"></Button>
                            <Button icon="pi pi-minus" severity="warning"></Button>
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-6 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">DEPARTURE</p>
                    <div class="grid">
                        <div class="col-12 md:6">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-calendar"></i>
                                </span>
                                <InputText type="date" v-model="form.tgl_berangkat" placeholder=""/>
                            </div>
                        </div>
                        <div class="col-12 md:6">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-clock"></i>
                                </span>
                                <InputText type="time" v-model="form.jam_pergi" placeholder=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-6 border-left-1 border-cyan-100 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">ARRIVAL</p>
                    <div class="grid">
                        <div class="col-12 md:6">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-calendar"></i>
                                </span>
                                <InputText type="date" v-model="form.tgl_kembali" placeholder=""/>
                            </div>
                        </div>
                        <div class="col-12 md:6">
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">
                                    <i class="pi pi-clock"></i>
                                </span>
                                <InputText type="time" v-model="form.jam_sampai" placeholder=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 md:col-4 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">STUFFS</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-briefcase"></i>
                        </span>
                        <InputText v-model="form.jam_sampai" placeholder="Exp: clothes, files, laptop, etc.."/>
                    </div>
                </div>
                <div class="col-12 md:col-4 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">ENTOURAGE</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-users"></i>
                        </span>
                        <InputText v-model="form.jam_sampai" placeholder="Exp: Rombongan komunitas"/>
                    </div>
                </div>
                <div class="col-12 md:col-4 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">TRANSPORT</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-car"></i>
                        </span>
                        <Dropdown v-model="form.kendaraan" :options="kendaraan_list" optionLabel="name" optionValue="name" placeholder="Select a Transportation" class="">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <span v-html="slotProps.option.icon"></span>
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div class="grid align-items-center">
                <div class="col-12 md:col-12">
                    <p class="text-lg font-semibold text-gray-500">NECESSARY</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-bookmark"></i>
                        </span>
                        <Textarea v-model="form.keperluan" rows="4" cols="30" placeholder="Exp: Training Argo LPP"/>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <p class="text-lg font-semibold text-gray-500">DOWN PAYMENT</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-bookmark"></i>
                        </span>
                        <Dropdown v-model="form.uang_panjar" :options="dp_list" optionLabel="name" optionValue="value" placeholder="Select a Transportation" class="">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <span v-html="slotProps.option.icon"></span>
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <p class="text-lg font-semibold text-gray-500">ATTACHMENT</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-file-import"></i>
                        </span>
                        <InputText type="file" v-model="form.jam_sampai" placeholder="Exp: Rombongan komunitas"/>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex gap-2">
                        <Button label="Back" severity="secondary" icon="pi pi-times" outlined />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex justify-content-end gap-2">
                        <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                        <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>