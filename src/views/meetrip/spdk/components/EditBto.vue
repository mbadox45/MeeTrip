<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';
    import moment from 'moment';

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

    const datas = props.data_dialog;
    const statusData = props.status;
    const titleData = props.title;
    const list_atasan = ref([]);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, nama:'', pemberi_tugas:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', tujuan:'', keperluan:''})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        
    }

    onMounted(() => {
        load_data()
    });

    const reset_form = () => {
        form.value = {nama:'', pemberi_tugas:'', tgl_berangkat:'', tgl_kembali:'', jam_pergi:'', jam_sampai:'', tujuan:'', keperluan:''}
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
            <div class="col-12 md:col-12">
                <div class="flex align-items-center gap-3 mr-auto">
                    <Avatar image="/layout/meetrip.png" size="large" />
                    <strong class="text-3xl" v-html="titleData"></strong>
                </div>
                <Divider/>
            </div>
        </div>
        <div class="grid align-items-end">
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Nama Pelaksana</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-user"></i>
                    </span>
                    <InputText v-model="form.nama" disabled placeholder="Nama Pelaksana"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Pemberi Tugas</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-star"></i>
                    </span>
                    <InputText v-model="form.pemberi_tugas" disabled placeholder="Pemberi Tugas"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Tujuan</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-map-marker"></i>
                    </span>
                    <InputText v-model="form.tujuan" disabled placeholder="Tujuan"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Keperluan</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-bookmark"></i>
                    </span>
                    <InputText v-model="form.keperluan" disabled placeholder="Keperluan"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Berangkat</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-calendar"></i>
                    </span>
                    <InputText v-model="form.tgl_berangkat" placeholder="Transport to Airport Fee" type="date"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock"></i>
                    </span>
                    <InputText v-model="form.jam_pergi" placeholder="Breakfast Fee" type="time"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <p class="text-lg font-semibold">Kembali</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-calendar"></i>
                    </span>
                    <InputText v-model="form.tgl_kembali" placeholder="Lunch Fee" type="date"/>
                </div>
            </div>
            <div class="col-12 md:col-3 p-fluid">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock"></i>
                    </span>
                    <InputText v-model="form.jam_sampai" placeholder="Dinner Fee" type="time"/>
                </div>
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