<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    // import RequestService from '@/api/RequestService.js';
    import { URL_WEB, URL_API } from '@/api/env';
    import Meeting_BookingService from '@/api/meeting/BookingService';

    
    // Component
    import MeetingRoom from '@/views/meetrip/meeting/components/MeetingRoom.vue';

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
                    label: 'Add Room',
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
            const response = await Meeting_BookingService.getRoom();
            const load = response.data.data;
            const list = [];
            const modifiedURL = URL_API.replace(/\/$/, '');
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    id:load[i].id,
                    foto_room:URL_API+'uploads/room/'+load[i].foto_room,
                    name:load[i].name,
                    capacity:load[i].capacity,
                    description:load[i].description,
                }
            }
            request_data.value = list
            console.log(list)
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
            {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => detailData(selectedRequest.value, 'edit')},
        ]
    }

    // Dialog Function
    const detailData = async(data, status) => {
        dialogs.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold">ADD MEETING ROOM</span>`;
        } else {
            titledialogs.value = `<span class="font-semibold">EDIT MEETING ROOM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.name}`;
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
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: statusRequest == 'detail'? '85rem':'85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 class="align-itmes-center" v-html="titledialogs"></h4>
            </template>
            <meeting-room :data_dialog="statusRequest == 'edit' ? selectedRequest : null" :status="statusRequest" @submit="actionDialog"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-building"></i>
                    <strong class="text-2xl md:text-5xl font-normal">MEETING ROOM</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Meeting Room <i class="pi pi-angle-double-right mx-2"></i> Room Master</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <Button severity="primary" label="Add Room" size="small" icon="pi pi-plus" outlined @click="detailData(null, 'add')"/>
                    </div>
                    <div class="w-full flex justify-content-end">
                        <span class="text-red-500"><i class="pi pi-exclamation-circle"></i> Please right click each row in the table to get action</span>
                        <!-- <Button type="button" icon="pi pi-ellipsis-v" rounded outlined severity="info" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" /> -->
                    </div>
                </div>
                <Divider/>
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable :value="request_data" paginator :rows="10" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <template #empty><p class="text-center"> Data not found. </p></template>
                    <Column field="name" header="Room Name" class="min-w-10"></Column>
                    <Column field="capacity" header="Capacity" class="min-w-10"></Column>
                    <Column field="foto_" header="Image" class="min-w-10">
                        <template #body="{ data }">
                            <Image :src="data.foto_room" alt="Image" width="70" preview />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
