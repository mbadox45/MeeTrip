<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import Admin_PanjarService from '@/api/admin/PanjarService';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
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
                const response = await Admin_PanjarService.putRevisiSPDK(form.value.id, form.value)
                const data = response.data
                console.log(data)
                if (data.success == true) {
                    emit('submit','success_revisi')
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
        <h6 class="text-center text-lg font-normal mb-6">Do you want to <span class="font-bold">Revision Down Payment</span> ?</h6>
        <div class="grid align-items-end">
            <div class="col-12 md:col-12 p-fluid">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <strong>Note</strong>
                    </span>
                    <Textarea v-model="form.keterangan" rows="4" cols="30" placeholder="Note: SPDK Double"/>
                </div>
            </div>
            <div class="col-12 md:col-6 md:text-right p-fluid">
                <Button type="button" label="Revision" severity="success" icon="pi pi-check" @click="postData('save')"/>
            </div>
            <div class="col-12 md:col-6 p-fluid">
                <Button label="Cancel" severity="danger" icon="pi pi-times" @click="postData('close')" />
            </div>
        </div>
    </form>
</template>