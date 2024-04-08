<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';
    import axios from 'axios';

    // Components
    import ViewMaps from '@/views/meetrip/spdk/user/components/ViewMaps.vue'

    // API
    import UserService from '@/api/UserService'
    import User_SpdkFormService from '@/api/user/SpdkFormService'
    import Admin_SpdkAdminService from '@/api/admin/SpdkAdminService'
    import { getDescLoc, getLocationName } from '@/api/gmaps/MapsService'
    import { kendaraan, down_payment } from '@/api/Databodong';
    import { GOOGLE_MAPS_API_KEYS, URL_MAPS_API, URL_API } from '@/api/env';
    
    const route = useRoute();

    // Variable
    const formID = route.query.id
    const list_atasan = ref([]);
    const loading = ref(true);
    const roles = ref(localStorage.getItem('roles'));
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, atasan_id:null, lampiran:null, keperluan:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', lama_hari:null, barang:null, kendaraan:null, rombongan:'-', uang_panjar: 0, start_latitude:null, start_longitude:null, latitude:[], longitude:[]})
    const kendaraan_list = ref(kendaraan);
    const dp_list = ref(down_payment);
    const visible = ref(false);

    const disabled_dp = ref(false)
    const loading_input_dp = ref(false)

    // Variable for input route trip
    const location = ref([
        {locate:null, list_location:[], placeholder:'Start Location'}, 
        {locate:null, list_location:[], placeholder:'Destination Location'}
    ])
    const start_location = ref(null)
    const destination_location = ref(null)
    const list_start_location = ref([])
    const list_destination_location = ref([])

    // Message Variable
    let count = ref(0);
    const messagess = ref([]);
    const messages = ref(false)
    const messages_error = ref(false)

    const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEYS;

    const router = useRouter();
    const toast = useToast();

    
    onMounted(() => {
        load_data()
    });
    
    // Jika Parameter ada nya 
    const load_spdk = async() => {
        const response = await User_SpdkFormService.getDetailMySPDK(formID);
        const load = response.data.data;
        location.value = [
            {locate:null, list_location:[], placeholder:'Start Location'}, 
        ]
        form.value = {
            id: formID,
            atasan_id: load.atasan_id,
            keperluan: load.keperluan,
            tgl_berangkat: load.tgl_berangkat,
            tgl_kembali: load.tgl_kembali,
            jam_pergi: load.jam_pergi,
            jam_sampai: load.jam_sampai,
            barang: load.barang,
            kendaraan: load.kendaraan,
            rombongan: load.rombongan,
            uang_panjar: load.uang_panjar,
            lampiran: `${URL_API}${load.lampiran.substring(1)}`,
        }
        console.log(load)
        // Get Location
        const get_placestart = await getLocationName(load.destinations[0].start_latitude, load.destinations[0].start_longitude);
        const placestart = await getDescLoc(get_placestart.place_id)
        location.value[0].list_location[0]= {
            description: get_placestart.formatted_address,
            place_id: get_placestart.place_id,
            main_text: placestart.name,
        }
        location.value[0].locate= {
            description: get_placestart.formatted_address,
            place_id: get_placestart.place_id,
            main_text: placestart.name,
        }
        location.value[0].placeholder = 'Start Location'

        const dest = load.destinations;
        for (let i = 0; i < dest.length; i++) {
            const get_placestart = await getLocationName(dest[i].latitude, dest[i].longitude);
            const placestart = await getDescLoc(get_placestart.place_id)
            location.value.push({
                list_location:[{ description: get_placestart.formatted_address, place_id: get_placestart.place_id, main_text: placestart.name}], 
                locate: {
                    description: get_placestart.formatted_address,
                    place_id: get_placestart.place_id,
                    main_text: placestart.name,
                }, 
                placeholder:'Destination Location'
            })
            // location.value[i+1].list_location[0]= {
            //     description: get_placestart.formatted_address,
            //     place_id: get_placestart.place_id,
            //     main_text: placestart.name,
            // }
            // location.value[i+1].locate= {
            //     description: get_placestart.formatted_address,
            //     place_id: get_placestart.place_id,
            //     main_text: placestart.name,
            // }
            // location.value[i+1].placeholder = 'Destination Location'
        }
    }
    
    const load_data = async () => {
        if (formID == null) {
            await loadUser();
            reset_form();
            loading.value = false;
        } else {
            await load_spdk()
            await loadUser();
            loading.value = false;
        }
    }

    const perhitungan_waktu = (t_berangkat, j_berangkat, t_sampai, j_sampai) => {
        // Assuming t_berangkat, j_berangkat, t_sampai, and j_sampai are strings
        const w_berangkat = moment(`${t_berangkat} ${j_berangkat}`);
        const w_sampai = moment(`${t_sampai} ${j_sampai}`);

        // Calculate the difference in days
        const durationInDays = w_sampai.diff(w_berangkat, 'days');

        return durationInDays;
    };

    const reset_form = () => {
        form.value = {id:null, atasan_id:null, lampiran:null, keperluan:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', lama_hari:null, barang:null, kendaraan:null, rombongan:'-', uang_panjar: null, start_latitude:null, start_longitude:null, latitude:[], longitude:[]}
        location.value = [
            {locate:null, list_location:[], placeholder:'Start Location'}, 
            {locate:null, list_location:[], placeholder:'Destination Location'}
        ];
    }

    const addsForm = () => {
        // tot_answare.value++;
        location.value.push({locate:null, list_location:[], placeholder:'Destination Location'});
    };

    const removeForm = (index) => {
        location.value.splice(index, 1); // Remove the form at the specified index
        // console.log(index)
    };

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
                            name: data[i].name +' - '+data[i].jabatan,
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
        const loc = location.value;
        let list_country = [];
        for (let i = 1; i < loc.length; i++) {
            if (loc[i].locate != null) {
                const description = loc[i].locate.description;
                const getCountry = description.split(',').map(word => word.trim());
                const country = getCountry[getCountry.length - 1].toLowerCase();
                list_country.push(country);
            } else {
                list_country.push('');
            }
        }
        const isSameCountry = compareArrays(list_country);
        if (isSameCountry == 'kosong') {
            visible.value = false;
        } else {
            visible.value = true;
        }
    }

    // Get Longitude Latitude By Place_id
    const getLongLat = async(place) => {
        const response = await axios.get(`${URL_MAPS_API}v1/api/maps/by_place_id`, {
            params: {
                place_id: place,
                fields: 'geometry',
                key: GOOGLE_MAPS_API_KEY,
            },
        });
        const result = response.data.data.result;
        return result.geometry.location;
    }

    // Search Location By GMaps API
    const onSearchInput = async (index) => {
    // const onSearchInput = async () => {
        try {
            const response = await axios.get(`${URL_MAPS_API}v1/api/maps/place_predictions`, {
                params: {
                input: location.value[index].locate,
                // input: start_location.value,
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

            location.value[index].list_location = list;
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    };

    const customBase64Uploader = async (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        console.log(file)
        form.value.lampiran = file.objectURL;
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
        };
    };

    const testing = () => {
        var fileInput = document.getElementById('lampiran_ID');

        // Check if files are selected
        if (fileInput.files.length > 0) {
            // Access the first selected file
            var selectedFile = fileInput.files[0];

            // Log the file object or its properties
            console.log(selectedFile);
            console.log('File Name:', selectedFile.name);
            console.log('File Size:', selectedFile.size);
            console.log('File Type:', selectedFile.type);
        } else {
            console.log('No file selected');
        }
    }

    const getFileDetails = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl, {
                method: 'HEAD'
            });

            if (response.ok) {
                const contentDispositionHeader = response.headers.get('content-disposition');
                const fileName = contentDispositionHeader
                    ? contentDispositionHeader.split('filename=')[1]
                    : 'unknown_filename';
                const fileSize = response.headers.get('content-length');

                return { contentDispositionHeader, fileSize };
            } else {
                console.error('Failed to retrieve file details. HTTP status:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    };

    // Function to compare arrays
    const compareArrays = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == '') {
                return 'kosong';
            } else {
                if (arr[i] !== "indonesia") {
                    return 'ln';
                }
            }
        }
        return 'dn';
    }

    const compareRegion = (index) => {
        if (index > 0) {
            loading_input_dp.value = true;
            setTimeout(function() {
                const loc = location.value;
                let list_country = [];
                for (let i = 0; i < loc.length; i++) {
                    if (loc[i].locate != null) {
                        const description = loc[i].locate.description;
                        const getCountry = description.split(',').map(word => word.trim());
                        const country = getCountry[getCountry.length - 1].toLowerCase();
                        list_country.push(country);
                    } else {
                        list_country.push('');
                    }
                }
                const isSameCountry = compareArrays(list_country);
                if (isSameCountry == 'ln') {
                    disabled_dp.value = false;
                    form.value.uang_panjar = null;
                    loading_input_dp.value = false;
                } else {
                    disabled_dp.value = true;
                    form.value.uang_panjar = 0;
                    loading_input_dp.value = false;
                }
                console.log(isSameCountry, disabled_dp.value)
            }, 3000);
        }
    }

    // Post Data to BE_API
    const postData = async () => {
        const loc = location.value;
        console.log(loc)
        if (loc[0].locate != null && form.value.atasan_id != null && form.value.keperluan != '' && form.value.tgl_berangkat != '' && form.value.tgl_kembali != '' && form.value.jam_pergi != '' && form.value.jam_sampai != '' && form.value.barang != null && form.value.kendaraan != null && form.value.uang_panjar != null) {
            // Form Data with Append
            let formData = new FormData();
            formData.append('atasan_id', form.value.atasan_id);
            formData.append('keperluan', form.value.keperluan);
            formData.append('tgl_berangkat', form.value.tgl_berangkat);
            formData.append('tgl_kembali', form.value.tgl_kembali);
            formData.append('jam_pergi', form.value.jam_pergi);
            formData.append('jam_sampai', form.value.jam_sampai);
            formData.append('barang', form.value.barang);
            formData.append('kendaraan', form.value.kendaraan);
            formData.append('rombongan', form.value.rombongan);
            formData.append('uang_panjar', form.value.uang_panjar);
            // Location Condition
            const gets = await getLongLat(loc[0].locate.place_id)
            form.value.start_latitude = Number(gets.lat);
            form.value.start_longitude = Number(gets.lng);
            formData.append('start_latitude', form.value.start_latitude);
            formData.append('start_longitude', form.value.start_longitude);
            for (let i = 1; i < loc.length; i++) {
                const locate = await getLongLat(loc[i].locate.place_id);
                formData.append(`latitude[${i-1}]`, locate.lat);
                formData.append(`longitude[${i-1}]`, locate.lng);
            }
            form.value.lama_hari = perhitungan_waktu(form.value.tgl_berangkat, form.value.jam_pergi, form.value.tgl_kembali, form.value.jam_sampai)+1
            formData.append('lama_hari', form.value.lama_hari);
            
            let fileInput = document.getElementById('lampiran_ID'); 
            // Execute API

            if (formID != null) {
                if (fileInput.files.length > 0) {
                    formData.append('lampiran', document.getElementById('lampiran_ID').files[0]);
                    console.log(document.getElementById('lampiran_ID').files[0])
                } else {
                    const res = await fetch(form.value.lampiran);
                    const imageBlob = await res.blob();
                    const fileName = form.value.lampiran.split('/').pop();
                    formData.append('lampiran', imageBlob, fileName);
                    console.log('lampiran', imageBlob, fileName)
                }
                // console.log(formData)
                if (roles.value == 'adminga') {
                    await Admin_SpdkAdminService.putUpdateSPDK(formID,formData).then(res => {
                            const load = res.data;
                            if (load.success == true) {
                                reset_form();
                                messagess.value = [{ severity: 'success', content: 'Save BTO successfully', id: count.value++ },];
                                loading.value = true;
                                setTimeout(function() {
                                    router.push('/my-spdk');
                                }, 3000);
                            } else {
                                messagess.value = [{ severity: 'warn', content: 'Please refresh this page and re-enter the data.', id: count.value++ },];
                            }
                        }).catch(error => {
                            messagess.value = [{ severity: 'error', content: 'Please confirm to ICT Development.', id: count.value++ },];
                            console.error(error.response.status);
                        })
                } else {
                    await User_SpdkFormService.putUpdateMySPDK(formID,formData).then(res => {
                        const load = res.data;
                        if (load.success == true) {
                            reset_form();
                            messagess.value = [{ severity: 'success', content: 'Save BTO successfully', id: count.value++ },];
                            loading.value = true;
                            setTimeout(function() {
                                router.push('/my-spdk');
                            }, 3000);
                        } else {
                            messagess.value = [{ severity: 'warn', content: 'Please refresh this page and re-enter the data.', id: count.value++ },];
                        }
                    }).catch(error => {
                        messagess.value = [{ severity: 'error', content: 'Please confirm to ICT Development.', id: count.value++ },];
                        console.error(error.response.status);
                    })
                }
            } else {
                formData.append('lampiran', document.getElementById('lampiran_ID').files[0]);
                await User_SpdkFormService.postAddMySPDK(formData).then(res => {
                    const load = res.data;
                    console.log(load)
                    if (load.success == true) {
                        reset_form();
                        messagess.value = [{ severity: 'success', content: 'Save BTO successfully', id: count.value++ },];
                        loading.value = true;
                        setTimeout(function() {
                            router.push('/my-spdk');
                        }, 3000);
                    } else {
                        messagess.value = [{ severity: 'warn', content: 'Please refresh this page and re-enter the data.', id: count.value++ },];
                    }
                }).catch(error => {
                    messagess.value = [{ severity: 'error', content: 'Please confirm to ICT Development.', id: count.value++ },];
                    console.error(error.response.status);
                })
            }
        } else {
            messages.value = false
            messages_error.value = true
            messagess.value = [
                { severity: 'warn', content: 'Please complete the data', id: count.value++ },
            ];
        }
        console.log(messages.value, messages_error.value)
    }

</script>
<template>
    <form class="">
        <Toast/>
        <Dialog v-model:visible="visible" :draggable="false" header="View Maps" modal :style="{ width: '80rem' }">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">
                    <i class="pi pi-map"></i>
                    <span class="font-bold white-space-nowrap">View Maps</span>
                </div>
            </template>
            <view-maps :data_dialog="location"/>
        </Dialog>
        <div class="flex align-items-center justify-content-end md:justify-content-between mb-5 px-2">
            <div class="">
                <i class="mr-4 text-2xl md:text-5xl pi pi-ticket"></i>
                <strong class="text-2xl md:text-5xl font-normal">{{formID == null ? 'Form' : 'Edit'}} BTO</strong>
            </div>
            <div class="hidden md:block">
                <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> My BTO <i class="pi pi-angle-double-right mx-2"></i> {{formID == null ? 'Form' : 'Edit'}} BTO</strong>
            </div>
        </div>
        <div v-show="loading == true" class="text-center">
            <h3>Loading...</h3>
            <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        </div>
        <div v-show="loading == false" class="card shadow-4">
            <!-- <Message severity="success" v-show="messages == true" :closable="false">Save BTO successfully</Message>
            <Message severity="warn" v-show="messages_error == true" :closable="false">Please complete the data</Message> -->
            <Message v-for="msg of messagess" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
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
                        <Dropdown v-model="form.atasan_id" :options="list_atasan" filter optionLabel="name" optionValue="id" placeholder="Choose a assignor" class="w-full"> 
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <Avatar icon="pi pi-user" style="background-color: #E59866; color: #ffffff;" class="mr-2" shape="circle" />
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <div class="col-12 md:col-12">
                    <p class="text-lg font-semibold text-gray-500">ROUTE TRIP <small class="border-1 py-1 px-2 border-round ml-3 text-sm text-orange-500 cursor-pointer hover:text-teal-500" @click="viewMap()"><i class="pi pi-map mr-2"></i> View Maps</small></p>
                    <div class="border-2 border-round border-bluegray-200 p-3">
                        <div :class="`p-inputgroup ${index > 0 ? 'mt-3':'mt-0'}`" v-for="(forms, index) in location" :key="index">
                            <span :class="`p-inputgroup-addon ${index > 0 ? 'bg-pink-500' : 'bg-cyan-500'} text-white`">
                                <i class="pi pi-map-marker"></i>
                            </span>
                            <AutoComplete v-model="forms.locate" :suggestions="forms.list_location" @complete="onSearchInput(index)" class="w-full" optionLabel="description" :placeholder="`${forms.placeholder} ${index > 1 ? index : ''}`" />

                            <Button icon="pi pi-minus" severity="warning" v-show="index > 1" @click="removeForm(index)"></Button>
                            <Button icon="pi pi-plus" severity="secondary" v-show="index > 0" @click="addsForm"></Button>
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
                                <InputText type="date" v-if="formID != null && roles == 'adminga'" v-model="form.tgl_berangkat" placeholder=""/>
                                <InputText type="date" v-else v-model="form.tgl_berangkat" :min="moment(new Date).format('YYYY-MM-DD')" placeholder=""/>
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
                                <InputText type="date" v-if="formID != null && roles == 'adminga'" v-model="form.tgl_kembali" placeholder=""/>
                                <InputText type="date" v-else v-model="form.tgl_kembali" :min="moment(new Date).format('YYYY-MM-DD')" placeholder=""/>
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
                        <InputText v-model="form.barang" placeholder="Exp: clothes, files, laptop, etc.."/>
                    </div>
                </div>
                <div class="col-12 md:col-4 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">ENTOURAGE</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-users"></i>
                        </span>
                        <InputText v-model="form.rombongan" placeholder="Exp: Rombongan komunitas" disabled/>
                    </div>
                </div>
                <div class="col-12 md:col-4 p-fluid">
                    <p class="text-lg font-semibold text-gray-500">TRANSPORT</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-car"></i>
                        </span>
                        <Dropdown v-model="form.kendaraan" :options="kendaraan_list" optionLabel="name" optionValue="kendaraan" placeholder="Select a Transportation" class="">
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
                            <i class="pi pi-money-bill" v-if="loading_input_dp == false"></i>
                            <i class="pi pi-spin pi-spinner" v-else></i>
                        </span>
                        <Dropdown v-model="form.uang_panjar" :options="dp_list" optionLabel="name" optionValue="uang_panjar" :disabled="disabled_dp" placeholder="Select a Down Payment" class="">
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
                        <InputText type="file" placeholder="Exp: clothes, files, laptop, etc.." name="lampiran" id="lampiran_ID" accept="image/*,application/pdf"/>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex gap-2">
                        <Button label="Back" severity="secondary" icon="pi pi-times" outlined  @click="router.back()"/>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex justify-content-end gap-2">
                        <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData()"/>
                        <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                    </div>
                </div>
            </div>
        </div>   
    </form>
</template>