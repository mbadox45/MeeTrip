<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    // import RequestService from '@/api/RequestService.js';
    import { URL_WEB } from '@/api/env';
    import Meeting_BookingService from '@/api/meeting/BookingService';

    
    // Component
    import NewBooking from '@/views/meetrip/meeting/components/NewBooking.vue';

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
            const response = await Meeting_BookingService.getMyBooking();
            const load = response.data.data;
            const list = [];
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    id: load[i].id,
                    name: load[i].user.name,
                    date: load[i].date,
                    tgl: moment(load[i].date).format('DD MMM YYYY'),
                    end_time: moment(load[i].date + ' '+load[i].end_time).format('HH:mm'),
                    start_time: moment(load[i].date + ' '+load[i].start_time).format('HH:mm'),
                    room_id: load[i].room.id,
                    room: load[i].room.name,
                    malam: load[i].malam,
                    minuman: load[i].minuman,
                    peserta: load[i].peserta,
                    purpose: load[i].purpose,
                    siang: load[i].siang,
                    snack: load[i].snack,
                    sound: load[i].sound,
                    zoom: load[i].zoom,
                };
                
            } 
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
            {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
            {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => detailData(selectedRequest.value, 'edit')},
        ]
    }

    // Dialog Function
    const detailData = async(data, status) => {
        dialogs.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span>`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold">BOOKING ROOM</span>`;
        } else if (status === 'edit') {
            titledialogs.value = `<span class="font-semibold">EDIT BOOKING</span>`;
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
            dialogs.value = false
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please data not empty !`, life: 3000 });
        } else if (status == 'danger') {
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
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: '85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 class="align-itmes-center" v-html="titledialogs"></h4>
            </template>
            <new-booking :data_dialog="selectedRequest" :title="titledialogs" v-if="statusRequest == 'add' || statusRequest == 'edit'" :status="statusRequest" @submit="actionDialog"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-calendar"></i>
                    <strong class="text-2xl md:text-5xl font-normal">BOOKING</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Meeting Room <i class="pi pi-angle-double-right mx-2"></i> Booking</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <Button severity="primary" label="Booking" size="small" icon="pi pi-plus" outlined @click="detailData(null, 'add')"/>
                    </div>
                    <div class="w-full text-right">
                        <span class="text-red-500"><i class="pi pi-exclamation-circle"></i> Please right click each row in the table to get action</span>
                        <!-- <Button type="button" icon="pi pi-ellipsis-v" rounded outlined severity="info" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
                    </div>
                </div>
                <Divider/>
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable :value="request_data" paginator :rows="10" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <template #empty><p class="text-center"> Data not found. </p></template>
                    <Column field="room" header="Location" class="min-w-10"></Column>
                    <Column field="name" header="User" class="min-w-10"></Column>
                    <Column field="tgl" header="Date" class="min-w-10"></Column>
                    <Column field="start_time" header="Start" class="min-w-10"></Column>
                    <Column field="end_time" header="End" class="min-w-10"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
