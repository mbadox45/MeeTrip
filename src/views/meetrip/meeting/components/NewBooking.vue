<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';
    import moment from 'moment';

    // Components

    // API
    import Meeting_BookingService from '@/api/meeting/BookingService';
    import UserService from '@/api/UserService'
    import { URL_WEB, URL_API } from '@/api/env';

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
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const tools = ref({snack:true, minuman:true, siang:true, malam:true})
    const disable_snack = ref(true);
    const tools_form = ref({snack:'', minuman:'', siang:'', malam:''})
    const form = ref({id:null, purpose:'', date:'', start_time:'', end_time:'', room_id:null, tools:['zoom','sound'], peserta:'', snack:'0', minuman:'0', siang: '0', malam:'0'})
    const room_list = ref([]);
    const images = ref(null);
    const date_now = ref(moment(new Date).format('YYYY-MM-DD'))

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        if (statusData == 'add') {
            reset_form();
            await room_load()
        } else {
            await room_load()
            load_edit()
        }
    }

    onMounted(() => {
        load_data()
    });

    const load_edit = () => {
        form.value.id= datas.id;
        form.value.purpose= datas.purpose;
        form.value.date= datas.date;
        form.value.start_time= datas.start_time;
        form.value.end_time= datas.end_time; 
        form.value.room_id= datas.room_id;
        form.value.peserta= datas.peserta; 
        form.value.tools = [];
        // Zoom
        if (datas.zoom == 'zoom') {
            form.value.tools.push('zoom')
        }
        // Sound
        if (datas.sound == 'sound') {
            form.value.tools.push('sound')
        }
        // Snack
        if (datas.snack != "0") {
            form.value.snack = datas.snack; 
            tools_form.value.snack = datas.snack
            disable_snack.value = false
            form.value.tools.push('snack')
        } 
        // Minuman
        if (datas.minuman != "0") {
            form.value.minuman = datas.minuman; 
            tools_form.value.minuman = datas.minuman
            form.value.tools.push('minuman')
        }
        // Makan Siang
        if (datas.siang != "0") {
            form.value.siang = datas.siang; 
            tools_form.value.siang = datas.siang
            form.value.tools.push('siang')
        }
        // Makan Malam
        if (datas.malam != "0") {
            form.value.malam = datas.malam; 
            tools_form.value.malam = datas.malam
            form.value.tools.push('malam')
        }
        rooms()
    }

    const room_load = async() => {
        const response = await Meeting_BookingService.getRoom()
        const load = response.data.data;
        const list = [];
        for (let i = 0; i < load.length; i++) {
            list[i] = {
                capacity:load[i].capacity,
                description:load[i].description,
                foto_room:URL_API+'uploads/room/'+load[i].foto_room,
                id:load[i].id,
                name:load[i].name,
            }
        }
        room_list.value = list;
        
    }

    // View Image
    const rooms = () => {
        const data = room_list.value.filter(item => item.id === form.value.room_id);
        images.value = data[0].foto_room
    }

    const reset_form = () => {
        form.value = {
            purpose:'', date:'', start_time:'', end_time:'', room_id:null, tools:['zoom','sound'], peserta:'', snack:'0', minuman:'0', siang: '0', malam:'0'
        }
        tools.value = {
            snack:true, minuman:true, siang:true, malam:true
        }
        tools_form.value = {
            snack:'', minuman:'', siang:'', malam:''
        }
    }

    const inputDisable = (test) => {
        if (test == 'minuman') {
            tools.value.minuman = !tools.value.minuman;
        } else if (test == 'snack') {
            tools.value.snack = !tools.value.snack;
        } else  if (test == 'siang') {
            tools.value.siang = !tools.value.siang;
        } else {
            tools.value.malam = !tools.value.malam;
        }
    }

    const snackDisable = () => {
        
        if (form.value.start_time != '' && form.value.end_time != '') {
            disable_snack.value = false;
        } else {
            disable_snack.value = true;
        }
    }

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                // get tools array
                if (form.value.tools.indexOf('zoom') >= 0 ) {
                    form.value.zoom = form.value.tools[form.value.tools.indexOf('zoom')]
                } else {
                    form.value.zoom = ""
                }
                if (form.value.tools.indexOf('sound') >= 0) {
                    form.value.sound = form.value.tools[form.value.tools.indexOf('sound')]
                } else {
                    form.value.sound = ""
                }

                // post data
                const post = {
                    snack : tools_form.value.snack || form.value.snack,
                    minuman : tools_form.value.minuman || form.value.minuman,
                    malam : tools_form.value.malam || form.value.malam,
                    siang : tools_form.value.siang || form.value.siang,
                    sound : form.value.sound,
                    zoom : form.value.zoom,
                    date : form.value.date,
                    end_time : form.value.end_time,
                    start_time : form.value.start_time,
                    purpose : form.value.purpose,
                    peserta : form.value.peserta,
                    room_id : form.value.room_id,
                }
                if (statusData == 'add') {
                    const response = await Meeting_BookingService.postAddBooking(post)
                    const load = response.data.success;
                    if (load == true) {
                         emit('submit','add')
                    } else {
                        emit('submit','warning')
                    }
                } else {
                    const response = await Meeting_BookingService.putUpdateBooking(datas.id, post)
                    const load = response.data.success;
                    if (load == true) {
                         emit('submit','edit')
                    } else {
                        emit('submit','warning')
                    }
                }
            } catch (error) {
                emit('submit','danger')
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form class=" py-3">
        <div class="grid align-items-center">
            <div class="col-12 md:col-12 p-fluid">
                <p class="text-lg font-semibold">SCHEDULE</p>
                <div class="grid">
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="date" v-model="form.date" placeholder="" :min="date_now" />
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-clock text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="time" v-model="form.start_time" placeholder="" @input="snackDisable()"/>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-clock text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="time" v-model="form.end_time" placeholder="" @input="snackDisable()"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <p class="text-lg font-semibold">DETAILS</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock text-pink-400 font-bold"></i>
                    </span>
                    <InputText v-model="form.purpose" rows="4" cols="30" placeholder="Topic"/>
                </div>
                <div class="p-inputgroup mt-2">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock text-pink-400 font-bold"></i>
                    </span>
                    <Textarea v-model="form.peserta" rows="4" cols="30" placeholder="Participant (Exp: Dari PT Maju Jaya Sempurna 11 Orang)"/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <p class="text-lg font-semibold">COMPONENTS</p>
                <div class="grid">
                    <div class="col-6 md:col-3">
                        <strong><i class="pi pi-building mr-2 font-bold text-pink-400 text-xl"></i> Room</strong>
                        <div class="flex align-items-center my-2" v-for="(list, index) in room_list" :key="index">
                            <RadioButton v-model="form.room_id" :inputId="`room${list.id}`" name="room" :value="list.id" @input="rooms" />
                            <label :for="`room${list.id}`" class="ml-2 flex align-items-center">{{list.name}}</label>
                        </div>
                    </div>
                    <div class="col-6 md:col-4">
                        <p><i class="pi pi-image mr-2 font-bold text-pink-400 text-xl"></i> Capture</p>
                        <div v-show="form.room_id != null">
                            <Image :src="images" alt="Image" width="300" class="border-round-xl" />
                        </div>
                    </div>
                    <div class="col-12 md:col-5 p-fluid">
                        <strong><i class="pi pi-wrench mr-2 font-bold text-pink-400 text-xl"></i> Tools & Snack</strong>
                        <table style="width: 100%;">
                            <tr>
                                <td colspan="2">
                                    <div class="flex align-items-center my-2">
                                        <Checkbox v-model="form.tools" inputId="tools_zoom" name="tools" value="zoom" />
                                        <label for="tools_zoom" class="ml-2"> Perangkat Zoom </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="flex align-items-center my-2">
                                        <Checkbox v-model="form.tools" inputId="tools_sound" name="tools" value="sound" />
                                        <label for="tools_sound" class="ml-2"> Sound System </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="flex align-items-center">
                                        <Checkbox v-model="form.tools" :disabled="disable_snack" inputId="tools_snack" name="tools" value="snack" @input="inputDisable('snack')" />
                                        <label for="tools_snack" :class="`ml-2 ${disable_snack == true ? 'text-gray-400': 'text-black'}`"> Snack </label>
                                    </div>
                                </td>
                                <td>
                                    <InputText v-model="tools_form.snack" :disabled="tools.snack" placeholder="Jumlah..."/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="flex align-items-center">
                                        <Checkbox v-model="form.tools" inputId="tools_minuman" name="tools" value="minuman" @input="inputDisable('minuman')" />
                                        <label for="tools_minuman" class="ml-2"> Minuman </label>
                                    </div>
                                </td>
                                <td>
                                    <InputText v-model="tools_form.minuman" :disabled="tools.minuman" placeholder="Jumlah..."/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="flex align-items-center">
                                        <Checkbox v-model="form.tools" inputId="tools_siang" name="tools" value="siang" @input="inputDisable('siang')"/>
                                        <label for="tools_siang" class="ml-2"> Makan Siang </label>
                                    </div>
                                </td>
                                <td>
                                    <InputText v-model="tools_form.siang" :disabled="tools.siang" placeholder="Jumlah..."/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="flex align-items-center">
                                        <Checkbox v-model="form.tools" inputId="tools_malam" name="tools" value="malam" @input="inputDisable('malam')"/>
                                        <label for="tools_malam" class="ml-2"> Makan Malam </label>
                                    </div>
                                </td>
                                <td>
                                    <InputText v-model="tools_form.malam" :disabled="tools.malam" placeholder="Jumlah..."/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex gap-2">
                    <Button label="Close" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex justify-content-start md:justify-content-end gap-2">
                    <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                    <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                </div>
            </div>
        </div>
    </form>
</template>