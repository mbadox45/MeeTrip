<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import Admin_SuratService from '@/api/admin/SuratService';
    import { kendaraan } from '@/api/Databodong';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
    const kendaraan_list = ref(kendaraan);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:datas.id, kendaraan:datas.kendaraan, no_kendaraan:datas.no_kendaraan == '-' ? '' : datas.no_kendaraan, nama_supir:datas.nama_supir == '-' ? '' : datas.nama_supir})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        console.log(datas)
    }

    const refresh = () => {
        form.value = {
            id:datas.id, kendaraan:datas.kendaraan, no_kendaraan:datas.no_kendaraan == '-' ? '' : datas.no_kendaraan, nama_supir:datas.nama_supir == '-' ? '' : datas.nama_supir
        }
    }

    onMounted(() => {
        load_data()
    });

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                const response = await Admin_SuratService.putCreateSurat(form.value.id, form.value)
                const data = response.data
                console.log(data)
                if (data.success == true) {
                    emit('submit','create_surat')
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
    <form class="mt-2">
        <div class="grid align-items-end">
            <div class="col-12 md:col-12 p-fluid">
                <p class="font-medium">TRANSPORT</p>
                <Dropdown v-model="form.kendaraan" :options="kendaraan_list" optionLabel="name" optionValue="kendaraan" placeholder="Select a Transportation" class="">
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <span v-html="slotProps.option.icon"></span>
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="col-12 md:col-12 p-fluid">
                <p class="font-medium">DRIVER NAME</p>
                <InputText type="text" v-model="form.nama_supir" placeholder="Dimas Jaya"/>
            </div>
            <div class="col-12 md:col-12 p-fluid">
                <p class="font-medium">NUMBER OF VEHICLES</p>
                <InputText type="text" v-model="form.no_kendaraan" placeholder="BK 1 RI"/>
            </div>
            <div class="col-12 md:col-6 md:text-right p-fluid">
                <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
            </div>
            <div class="col-12 md:col-6 p-fluid">
                <Button label="Refresh" severity="secondary" icon="pi pi-refresh" @click="refresh" />
            </div>
        </div>
    </form>
</template>