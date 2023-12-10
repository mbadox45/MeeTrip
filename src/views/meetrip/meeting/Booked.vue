<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    // import RequestService from '@/api/RequestService.js';
    import { URL_WEB } from '@/api/env';

    
    // Component
    import NewBooking from './components/NewBooking.vue';

    const router = useRouter();

    const dialogs = ref(false)

    const loadingTable = ref(null);
    const loadingTable2 = ref(true);
    const request_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');
    const menu = ref();
    const items = ref([
        {
            label: 'Options',
            items: [
                {
                    label: 'Booking',
                    icon: 'pi pi-plus',
                    command: () => detailData(selectedRequest.value, 'add')
                },
                {
                    label: 'Documentation',
                    icon: 'pi pi-file-pdf'
                },
            ]
        }
    ]);

    const toast = useToast();

    onMounted(() => {
        aksi()
    });
    
    const toggle = (event) => {
        menu.value.toggle(event);
    };

    const aksi = async () => {
        // loadingTable.value = 'Loading'
        try {
            const list = [];
            request_data.value = [list];
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
        if (selectedRequest.value.status > 3) {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
            ]
        } else {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
                {separator:true},
                {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => detailData(selectedRequest.value, 'edit')},
                {label: 'Cancel', icon: 'pi pi-fw pi-times', command: () => detailData(selectedRequest.value, 'cancel')},
            ]
        }
    }

    // Dialog Function
    const detailData = async(data, status) => {
        dialogs.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold">BOOKING ROOM</span>`;
        } else if (status === 'edit') {
            titledialogs.value = `<span class="font-semibold text-primary">EDIT BTO</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'approve') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">APPROVE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'dp') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">DOWN PAYMENT FORM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">DECLINE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const rowClass = (data) => {
        return [ data.status == 5 ? 'bg-primary' : data.status == 6 ? 'text-green-500 font-semibold' : data.status == 4 ? 'text-orange-500 font-semibold' : data.status == 3 ? 'text-cyan-500 font-semibold' : data.status == 2 ? 'text-cyan-500 font-semibold' : data.status == 0 ? 'bg-red-500 text-white' : ''];
    };

    const actionDialog = (status) => {
        if (status == 'add') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Created successfully`, life: 3000 });
            aksi()
        } else if (status == 'edit') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            aksi()
        } else if (status == 'warning') {
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please data not empty !`, life: 3000 });
        } else if (status == 'save') {
            dialogs.value = false
            toast.add({ severity: 'danger', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
            aksi()
        } else{
            dialogs.value = false
        }
    }

</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <Sidebar v-model:visible="dialogs" position="full" :pt="{
            header: {
                style: 'display: none'
            }
        }">
            <new-booking :data_dialog="selectedRequest" :title="titledialogs" v-if="statusRequest == 'add'" :status="statusRequest" @submit="actionDialog"/>
        </Sidebar>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-calendar"></i>
                    <strong class="text-2xl md:text-5xl font-normal">BOOKED</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Meeting Room <i class="pi pi-angle-double-right mx-2"></i> Booked</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <h6 class="text-2xl">My Business Trip Order (BTO)</h6>
                    </div>
                    <div class="w-full flex justify-content-end gap-2">
                        <Button type="button" icon="pi pi-ellipsis-v" rounded outlined severity="info" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                    </div>
                </div>
                <Divider/>
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable :value="request_data" paginator :rows="10" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <template #empty><p class="text-center"> Data not found. </p></template>
                    <Column field="location" header="Location" class="min-w-10"></Column>
                    <Column field="date" header="Date" class="min-w-10"></Column>
                    <Column field="user" header="User" class="min-w-10"></Column>
                    <Column field="start" header="Start" class="min-w-10"></Column>
                    <Column field="end" header="End" class="min-w-10"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
