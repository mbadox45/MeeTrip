<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    import User_SpdkApproveService from '@/api/user/SpdkApproveService.js';
    import {getLocationName} from '@/api/gmaps/MapsService.js';
    import { URL_WEB } from '@/api/env';

    
    // Component
    import {menu_1_or_5} from '@/api/components/ListMenu.js';
    import ApproveSpdk from '../../admin_ga/components/ApproveSpdk.vue';
    // import RevisiSpdk from './components/RevisiSpdk.vue';
    // import DetailSpdk from './components/DetailSpdk.vue';
    // import PrintSpdk from './components/PrintSpdk.vue';

    const router = useRouter();

    const dialogs = ref(false)

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
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
        loadingTable2.value = true
        // loadingTable.value = 'Loading'
        try {
            const response = await User_SpdkApproveService.getAtasan();
            const filteredData = response.data.data
            const data = filteredData.filter(item => item.status == '5');
            console.log(data)
            const list = [];
            for (let i = 0; i < data.length; i++) {
                let loc='';
                if (data[i].destinations.length > 0) {
                    if (data[i].destinations.length > 1) {
                        const destination = data[i].destinations
                        loc += '<ol>'
                        for (let a = 0; a < destination.length; a++) {
                            loc += `<li>${(await getLocationName(destination[a].latitude, destination[a].longitude)).formatted_address}</li>`
                        }
                        loc += '</ol>'
                    } else {
                        loc = `<span>${(await getLocationName(data[i].destinations[0].latitude, data[i].destinations[0].longitude)).formatted_address}</span>`;
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
                    user:data[i].user,
                };
            }
            request_data.value = list;
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
        menuModel.value = menu_1_or_5([() => detailData(selectedRequest.value, 'detail'), () => detailData(selectedRequest.value, 'approve'), () => detailData(selectedRequest.value, 'decline'), () => detailData(selectedRequest.value, 'print')])
    }

    // Dialog Function
    const detailData = async(data, status) => {
        statusRequest.value = status;
        if (status === 'detail') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
        } else if (status === 'revisi') {
            titledialogs.value = `<span class="font-semibold">REVISION (DOWN PAYMENT)</span> <i class="pi pi-angle-double-right text-gray-500 mx-2 text-lg"></i> ${data.nomor_surat}`;
            dialogs.value = true;
        } else if (status === 'approve') {
            dialogs.value = true;
            titledialogs.value = `<span class="font-semibold text-cyan-500">APPROVE (${data.status == 1 ? 'ASSIGNOR' : 'SUPERIOR'})</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor_surat}`;
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
            loadingTable2.value = false;
            aksi();
        } else if (ket == 'success_revisi') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Revision to user successfully`, life: 3000 });
            loadingTable2.value = false;
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
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4 v-html="titledialogs"></h4>
            </template>
            <approve-spdk :data_dialog="selectedRequest" :status_dialog="selectedRequest.status == 1 ? 'approve_pemberi_tugas' : 'approve_atasan'" v-if="statusRequest == 'approve'" @submit="postData"/>
            <!-- <detail-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'detail'"/>
            <print-spdk :data_dialog="selectedRequest" v-else-if="statusRequest == 'print'"/>
            <revisi-spdk :data_dialog="selectedRequest" v-else @submit="postData"/> -->
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div class="">
                    <i class="mr-4 text-2xl md:text-5xl pi pi-car"></i>
                    <strong class="text-2xl md:text-5xl font-normal">BTO - Approve (Superior)</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> BTO - Approve <i class="pi pi-angle-double-right mx-2"></i> Superior</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card border-round-md">
                <div class="flex justify-content-between align-items-center">
                    <div class="w-full">
                        <h6 class="text-2xl">Need to Approve - Business Trip Order (BTO)</h6>
                    </div>
                </div>
                <Divider/>
                <div v-show="loadingTable2 == true" class="text-center">
                    <h3>Loading...</h3>
                    <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                </div>
                <div v-show=" loadingTable2 == false">
                    <ContextMenu ref="cm" :model="menuModel"></ContextMenu>
                    <DataTable :value="request_data" paginator :rows="10" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" scrollable tableStyle="min-width: 50rem">
                        <template #empty><p class="text-center"> Data not found. </p></template>
                        <Column field="nomor_surat" frozen header="Reference Number" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>{{ data.nomor_surat }}</strong>
                            </template>
                        </Column>
                        <Column field="user" header="Requestor" style="min-width: 12rem">
                            <template #body="{ data }">
                                <strong>{{ data.user.name }}</strong>
                            </template>
                        </Column>
                        <Column field="golongan" header="Position" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.golongan }}
                            </template>
                        </Column>
                        <Column field="submit_date" header="Submit Date" style="min-width: 12rem">
                            <template #body="{ data }">
                                {{ data.submit_date }}
                            </template>
                        </Column>
                        <Column field="status" header="Status" style="min-width: 12rem">
                            <template #body="{ data }">
                                <Badge v-if="data.status == 1" value="Approve Pemberi Tugas" severity="info"></Badge>
                                <Badge v-else value="Approve Atasan"></Badge>
                            </template>
                        </Column>
                        <Column field="destination" header="Destination" class="min-w-10">
                            <template #body="{ data }">
                                <div v-html="data.destination"></div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
