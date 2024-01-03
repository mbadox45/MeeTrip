<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService';
    import moment from 'moment-timezone';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
    const events = ref(null)

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        const response = await User_SpdkFormService.getDetailMySPDK(datas.id)
        const data = response.data.data
        const log = data.log
        events.value = []
        for (let i = 0; i < log.length; i++) {
            // const user = await UserService.getUsersID(log[i].user_id)
            // console.log(user.data)
            events.value.push({
                date : moment(log[i].created_at).format('DD MMMM YYYY - HH:mm:ss'),
                status : log[i].action,
                info : log[i].info,
            })
        }
    }

    onMounted(() => {
        load_data()
    });


</script>
<template>
    <div>
        <div class="card" v-for="(list, index) in events" :key="index">
            <div class="grid">
                <div class="col-2 md:col-1">
                    <i class="text-3xl pi pi-angle-double-down text-cyan-400"></i>
                </div>
                <div class="col-10 md:col-6">
                    <h6>{{ list.status }}</h6>
                    <Tag severity="warning" :value="list.status" rounded></Tag>
                    <p>Note: {{ list.info }}</p>
                </div>
                <div class="col-12 md:col-5 text-right">
                    <span class="text-sm font-light">{{ list.date }}</span>
                </div>
            </div>
        </div>
    </div>
</template>