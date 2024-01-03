<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import User_PelaksanaService from '@/api/user/PelaksanaService';
    import User_DpService from '@/api/user/DpService';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_dialog:{
            type:String
        },
    });

    const datas = props.data_dialog;
    const status = props.status_dialog;
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:datas.id, keterangan:''})

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
                if (status == 'submit_dp') {
                    const response = await User_DpService.getSubmitDP(form.value.id)
                    const data = response.data
                    console.log(data)
                    if (data.success == true) {
                        emit('submit','success_submit_dp')
                    }
                } else {
                    const response = await User_PelaksanaService.putSubmitBTE(form.value.id)
                    const data = response.data
                    console.log(data)
                    if (data.success == true) {
                        emit('submit','success_submit_bte')
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
        <h6 class="text-center text-lg font-medium">Hi, <strong class="text-gray-500">{{datas.user.name || '...'}}</strong></h6>
        <h6 class="text-center text-lg font-normal mb-6">Do you want to <span class="font-semibold">SUBMIT {{status == 'submit_dp' ? 'Down Payment' : 'BTE'}}</span> ?</h6>
        <div class="grid align-items-end">
            <div class="col-12 md:col-12">
                <div class="flex justify-content-center gap-8 p-fluid px-8">
                    <Button type="button" label="Yes" severity="success" icon="pi pi-check" @click="postData('save')"/>
                    <Button label="No" severity="danger" icon="pi pi-times" @click="postData('close')" />
                </div>
            </div>
        </div>
    </form>
</template>