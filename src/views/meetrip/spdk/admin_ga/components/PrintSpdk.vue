<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import Misc_PdfService from '@/api/misc/PdfService';
    import User_SpdkFormService from '@/api/user/SpdkFormService';
    import { URL_API } from '@/api/env';
    
    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });
    
    const datas = props.data_dialog;
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const labels = ref(null)
    const detail_data = ref({panjar:null, lampiran:null, bteLuarNegeri:null, dpLuarNegeri: null})
    const list_print = ref([]);

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        const response = await User_SpdkFormService.getDetailMySPDK(datas.id)
        const data = response.data.data;
        detail_data.value = {
            panjar: data.panjar,
            lampiran: data.lampiran,
            bteLuarNegeri: data.bteLuarNegeri, 
            dpLuarNegeri: data.dpLuarNegeri,
        }
        listMenu();
    }

    onMounted(() => {
        load_data()
    });

    const listMenu = () => {
        if (datas.status >= 4 && datas.status <= 7) {
            if (detail_data.value.panjar == null) {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                    {code:'sj', label:'Print Travel Document'},
                ]
            } else {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                    {code:'dp', label:'Print Down Payment'},
                    {code:'sj', label:'Print Travel Document'},
                ]
            }
        } else if (datas.status >= 8 && datas.status <= 12) {
            if (detail_data.value.panjar == null) {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                    {code:'sj', label:'Print Travel Document'},
                    {code:'bte', label:'Print BTE'},
                ]
            } else {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                    {code:'dp', label:'Print Down Payment'},
                    {code:'sj', label:'Print Travel Document'},
                    {code:'bte', label:'Print BTE'},
                ]
            }
        } else if (datas.status >= 301 && datas.status <= 303 || datas.status == 3) {
            if (detail_data.value.panjar == null) {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                ]
            } else {
                list_print.value = [
                    {code:'att', label:'Attachment'},
                    {code:'bto', label:'Print BTO'},
                    {code:'dp', label:'Print Down Payment'},
                ]
            }
        } else {
            list_print.value = [
                {code:'att', label:'Attachment'},
                {code:'bto', label:'Print BTO'},
            ]
        }
    }

    const cetakSPDK = async() => {
        if (labels.value == 'bto') {
            window.open(`${URL_API}pdf/${datas.id}/bto`, '_blank');
        } else if (labels.value == 'bte') {
            if (detail_data.value.bteLuarNegeri == null) {
                window.open(`${URL_API}pdf/${datas.id}/bte-dalam-negeri`, '_blank');
            } else {
                window.open(`${URL_API}pdf/${datas.id}/bte-luar-negeri`, '_blank');
            }
        } else if (labels.value == 'sj') {
            window.open(`${URL_API}pdf/${datas.id}/perintah-perjalanan-dinas`, '_blank');
        } else if (labels.value == 'att') {
            const modifiedURL = URL_API.replace(/\/$/, '');
            window.open(`${modifiedURL}${detail_data.value.lampiran}`,'_blank');
        } else {
            if (detail_data.value.dpLuarNegeri == null) {
                window.open(`${URL_API}pdf/${datas.id}/pengajuan-panjar-dalam-negeri`, '_blank');
            } else {
                window.open(`${URL_API}pdf/${datas.id}/pengajuan-panjar-luar-negeri`, '_blank');
            }
        }
    }

</script>
<template>
    <div class="mt-2">
        <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <i class="pi pi-paperclip"></i>
            </span>
            <Dropdown v-model="labels" :options="list_print" optionLabel="label" optionValue="code" placeholder="Select a Print Preview" class="w-full" />
            <Button severity="info" icon="pi pi-print" @click="cetakSPDK"/>
        </div>
    </div>
</template>