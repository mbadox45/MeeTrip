<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';
    import moment from 'moment';

    // Components

    // API
    import Meeting_BookingService from '@/api/meeting/BookingService';

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
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const disable_snack = ref(true);
    const form = ref({id:null, name:'', foto_room:null, description:'', capacity:null})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        if (statusData == 'add') {
            reset_form();
            room_load()
        } else {
            form.value = {
                id:datas.id, 
                name:datas.name, foto_room:datas.foto_room, description:datas.description, capacity:datas.capacity
            };
        }
    }

    onMounted(() => {
        load_data()
    });

    const room_load = async() => {
        const response = await Meeting_BookingService.getRoom()
        const load = response.data.data;
        console.log(load);
    }

    const reset_form = () => {
        form.value = {
            name:'', foto_room:null, description:'', capacity:null
        }
    }

    const postData = async (ket) => {
        if (ket == 'save') {
            if (statusData == 'edit') {
                let formData = new FormData();
                formData.append('name', form.value.name);
                formData.append('description', form.value.description);
                formData.append('capacity', form.value.capacity);
                let fileInput = document.getElementById('lampiran_ID'); 
                if (fileInput.files.length > 0) {
                    formData.append('foto_room', fileInput.files[0]);
                } else {
                    const res = await fetch(form.value.foto_room);
                    const imageBlob = await res.blob();
                    const fileName = form.value.foto_room.split('/').pop();
                    formData.append('foto_room', imageBlob, fileName);
                }
                const response = await Meeting_BookingService.putUpdateRoom(form.value.id,formData)
                const status = response.data.success
                if (status == true) {
                    emit('submit','edit')
                } else {
                    emit('submit','danger')
                }
            } else {
                let formData = new FormData();
                formData.append('name', form.value.name);
                formData.append('description', form.value.description);
                formData.append('capacity', form.value.capacity);
                let fileInput = document.getElementById('lampiran_ID'); 
                formData.append('foto_room', fileInput.files[0]);
                const response = await Meeting_BookingService.postAddRoom(formData)
                const status = response.data.success
                if (status == true) {
                    emit('submit','add')
                } else {
                    emit('submit','danger')
                }
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form class=" py-3">
        <div class="grid align-items-end">
            <div class="col-12 md:col-6 p-fluid">
                <p class="text-lg font-semibold text-gray-500">ROOM</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-building text-pink-400 font-bold"></i>
                    </span>
                    <InputText v-model="form.name" placeholder="Room Name"/>
                </div>
            </div>
            <div class="col-12 md:col-6 p-fluid">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-users text-pink-400 font-bold"></i>
                    </span>
                    <InputNumber v-model="form.capacity" :suffix=" form.capacity > 1 ? ' People' : ' Person'"  placeholder="Room Capacity"/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <p class="text-lg font-semibold text-gray-500">DESCRIPTION</p>
                <div class="p-inputgroup mt-2">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-file-edit text-pink-400 font-bold"></i>
                    </span>
                    <Textarea v-model="form.description" rows="4" cols="30" placeholder="Description"/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <p class="text-lg font-semibold text-gray-500">ROOM IMAGE</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-file-import"></i>
                    </span>
                    <InputText type="file" placeholder="Exp: clothes, files, laptop, etc.." name="lampiran" id="lampiran_ID" accept="image/*"/>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex gap-2">
                    <Button label="Close" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
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