<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import Admin_PanjarService from '@/api/admin/PanjarService';
    import Admin_SuratService from '@/api/admin/SuratService';
    import Admin_BteService from '@/api/admin/BteService';
    import User_SpdkApproveService from '@/api/user/SpdkApproveService';
    import Hc_SdmService from '@/api/hc/SdmService';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_dialog:{
            type:String
        }
    });

    const datas = props.data_dialog;
    const status = props.status_dialog;
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:datas.id})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        
    }

    onMounted(() => {
        load_data()
    });

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                let response;
                if (status == 'approve_dp') {
                    response = await Admin_PanjarService.getApproveSPDK(form.value.id)
                } else if (status == 'approve_pemberi_tugas') {
                    response = await User_SpdkApproveService.getApprovePemberiTugas(form.value.id)
                } else if (status == 'approve_atasan') {
                    response = await User_SpdkApproveService.getApproveAtasan(form.value.id)
                } else if (status == 'submit_surat') {
                    response = await Admin_SuratService.putSubmitSurat(form.value.id)
                } else if (status == 'approve_bte') {
                    response = await Admin_BteService.getApproveBTE(form.value.id)
                } else if (status == 'cair') {
                    response = await Admin_BteService.putCairBTE(form.value.id)
                } else {
                    response = await Hc_SdmService.getApproveSPDK(form.value.id)
                }
                const data = response.data
                console.log(data)
                if (data.success == true) {
                    if (status == 'submit_surat') {
                        emit('submit','success_submit')
                    } else if (status == 'cair') {
                        emit('submit','disbursements')
                    } else {
                        emit('submit','success_approve')
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
    <form class="">
        <h6 class="text-center text-lg font-medium">Hi, <strong class="text-gray-500">{{payload.name || '...'}}</strong></h6>
        <h6 class="text-center text-lg font-normal mb-6">Do you want to <span class="font-semibold">{{status == 'submit_surat' ? 'Submit' : status == 'cair' ? 'Disbursement': 'Approve'}}</span> this SPDK ?</h6>
        <div class="grid align-items-end">
            <div class="col-12 md:col-12">
                <div class="flex justify-content-center gap-8 p-fluid px-8">
                    <Button type="button" :label="status == 'submit_surat' ? 'Submit' : 'Approve'" severity="success" icon="pi pi-check" @click="postData('save')"/>
                    <Button label="Close" severity="danger" icon="pi pi-times" @click="postData('close')" />
                </div>
            </div>
        </div>
    </form>
</template>