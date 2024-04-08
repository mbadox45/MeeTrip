<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import UserService from '@/api/UserService'
    import Hc_SdmService from '@/api/hc/SdmService.js';
    import { bom } from '@/api/Databodong';

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
    const bom_list = ref(bom);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id: null, user_id:datas.user_id || null, bom:datas.bom || null})
    const disableds = ref(false)
    const list_user = ref([])

    let count = ref(0);
    const messagess = ref([]);

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        loadUser()
        if (status == 'add') {
            refresh()
        } else {
            form.value = {
                id: datas.id || null, user_id:datas.user_id || null, bom:datas.bom || null
            }
        }
    }

    const refresh = () => {
        form.value = {
            id: null, user_id: null, bom: null
        }
    }

    const loadUser = async() => {
        try {
            const response = await UserService.getUsers();
            const load = response.data;
            const data = load.data;
            list_user.value = []
            for (let i = 0; i < data.length; i++) {
                const grade = Number(data[i].grade)
                list_user.value.push({
                    id: data[i].id,
                    name: data[i].name +' - '+data[i].jabatan,
                    grade: grade,
                })
            }
            // console.log(list_atasan.value, Number(payload.value.grade))
        } catch (error) {
            list_atasan.value = []
            console.log(error);
        }
    }

    onMounted(() => {
        load_data()
    });

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                if (status == 'add') {
                    if (form.value.bom == null && form.value.user_id == null) {
                        messagess.value = [{ severity: 'warn', content: 'Please refresh this page and re-enter the data.', id: count.value++ },];
                    } else {
                        const check_existing = datas.filter(item => item.user_id == form.value.user_id)

                        if (check_existing.length > 0) {
                            messagess.value = [{ severity: 'error', content: 'BOM users already exist !.', id: count.value++ },];
                        } else {
                            const response = await Hc_SdmService.postBOM(form.value)
                            const data = response.data
                            console.log(data)
                            if (data.success == true) {
                                messagess.value = [{ severity: 'success', content: 'Added successfully', id: count.value++ },];
                                setTimeout(function() {
                                    emit('submit','success_add')
                                }, 2000);
                            }
                        }
                    }
                } else {
                    const response = await Hc_SdmService.putBOM(form.value.id,form.value)
                    const data = response.data
                    console.log(data)
                    if (data.success == true) {
                        messagess.value = [{ severity: 'success', content: 'Updated successfully', id: count.value++ },];
                        setTimeout(function() {
                            emit('submit','success_update')
                        }, 2000);
                    }
                }
            } catch (error) {
                messagess.value = [{ severity: 'error', content: 'Please confirm to ICT Development.', id: count.value++ },];
                setTimeout(function() {
                    emit('submit','danger')
                }, 2000);
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form class="mt-2">
        <Message v-for="msg of messagess" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
        <div class="grid align-items-end">
            <div class="col-12 md:col-12 p-fluid">
                <p class="font-medium">Nama</p>
                <Dropdown v-model="form.user_id" :options="list_user" optionLabel="name" optionValue="id" filter placeholder="Select a User" class="">
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="col-12 md:col-12 p-fluid">
                <p class="font-medium">BOM</p>
                <Dropdown v-model="form.bom" :options="bom_list" optionLabel="name" optionValue="bom" placeholder="Select a BOM" class="">
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="col-12 md:col-12 md:text-right flex gap-2 justify-content-end">
                <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                <Button type="button" label="Close" severity="danger" icon="pi pi-times" @click="postData('close')"/>
            </div>
        </div>
    </form>
</template>