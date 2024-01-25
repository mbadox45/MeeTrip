<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';
    import * as XLSX from 'xlsx';
    import moment from 'moment';
    import axios from 'axios';

    // API
    import Admin_SpdkAdminService from '@/api/admin/SpdkAdminService.js';
    import { URL_WEB, GOOGLE_MAPS_API_KEYS } from '@/api/env';
    import {bg_color} from '@/api/Databodong.js';

    
    // Component
    import {menu_all_spdk} from '@/api/components/ListMenu.js';
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
    const export_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');
    const menu = ref();
    const search = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEYS;
    const test_data = ref([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        // Add more data as needed
    ]);
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

    const exportData = () => {
        const data =  export_data.value;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report SPDK');
        XLSX.writeFile(wb, `Laporan SPDK ${moment().format('YYYY-MM-DD HHmmss')}.xlsx`);
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
            const data = response.data.data;
            const list = [];
            const list2 = [];
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                let loc='';
                let loc2='';
                if (data[i].destinations.length > 0) {
                    if (data[i].destinations.length > 1) {
                        const destination = data[i].destinations
                        loc += '<ol>'
                        for (let a = 0; a < destination.length; a++) {
                            loc += `<li>${await getLocationName(destination[a].latitude, destination[a].longitude)}</li>`
                            loc2 += `${a+1}. ${await getLocationName(destination[a].latitude, destination[a].longitude)} `
                        }
                        loc += '</ol>'
                    } else {
                        loc2 = await getLocationName(data[i].destinations[0].latitude, data[i].destinations[0].longitude);
                        loc = `<span>${await getLocationName(data[i].destinations[0].latitude, data[i].destinations[0].longitude)}</span>`;
                    }
                } else {
                    loc2 = data[i].tujuan;
                    loc = `<span>${data[i].tujuan}</span>`;
                }
                const colors = bg_color.find(item => item.status === data[i].status);
                // console.log(colors)
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
                    color: colors,
                    created_at:moment(data[i].created_at).format('DD MMMM YYYY - HH:mm:ss'),
                };
                list2[i] = {
                    // ID: data[i].id,
                    NomorSurat: data[i].nomor_surat,
                    Info: data[i].info,
                    Destination: loc2,
                    Jabatan: data[i].jabatan,
                    Kendaraan:data[i].kendaraan,
                    TotalAkomodasi:data[i].total,
                    Berangkat:`${data[i].tgl_berangkat} ${data[i].jam_pergi}`,
                    Kembali:`${data[i].tgl_kembali} ${data[i].jam_sampai}`,
                    User: data[i].user ? data[i].user.name : null,
                    PemberiTugas: data[i].pemberi_tugas,
                    TglSubmit:moment(data[i].created_at).format('YYYY-MM-DD'),
                    Keperluan:data[i].keperluan,
                };
            }
            loadingTable2.value = false
            request_data.value = list;
            export_data.value = list2;
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
        menuModel.value = menu_all_spdk([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'edit'), () => detailData(selectedRequest.value, 'print'), () => detailData(selectedRequest.value, 'timeline')])
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
                    <strong class="text-2xl md:text-5xl font-normal">All SPDK</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> All SPDK</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <i class="pi pi-download text-2xl font-bold hover:text-pink-500 cursor-pointer" v-tooltip.bottom="`Export to Excel`" @click="exportData"></i>
                    </div>
                    <div class="p-fluid w-full">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="search['global'].value" placeholder="Search [ Reference Number, Requestor, Destination, Information ]" clea/>
                        </span>
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
                                <div :class="`bg-${data.color.color} p-2 text-white font-semibold border-round text-sm`">{{ data.info }}</div>
                            </template>
                        </Column>
                        <Column field="created_at" header="Created Date" style="min-width: 12rem">
                            <template #body="{ data }">
                                <div>{{ data.created_at }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
