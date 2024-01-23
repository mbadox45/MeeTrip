<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';
    import axios from 'axios';

    // API
    import Admin_SpdkAdminService from '@/api/admin/SpdkAdminService.js';
    import { URL_WEB, GOOGLE_MAPS_API_KEYS } from '@/api/env';

    
    // Component
    import {menu_302_admin, menu_2, menu_3, menu_4} from '@/api/components/ListMenu.js';
    // Component Admin GA
    import ApproveSpdk from '@/views/meetrip/spdk/admin_ga/components/ApproveSpdk.vue';
    import RevisiSpdk from '@/views/meetrip/spdk/admin_ga/components/RevisiSpdk.vue';
    import PrintSpdk from '@/views/meetrip/spdk/admin_ga/components/PrintSpdk.vue';
    import CreateSurat from '@/views/meetrip/spdk/admin_ga/components/CreateSurat.vue';
    // Component User
    import CancelSpdk from '@/views/meetrip/spdk/user/components/CancelSpdk.vue';
    import TimelineSpdk from '@/views/meetrip/spdk/user/components/TimelineSpdk.vue';
    import DetailSpdk from '@/views/meetrip/spdk/user/components/DetailSpdk.vue';

    const router = useRouter();
    const route = useRoute();

    const dialogs = ref(false)

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const loadingTable = ref(null);
    const routes = ref(route.path)
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

    const getLocationName = async (latitude, longitude) => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: GOOGLE_MAPS_API_KEY,
                },
            });

            const locationName = response.data.results[0].formatted_address;
            return locationName
        } catch (error) {
            return 'Error fetching location name'
        }
    };
    
    const aksi = async () => {
        loadingTable2.value = true
        try {
            const response = await Admin_SpdkAdminService.getSPDK();
            const filteredData = response.data.data
            let data;
            if (payload.value.type == 'adminga') {
                if (route.path == '/bto-spdk') {
                    data = filteredData.filter(item => Number(item.status) == 302);
                } else {
                    data = filteredData.filter(item => Number(item.status) == 3 || Number(item.status) == 4);
                }
            } else {
                data = filteredData.filter(item => Number(item.status) == 2);
            }
            const list = [];
            for (let i = 0; i < data.length; i++) {
                let loc='';
                if (data[i].destinations.length > 0) {
                    if (data[i].destinations.length > 1) {
                        const destination = data[i].destinations
                        loc += '<ol>'
                        for (let a = 0; a < destination.length; a++) {
                            loc += `<li>${await getLocationName(destination[a].latitude, destination[a].longitude)}</li>`
                        }
                        loc += '</ol>'
                    } else {
                        loc = `<span>${await getLocationName(data[i].destinations[0].latitude, data[i].destinations[0].longitude)}</span>`;
                    }
                } else {
                    loc = `<span>${data[i].tujuan}</span>`;
                }
                list[i] = {
                    id: data[i].id,
                    submit_date: moment(data[i].created_at).format('DD MMMM YYYY'),
                    info: data[i].info,
                    destination: loc,
                    golongan: data[i].jabatan,
                    status: data[i].status,
                    nomor_surat: data[i].nomor_surat,
                    meta:data[i].meta,
                    kendaraan:data[i].kendaraan,
                    nama_supir:data[i].nama_supir,
                    no_kendaraan:data[i].no_kendaraan,
                    user:data[i].user,
                };
            }
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
        if (selectedRequest.value.status == 302) {
            menuModel.value = menu_302_admin([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'approve'), () => detailData(selectedRequest.value, 'revisi'), () => detailData(selectedRequest.value, 'print')])
        } else if (selectedRequest.value.status == 3) {
            menuModel.value = menu_3([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'create'), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else if (selectedRequest.value.status == 4) {
            menuModel.value = menu_4([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'submit'), () => detailData(selectedRequest.value, 'edit_surat'), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        } else {
            menuModel.value = menu_2([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'approve'), () => detailData(selectedRequest.value, 'decline'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
        }
    }

    // Dialog Function
    const detailData = async(data, status) => {
        statusRequest.value = status;
        if (status === 'detail') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'timeline') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">TIMELINE SPDK</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'revisi') {
            titledialogs.value = `<span class="font-semibold">REVISION (DOWN PAYMENT)</span> <i class="pi pi-angle-double-right text-gray-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'edit') {
            router.push(`/form-bto?id=${data.id}`);
        } else if (status === 'create') {
            titledialogs.value = `<span class="font-semibold">CREATE SURAT</span> <i class="pi pi-angle-double-right text-gray-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'edit_surat') {
            titledialogs.value = `<span class="font-semibold">EDIT SURAT</span> <i class="pi pi-angle-double-right text-gray-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'approve') {
            titledialogs.value = `<span class="font-semibold">APPROVE (${payload.value.type == 'adminga' ? 'DOWN PAYMENT': 'by HUMAN CAPITAL'})</span> <i class="pi pi-angle-double-right text-cyan-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'submit') {
            titledialogs.value = `<span class="font-semibold">SUBMIT SURAT</span> <i class="pi pi-angle-double-right text-cyan-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'decline') {
            titledialogs.value = `<span class="font-semibold">DECLINE SPDK</span> <i class="pi pi-angle-double-right text-cyan-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">PRINT SPDK</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
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
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: statusRequest == 'detail'? '85rem':'50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 v-html="titledialogs"></h4>
            </template>
            <approve-spdk :data_dialog="selectedRequest" :status_dialog="statusRequest == 'approve' ? payload.type == 'adminga'? 'approve_dp' : 'approve_hc' : 'submit_surat'" v-if="statusRequest == 'approve' || statusRequest == 'submit'" @submit="postData"/>
            <detail-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'detail'"/>
            <print-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'print'"/>
            <timeline-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'timeline'"/>
            <cancel-spdk :data_dialog="selectedRequest" :status_dialog="'decline_hc'" v-else-if="statusRequest == 'decline'" @submit="postData"/>
            <create-surat :data_dialog="selectedRequest" v-else-if="statusRequest == 'create' || statusRequest == 'edit_surat'" @submit="postData"/>
            <revisi-spdk :data_dialog="selectedRequest" v-else @submit="postData"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-car"></i>
                    <strong class="text-2xl md:text-5xl font-normal">BTO - {{ routes == '/bto-spdk' ? 'Down Payment' : 'Surat Jalan' }}</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> BTO - {{ routes == '/bto-spdk' ? 'Down Payment' : 'Surat Jalan' }} <i class="pi pi-angle-double-right mx-2" v-show="payload.type != 'adminga'"></i> {{payload.type == 'adminga' ? null: 'Human Capital'}}</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <h6 class="text-2xl">Need to {{ routes == '/bto-spdk' ? 'Approve' : 'Create Surat Jalan' }} - Business Trip Order (BTO)</h6>
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
                        <Column field="nomor_surat" header="Reference Number" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>{{ data.nomor_surat }}</strong>
                            </template>
                        </Column>
                        <Column field="user" header="Requestor" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>{{ data.user.name }}</strong>
                            </template>
                        </Column>
                        <Column field="destination" header="Destination" class="min-w-10">
                            <template #body="{ data }">
                                <div v-html="data.destination"></div>
                            </template>
                        </Column>
                        <Column field="info" header="Information" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div class="bg-cyan-500 p-2 text-white font-semibold border-round text-sm">{{ data.info }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
