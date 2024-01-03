<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
    const payload = ref(JSON.parse(localStorage.getItem('payload')));

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        const response = await User_SpdkFormService.getDetailMySPDK(datas.id)
        const data = response.data.data;
        console.log(data);
    }

    onMounted(() => {
        load_data()
    });

</script>
<template>
    <div class="grid align-items-end">
        
    </div>
</template>