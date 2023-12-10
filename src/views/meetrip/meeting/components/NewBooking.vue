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

    const datas = props.data_dialog;
    const statusData = props.status;
    const titleData = props.title;
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const tools = ref({snack:true, minuman:true, siang:true, malam:true})
    const disable_snack = ref(true);
    const tools_form = ref({snack:'', minuman:'', siang:'', malam:''})
    const form = ref({id:null, topik:'', tanggal:'', start:'', end:'', room:null, tools:['zoom','sound'], partisipan:''})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        if (statusData == 'add') {
            reset_form();
        } else {
            form.value = {
                id:null, 
                topik:'', tanggal:'', start:'', end:'', room:null, tools:['zoom','sound'], partisipan:''
            };
        }
    }

    onMounted(() => {
        load_data()
    });

    const reset_form = () => {
        form.value = {
            topik:'', tanggal:'', start:'', end:'', room:null, tools:['zoom','sound'], partisipan:''
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
        
        if (form.value.start != '' && form.value.end != '') {
            disable_snack.value = false;
        } else {
            disable_snack.value = true;
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
        <div class="grid align-items-center justify-content-center">
            <div class="col-11 md:col-11">
                <div class="flex align-items-center gap-3 mr-auto">
                    <Avatar image="/layout/meetrip.png" size="large" />
                    <strong class="text-3xl" v-html="titleData"></strong>
                </div>
                <Divider/>
            </div>
            <div class="col-1 md:col-1 text-right p-fluid">
                <Button severity="danger" icon="pi pi-times" rounded outlined @click="postData('close')" />
            </div>
        </div>
        <div class="grid align-items-center">
            <div class="col-12 md:col-12 p-fluid">
                <p class="text-lg font-semibold">SCHEDULE</p>
                <div class="grid">
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-calendar text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="date" v-model="form.tanggal" placeholder=""/>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-clock text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="time" v-model="form.start" placeholder="" @input="snackDisable()"/>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-clock text-pink-400 font-bold"></i>
                            </span>
                            <InputText type="time" v-model="form.end" placeholder="" @input="snackDisable()"/>
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
                    <InputText v-model="form.topik" rows="4" cols="30" placeholder="Topic"/>
                </div>
                <div class="p-inputgroup mt-2">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-clock text-pink-400 font-bold"></i>
                    </span>
                    <Textarea v-model="form.partisipan" rows="4" cols="30" placeholder="Participant (Exp: Dari PT Maju Jaya Sempurna 11 Orang)"/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <p class="text-lg font-semibold">COMPONENTS</p>
                <div class="grid">
                    <div class="col-6 md:col-3">
                        <strong><i class="pi pi-building mr-2 font-bold text-pink-400 text-xl"></i> Room</strong>
                        <div class="flex align-items-center mt-3">
                            <RadioButton v-model="form.room" inputId="room4" name="room" value="4" />
                            <label for="room4" class="ml-2 flex align-items-center">Main Office Lantai 2</label>
                        </div>
                        <div class="flex align-items-center my-2">
                            <RadioButton v-model="form.room" inputId="room5" name="room" value="5" />
                            <label for="room5" class="ml-2 flex align-items-center">Front Office Lantai 1 A</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton v-model="form.room" inputId="room3" name="room" value="3" />
                            <label for="room3" class="ml-2 flex align-items-center">Front Office Lantai 1 B</label>
                        </div>
                    </div>
                    <div class="col-6 md:col-4">
                        <p><i class="pi pi-image mr-2 font-bold text-pink-400 text-xl"></i> Capture</p>
                        <div v-show="form.room != null">
                            <Image src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg" alt="Image" width="300" class="border-round-xl" />
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