<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';
    import moment from 'moment';

    // Components

    // API
    // import {listOffice} from '@/api/DataVariable';
    import UserService from '@/api/UserService'

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status:{
            type:String
        },
        title:{
            type:String
        },
    });

    const center = { lat: 33.678, lng: -116.243 };

    const datas = props.data_dialog;
    const statusData = props.status;
    const titleData = props.title;
    // const list_office = ref(listOffice);
    const list_kategori = ref([]);
    const list_sub_kategori = ref([]);
    const list_atasan = ref([]);
    const disabled_sub_category = ref(true);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, atasan_id:null, keperluan:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', lama_hari:null, barang:null, kendaraan:'', rombongan:''})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        loadUser();
        if (statusData == 'add') {
            reset_form();
        } else {
            form.value = {
                id:null, 
                atasan_id:null, 
                keperluan:'', 
                tgl_berangkat:null, 
                tgl_kembali:null, 
                barang:null, 
                rombongan:''
            };
        }
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

    const postData = async (ket) => {
        if (ket == 'save') {
            form.value.lama_hari = perhitungan_waktu(form.value.tgl_berangkat, form.value.jam_pergi, form.value.tgl_kembali, form.value.jam_sampai) - 1
            console.log(form.value.lama_hari)
            // try {
            // } catch (error) {
            //     emit('submit','danger')
            // }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form class=" py-3">
        <div class="grid align-items-center">
            <div class="col-12 md:col-6">
                <div class="flex align-items-center gap-3 mr-auto">
                    <Avatar image="/layout/meetrip.png" size="large" />
                    <strong class="text-3xl" v-html="titleData"></strong>
                </div>
                <Divider/>
            </div>
            <div class="col-12 md:col-6 p-fluid">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-rolodex" viewBox="0 0 16 16">
                            <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                            <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1H1Zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1V2Z"/>
                        </svg>
                    </span>
                    <Dropdown v-model="form.atasan_id" :options="list_atasan" filter optionLabel="name" optionValue="id" placeholder="Assignor" class="w-full"></Dropdown>
                </div>
            </div>
        </div>
        <div class="grid align-items-center mt-3">
            <div class="col-12 md:col-6 p-fluid">
                <p class="text-lg font-semibold">DEPARTURE</p>
                <div class="grid">
                    <div class="col-6">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i>
                            </span>
                            <InputText type="date" v-model="form.tgl_berangkat" placeholder=""/>
                        </div>
                    </div>
                    <div class="col-6">
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
                <p class="text-lg font-semibold">ARRIVAL</p>
                <div class="grid">
                    <div class="col-6">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar"></i>
                            </span>
                            <InputText type="date" v-model="form.tgl_kembali" placeholder=""/>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-clock"></i>
                            </span>
                            <InputText type="time" v-model="form.jam_sampai" placeholder=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <Card class="bg-red-50 border-1 border-red-600">
                    <template #content>
                        <div class="flex flex-wrap align-items-center justify-content-between">
                            <div class="flex align-items-center">
                                <span class="font-semibold text-xl">TRANSPORT</span>
                            </div>
                            <div class="flex align-items-center">
                                <i class="pi pi-arrow-right text-xl font-bold text-red-500"></i>
                            </div>
                            <div class="flex flex-wrap align-items-center justify-content-start gap-4">
                                <div class="flex align-items-center">
                                    <RadioButton v-model="form.kendaraan" inputId="kendaraan1" name="pizza" value="Public Transport" />
                                    <label for="ingredient1" class="ml-2 flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bus-front mr-2" viewBox="0 0 16 16">
                                    <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z"/>
                                    <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z"/>
                                    </svg>Public Transport</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="form.kendaraan" inputId="kendaraan2" name="pizza" value="Official Transport" />
                                    <label for="ingredient2" class="ml-2 flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-car-front mr-2" viewBox="0 0 16 16">
                                    <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"/>
                                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z"/>
                                    </svg> Official Transport</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton v-model="form.kendaraan" inputId="kendaraan3" name="pizza" value="Airplane" />
                                    <label for="ingredient3" class="ml-2 flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-airplane-engines mr-2" viewBox="0 0 16 16">
                                    <path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>
                                    </svg>Airplane</label>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-12 md:col-6">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock"></i>
                    </span>
                    <Textarea v-model="form.keperluan" rows="4" cols="30" placeholder="Necessary ..."/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <google-map api-key="AIzaSyDPjOjHUhjHkSMDAyD4Of6yhvV6ZwwBojM" style="width: 100%; height: 500px" :center="center" :zoom="15">
                    <Marker :options="{ position: center }" />
                </google-map>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex gap-2">
                    <Button label="close" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                    <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                </div>
            </div>
        </div>
    </form>
</template>