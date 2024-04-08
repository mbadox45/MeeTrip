<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';
    import axios from 'axios';

    // API
    import Hc_SdmService from '@/api/hc/SdmService.js';
    import UserService from '@/api/UserService'
    import { URL_WEB } from '@/api/env';

    
    // Component
    import {menu_9, menu_11, menu_0_or_12} from '@/api/components/ListMenu.js';
    import AddBom from '@/views/meetrip/spdk/admin_hc/components/AddBom.vue';

    const router = useRouter();

    const dialogs = ref(false)

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const loadingTable = ref(null);
    const filters = ref();
    const loadingTable2 = ref(true);
    const request_data = ref([])
    const users = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');
    const menu = ref();

    const toast = useToast();

    onMounted(async() => {
        await loadUser()
        await aksi()
    });
    
    const toggle = (event) => {
        menu.value.toggle(event);
    };

    const loadUser = async() => {
        const response = await UserService.getUsers();
        const load = response.data;
        const data = load.data;
        const list_user = []
        for (let i = 0; i < data.length; i++) {
            list_user.push({
                id: data[i].id,
                name: data[i].name,
            })
        }
        users.value = list_user;
    }
    
    const aksi = async () => {
        loadingTable2.value = true
        try {
            const response = await Hc_SdmService.getBOM();
            const load = response.data
            if (load.success == true) {
                const data = load.data
                console.log(users.value.filter(item => item.id == 211)[0])
                const list = []
                for (let i = 0; i < data.length; i++) {
                    const get_user = users.value.filter(item => item.id == data[i].user_id)
                    if (get_user.length == 0) {
                        continue;
                    } else {
                        list.push({
                            id: data[i].id,
                            user_id: data[i].user_id,
                            bom: data[i].bom,
                            name:get_user[0].name
                        })
                    }
                }
                list.sort((a, b) => b.user_id - a.user_id);
                request_data.value = list;
            } else {
                request_data.value = [];
            }
            loadingTable2.value = false;
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
        if (selectedRequest.value.status == 9) {
            menuModel.value = menu_9([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'revisi'), () => detailData(selectedRequest.value, 'approve_bte'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 11) {
            menuModel.value = menu_11([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'cair'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else {
            menuModel.value = menu_0_or_12([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'approve'), () => detailData(selectedRequest.value, 'decline'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        }
    }

    // Dialog Function
    const detailData = async(data, status) => {
        statusRequest.value = status;
        if (status === 'detail') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">VIEW USER BOM</span>`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold">ADD BOM</span>`;
            dialogs.value = true;
            selectedRequest.value = data;
        } else if (status === 'update') {
            titledialogs.value = `<span class="font-semibold">UPDATE BOM</span>`;
            dialogs.value = true;
            selectedRequest.value = data;
        } else {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">DELETE BOM</span>`;
        }
    }

    // Filter Table
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
    };

    initFilters();

    const postData = (ket) => {
        // console.log('test')
        if (ket == 'success_add') {
            dialogs.value = false
            // toast.add({ severity: 'success', summary: 'Successfully', detail: `Added successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_update') {
            dialogs.value = false
            // toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_delete') {
            dialogs.value = false
            // toast.add({ severity: 'success', summary: 'Successfully', detail: `Deleted successfully`, life: 3000 });
            aksi();
        } else if (ket == 'danger') {
            dialogs.value = false
            // toast.add({ severity: 'danger', summary: 'Failed', detail: `Please try again`, life: 3000 });
            aksi();
        } else {
            dialogs.value = false
        }
    }

</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: statusRequest == 'detail'? '85rem':'50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 v-html="titledialogs"></h4>
            </template>
            <add-bom :data_dialog="selectedRequest" :status_dialog="statusRequest" v-if="statusRequest == 'add' || statusRequest == 'update'" @submit="postData"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-users"></i>
                    <strong class="text-2xl md:text-5xl font-normal">BOM User</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light"><i class="pi pi-home mx-1"></i> Home <i class="pi pi-angle-double-right mx-2"></i> BOM</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full p-fluid">
                        <div class="p-inputgroup">
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" class="" />
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                    </div>
                    <div class="w-full text-right">
                        <Button icon="pi pi-plus font-bold" size="small" severity="info" outlined @click="detailData(request_data, 'add')"/>
                    </div>
                </div>
                <Divider/>
                <div v-show="loadingTable2 == true" class="text-center">
                    <h3>Loading...</h3>
                    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                </div>
                <div v-show=" loadingTable2 == false">
                    <ContextMenu ref="cm" :model="menuModel"></ContextMenu>
                    <DataTable v-model:filters="filters" :globalFilterFields="['user_id', 'name', 'bom']" :value="request_data" paginator :rows="10" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                        <template #empty><p class="text-center"> Data not found. </p></template>
                        <Column field="user_id" header="User ID" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.user_id }}
                            </template>
                        </Column>
                        <Column field="name" header="Nama Karyawan" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.name }}
                            </template>
                        </Column>
                        <Column field="bom" header="BOM" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>BOM - {{ data.bom }}</strong>
                            </template>
                        </Column>
                        <Column field="id" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="flex justify-content-end">
                                    <Button icon="pi pi-pencil" @click="detailData(data, 'update')"/>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
