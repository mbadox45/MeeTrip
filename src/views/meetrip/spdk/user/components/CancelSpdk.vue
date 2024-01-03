<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService';
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
    const form = ref({id:datas.id, keterangan:''})
    const verify = ref(false)

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        
    }

    onMounted(() => {
        load_data()
    });

    const postData = async (ket) => {
        if (ket == 'save') {
            if (form.value.keterangan == null || form.value.keterangan == '') {
                verify.value = true
            } else {
                verify.value = false
                try {
                    if (status == 'cancel') {
                        const response = await User_SpdkFormService.putCancelMySPDK(form.value.id, form.value)
                        const data = response.data
                        console.log(data)
                        if (data.success == true) {
                            emit('submit','success_cancel')
                        }
                    } else if (status == 'decline_assignor') {
                        const response = await User_SpdkApproveService.putDeclinePemberiTugas(form.value.id, form.value)
                        const data = response.data
                        console.log(data)
                        if (data.success == true) {
                            emit('submit','success_cancel')
                        }
                    } else if (status == 'decline_superior') {
                        const response = await User_SpdkApproveService.putDeclineAtasan(form.value.id, form.value)
                        const data = response.data
                        console.log(data)
                        if (data.success == true) {
                            emit('submit','success_cancel')
                        }
                    } else {
                        const response = await Hc_SdmService.putDeclineSPDK(form.value.id, form.value)
                        const data = response.data
                        console.log(data)
                        if (data.success == true) {
                            emit('submit','success_cancel')
                        }
                    }
                } catch (error) {
                    emit('submit','danger')
                }
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form class="">
        <h6 class="text-center text-lg font-medium">Hi, <strong class="text-gray-500">{{payload.name || '...'}}</strong></h6>
        <h6 class="text-center text-lg font-normal mb-6">Do you want to <span class="font-semibold">{{status == 'cancel' ? 'CANCEL' : 'DECLINE'}}</span> this SPDK ? ( If <strong class="text-lg text-green-600">YES</strong>, state the reason )</h6>
        <div class="grid align-items-end">
            <div class="col-12 md:col-12 p-fluid">
                <p class="text-red-500 text-center font-medium" v-show="verify == true">Please fill in the information</p>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <strong>Note</strong>
                    </span>
                    <Textarea v-model="form.keterangan" rows="4" cols="30" placeholder="Note: SPDK Double"/>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="flex justify-content-center gap-8 p-fluid px-8">
                    <Button type="button" label="Yes" severity="success" icon="pi pi-check" @click="postData('save')"/>
                    <Button label="No" severity="danger" icon="pi pi-times" @click="postData('close')" />
                </div>
            </div>
        </div>
    </form>
</template>