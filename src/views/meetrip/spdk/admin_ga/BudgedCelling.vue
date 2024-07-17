<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';

    // API
    import Misc_PaguService from '@/api/misc/PaguService.js';
    import {wilayah, bom} from '@/api/Databodong.js';

    
    // Component
    import FormBudgedCelling from '@/views/meetrip/spdk/admin_ga/components/FormBudgedCelling.vue';

    const router = useRouter();
    const route = useRoute();

    const dialogs = ref(false)

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const loadingTable = ref(null);
    const routes = ref(route.path)
    const loadingTable2 = ref(false);
    const load_wilayah = ref(wilayah)
    const load_bom = ref(bom)
    const request_data = ref([])
    const export_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');
    const menu = ref();
    const search = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});

    const toast = useToast();

    onMounted(() => {
        aksi()
    });
    
    const toggle = (event) => {
        menu.value.toggle(event);
    };
    
    const aksi = async () => {
        loadingTable2.value = true
        try {
            const response = await Misc_PaguService.getAllUang();
            const data = response.data.data;
            const list = data.filter(item => item.jabatan <= 4);
            loadingTable2.value = false
            request_data.value = list;
        } catch (error) {
            loadingTable2.value = false;
            request_data.value = []
            console.log(error)
        }
    }

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {
        menuModel.value = [
            {label: 'Detail Data', icon: 'pi pi-fw pi-search', command: () => detailData(null, "detail")},
            {label: 'Edit Data', icon: 'pi pi-fw pi-pencil', command: () => detailData(null, "edit")},
        ]
    }

    // Dialog Function
    const detailData = async(data, status) => {
        statusRequest.value = status;
        if (status === 'detail') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span>`;
        } else {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">EDIT DATA</span>`;
        }
    }

    const rowClass = (data) => {
        return [ data.status == 5 ? 'bg-primary' : data.status == 6 ? 'text-green-500 font-semibold' : data.status == 4 ? 'text-orange-500 font-semibold' : data.status == 3 ? 'text-cyan-500 font-semibold' : data.status == 2 ? 'text-cyan-500 font-semibold' : data.status == 0 ? 'bg-red-500 text-white' : ''];
    };

    const postData = (ket) => {
        // console.log('test')
        if (ket == 'success_approve') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Approved successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_revisi') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Revision to user successfully`, life: 3000 });
            aksi();
        } else if (ket == 'create_surat') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Create surat successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_submit') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Submit surat successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_cancel') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Decline successfully`, life: 3000 });
            aksi();
        } else if (ket == 'danger') {
            dialogs.value = false
            toast.add({ severity: 'danger', summary: 'Failed', detail: `Please try again`, life: 3000 });
            aksi();
        } else {
            dialogs.value = false
        }
    }

</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: '85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 v-html="titledialogs"></h4>
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-car"></i>
                    <strong class="text-2xl md:text-5xl font-normal">Budged Celling</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Home <i class="pi pi-angle-double-right mx-2"></i> Budged Celling</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                    </div>
                    <div class="w-full text-right">
                        <span class="text-red-500"><i class="pi pi-exclamation-circle"></i> Please right click each row in the table to get action</span>
                    </div>
                </div>
                <Divider/>
                <div v-show="loadingTable2 == true" class="text-center">
                    <h3>Loading...</h3>
                    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                </div>
                <div v-show=" loadingTable2 == false">
                    <ContextMenu ref="cm" :model="menuModel"></ContextMenu>
                    <DataTable v-model:filters="search" :value="request_data" paginator :rows="10" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem"
                    :globalFilterFields="['nomor_surat', 'user.name', 'destination', 'info']">
                        <template #empty><p class="text-center"> Data not found. </p></template>
                        <Column field="jabatan" header="Jabatan" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>{{ load_bom.find(item => Number(item.bom) == data.jabatan).name }}</strong>
                            </template>
                        </Column>
                        <Column field="nama_wilayah" header="Region" style="min-width: 12rem">
                            <template #body="{ data }">
                                <span>{{ load_wilayah[Number(data.wilayah) - 1] }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
