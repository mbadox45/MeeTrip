<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';
    import axios from 'axios';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService.js';
    import { URL_WEB, GOOGLE_MAPS_API_KEYS } from '@/api/env';
    import { getLocationName } from '@/api/gmaps/MapsService'
    import {bg_color} from '@/api/Databodong.js';

    
    // Component
    import {menu_300, menu_301, menu_302, menu_303, menu_0_or_12, menu_1, menu_6, menu_7, menu_8} from '@/api/components/ListMenu.js';
    import SubmitDp from '@/views/meetrip/spdk/user/components/SubmitDp.vue';
    import DetailSpdk from '@/views/meetrip/spdk/user/components/DetailSpdk.vue';
    import CancelSpdk from '@/views/meetrip/spdk/user/components/CancelSpdk.vue';
    import TimelineSpdk from '@/views/meetrip/spdk/user/components/TimelineSpdk.vue';
    import PrintSpdk from '@/views/meetrip/spdk/admin_ga/components/PrintSpdk.vue';
    // import CheckPoint from './components/CheckPoint.vue';

    const router = useRouter();

    const dialogs = ref(false)

    const loadingTable = ref(null);
    const loadingTable2 = ref(false);
    const request_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');
    const menu = ref();
    const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEYS;
    const items = ref([
        {
            label: 'Options',
            items: [
                {
                    label: 'New BTO',
                    icon: 'pi pi-plus',
                    command : ()=> detailData([],'add')
                },
                {
                    label: 'Documentation',
                    icon: 'pi pi-file-pdf'
                },
                {
                    label: 'Fee Terms',
                    icon: 'pi pi-file-pdf'
                }
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
        loadingTable2.value = true
        try {
            const response = await User_SpdkFormService.getMySPDK();
            const data = response.data.data
            const list = [];
            for (let i = 0; i < data.length; i++) {
                let loc='';
                if (data[i].destinations.length > 0) {
                    if (data[i].destinations.length > 1) {
                        const destination = data[i].destinations
                        loc += '<ol>'
                        for (let a = 0; a < destination.length; a++) {
                            const lokasi = await getLocationName(destination[a].latitude, destination[a].longitude);
                            loc += `<li>${lokasi.formatted_address}</li>`
                        }
                        loc += '</ol>'
                    } else {
                        const lokasi = await getLocationName(data[i].destinations[0].latitude, data[i].destinations[0].longitude)
                        loc = `<span>${lokasi.formatted_address}</span>`;
                    }
                } else {
                    loc = `<span>${data[i].tujuan}</span>`;
                }
                const colors = bg_color.find(item => item.status === data[i].status);
                list[i] = {
                    id: data[i].id,
                    submit_date: moment(data[i].created_at).format('DD MMMM YYYY'),
                    info: data[i].info,
                    destination: loc,
                    status: Number(data[i].status),
                    nomor_surat: data[i].nomor_surat,
                    meta:data[i].meta,
                    note:data[i].note,
                    user:data[i].user,
                    color: colors
                };
            }
            request_data.value = list;
            loadingTable2.value = false
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
        if (selectedRequest.value.status == 300) {
            menuModel.value = menu_300([() => detailData(selectedRequest.value, 'detail'), () => router.push(`/dp-bto/${selectedRequest.value.id}`), () => window.open(URL_WEB+'print/'+selectedRequest.value.id), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'cancel'), () => detailData(selectedRequest.value, 'print'),() => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 301) {
            menuModel.value = menu_301([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'submit_dp'), () => detailData(selectedRequest.value, 'edit_dp'), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 302) {
            menuModel.value = menu_302([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'cancel'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 303) {
            menuModel.value = menu_303([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'submit_dp'), () => detailData(selectedRequest.value, 'edit_dp'), () => detailData(selectedRequest.value, 'cancel'), () => detailData(selectedRequest.value, 'info'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 1) {
            menuModel.value = menu_1([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 6) {
            menuModel.value = menu_6([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'check_point'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 7) {
            menuModel.value = menu_7([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'isi_bte'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 8) {
            menuModel.value = menu_8([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'edit_bte'), () => detailData(selectedRequest.value, 'submit_bte'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else {
            menuModel.value = menu_0_or_12([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        }
    }

    // Dialog Function
    const detailData = async(data, status) => {
        statusRequest.value = status;
        if (status === 'detail') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold">NEW BTO</span>`;
            router.push('/form-bto');
        } else if (status === 'edit') {
            router.push(`/form-bto?id=${data.id}`);
            titledialogs.value = `<span class="font-semibold text-gray-500">EDIT BTO</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'approve') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">APPROVE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'dp') {
            router.push('/dp-bto');
        } else if (status === 'isi_bte') {
            router.push(`/bte/${data.id}`);
        } else if (status === 'edit_bte') {
            router.push(`/bte/${data.id}?type=edit`);
        } else if (status === 'edit_dp') {
            router.push(`/dp-bto/${data.id}?status=edit`);
        } else if (status === 'submit_dp') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold text-cyan-500">SUBMIT DOWN PAYMENT</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'submit_bte') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold text-cyan-500">SUBMIT BTE</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'info') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">REVISION INFO DOWN PAYMENT</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'check_point') {
            router.push(`/check-point/${data.id}`);
        } else if (status === 'timeline') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold text-cyan-500">TIMELINE SPDK</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'print') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">PRINT SPDK</span> <i class="pi pi-angle-double-right mx-2 text-lg text-cyan-500"></i> ${data.nomor_surat}`;
        } else {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold text-red-500">CANCEL SPDK</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        }
    }

    const rowClass = (data) => {
        return [ data.status == 5 ? 'bg-primary' : data.status == 6 ? 'text-green-500 font-semibold' : data.status == 4 ? 'text-orange-500 font-semibold' : data.status == 3 ? 'text-cyan-500 font-semibold' : data.status == 2 ? 'text-cyan-500 font-semibold' : data.status == 0 ? 'bg-red-500 text-white' : ''];
    };

    const postData = (ket) => {
        // console.log('test')
        dialogs.value = false
        if (ket == 'success_cancel') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Cancel successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_submit_dp') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Submit down payment successfully`, life: 3000 });
            aksi();
        } else if (ket == 'success_submit_bte') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Submit BTE successfully`, life: 3000 });
            aksi();
        } else if (ket == 'danger') {
            toast.add({ severity: 'danger', summary: 'Successfully', detail: `Please confirm IT Team`, life: 3000 });
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
                <h4 class="align-itmes-center" v-html="titledialogs"></h4>
            </template>
            <cancel-spdk :data_dialog="selectedRequest" :status_dialog="'cancel'" v-if="statusRequest == 'cancel'" @submit="postData"/>
            <print-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'print'" @submit="postData"/>
            <detail-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'detail'"/>
            <submit-dp v-else-if="statusRequest == 'submit_dp' || statusRequest == 'submit_bte'" :data_dialog="selectedRequest" :status_dialog="statusRequest" @submit="postData" />
            <!-- <check-point v-else-if="statusRequest == 'check_point'" :data_dialog="selectedRequest" @submit="postData" /> -->
            <div v-else-if="statusRequest == 'info'" class="h-10rem bg-yellow-100 p-3">
                <span class="font-semibold">INFORMATION :</span>
                <p class="mt-2">{{selectedRequest.note}}</p>
            </div>
            <timeline-spdk v-else :data_dialog="selectedRequest" />
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-car"></i>
                    <strong class="text-2xl md:text-5xl font-normal">My SPDK</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> My BTO</strong>
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
                        <Button type="button" icon="pi pi-cog text-2xl" rounded @click="toggle" aria-haspopup="true" severity="info" aria-controls="overlay_menu" />
                        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                    </div>
                </div>
                <Divider/>
                <div v-show="loadingTable2 == true" class="text-center">
                    <h3>Loading...</h3>
                    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                </div>
                <div v-show=" loadingTable2 == false">
                    <ContextMenu ref="cm" :model="menuModel"></ContextMenu>
                    <DataTable :value="request_data" paginator :rows="10" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                        <template #empty><p class="text-center"> Data not found. </p></template>
                        <Column field="submit_date" header="Submit Date" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.submit_date }}
                            </template>
                        </Column>
                        <Column field="destination" header="Destination" class="min-w-10">
                            <template #body="{ data }">
                                <div v-html="data.destination"></div>
                            </template>
                        </Column>
                        <Column field="info" header="Status" class="min-w-10">
                            <template #body="{ data }">
                                <div :class="`bg-${data.color.color} p-2 text-white font-semibold border-round text-md uppercase`">{{ data.info }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
