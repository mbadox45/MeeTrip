<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // API
    import User_SpdkFormService from '@/api/user/SpdkFormService';
    import User_DpService from '@/api/user/DpService';
    import Misc_PaguService from '@/api/misc/PaguService'
    import VerifyService from '@/api/VerifyService'
    import {calculateConsumtionMax, localTransport, hotelCalculate, laundryCalculate} from '@/api/Databodong'

    // Components
    import DetailSpdk from '@/views/meetrip/spdk/user/components/DetailSpdk.vue';

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const wilayah = ref(["dalam wilayah", "luar wilayah", "luar negeri"])
    const uangNegara = ref(null);
    const dialogs = ref(false)
    const dataSPDK = ref(null);
    const dis_form = ref({sarapan:null, makan_malam:null, makan_siang:null, airport:null, saku:null, official:null, dualima:null, seratussatu:null, duaratus:null, hotel:null, laundry:null, transport_dilokasi:null, tiket:null, komunikasi:null})
    const form = ref({id:null, kurs_usd:0, sarapan:null, makan_siang:null, makan_malam:null, saku:null, official:null, dualima:null, seratussatu:null, duaratus:null, hotel:null, laundry:null, transport_dilokasi:null, tiket:null, komunikasi:null, airport:null})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const status = route.query.status;

    const detailSpdk = async () => {
        const id = route.params.id;
        const response = await User_SpdkFormService.getDetailMySPDK(id);
        const data = response.data.data
        return data
    }

    const load_data = async () => {
        await uangDP()
        if (status != null) {
            await load_panjar()
        }
    }

    const load_panjar = async () => {
        const load = await detailSpdk();
        console.log(load);
        const detail = load.panjar
        form.value = {
            id: route.params.id, 
            kurs_usd: detail.kurs_usd, 
            sarapan:detail.sarapan, 
            makan_siang:detail.makan_siang, 
            makan_malam:detail.makan_malam, 
            saku:detail.saku, 
            official:detail.official, 
            dualima:detail.dualima, 
            seratussatu:detail.seratussatu, 
            duaratus:detail.duaratus, 
            hotel:detail.hotel, 
            laundry:detail.laundry, 
            transport_dilokasi:detail.transport_dilokasi, 
            tiket:detail.tiket, 
            komunikasi:detail.komunikasi, 
            airport:Number(detail.airport),
        }
    }

    const uangDP = async () => {
        // Load SPDK By ID in Route
        const spdk = await detailSpdk();
        dataSPDK.value = spdk;

        // Load Uang
        const response = await Misc_PaguService.getAllUang()
        const data = response.data.data;

        // Filter By Wilayah + Jabatan
        const region =  wilayah.value[Number(spdk.wilayah)-1]
        const filteredData = data.filter(item => item.wilayah === region && item.jabatan === spdk.golongan);
        uangNegara.value = filteredData[0];
        // console.log(filteredData)
        console.log(filteredData[0])
        dis_form.value = {
            sarapan: calculateConsumtionMax(spdk, filteredData[0].pagi, 'pagi'),
            makan_malam: calculateConsumtionMax(spdk, filteredData[0].malam, 'malam'),
            makan_siang: calculateConsumtionMax(spdk, filteredData[0].siang, 'siang'),
            airport: Number(filteredData[0].airport),
            transport_dilokasi: localTransport(spdk, filteredData[0].transport_lokal),
            dualima: Number(filteredData[0].dualima),
            seratussatu: Number(filteredData[0].seratus),
            duaratus: Number(filteredData[0].duaratus),
            hotel: hotelCalculate(spdk, filteredData[0].hotel),
            laundry: laundryCalculate(spdk, filteredData[0].laundry),
            saku: localTransport(spdk, filteredData[0].saku),
            komunikasi: localTransport(spdk, filteredData[0].komunikasi),
            official: localTransport(spdk, filteredData[0].official),
        };
        console.log(dis_form.value);
        
        // Get Kurs
        await kursUSD(Number(spdk.wilayah));
    }

    const showDialog = () => {
        dialogs.value = true
        console.log(dataSPDK.value)
    }

    const kursUSD = async(reg) => {
        if (reg > 2) {
            const kurs = await VerifyService.getKurs()
            const data = kurs.data
            form.value.kurs_usd = Number(data.jual_subkursasing);
        } else {
            form.value.kurs_usd = 1
        }
    }

    onMounted(() => {
        load_data()
    });

    const reset_form = () => {
        form.value = {
            id:null, kurs_usd:null, sarapan:null, makan_siang:null, makan_malam:null, saku:null, official:null, dualima:null, seratussatu:null, duaratus:null, hotel:null, laundry:null, transport_dilokasi:null, tiket:null, komunikasi:null, airport:null
        }
    }

    const postData = async (ket) => {
        if (ket == 'save') {
            form.value = {
                // id: form.value.id == null ? route.params.id : form.value.id,
                hotel: form.value.hotel == null ? 0 : form.value.hotel,
                kurs_usd: form.value.kurs_usd == null ? 0 : form.value.kurs_usd,
                laundry: form.value.laundry == null ? 0 : form.value.laundry,
                makan_malam: form.value.makan_malam == null ? 0 : form.value.makan_malam,
                makan_siang: form.value.makan_siang == null ? 0 : form.value.makan_siang,
                official: form.value.official == null ? 0 : form.value.official,
                saku: form.value.saku == null ? 0 : form.value.saku,
                sarapan: form.value.sarapan == null ? 0 : form.value.sarapan,
                tiket: form.value.tiket == null ? 0 : form.value.tiket,
                transport_dilokasi: form.value.transport_dilokasi == null ? 0 : form.value.transport_dilokasi,
                dualima: form.value.dualima == null ? 0 : form.value.dualima,
                duaratus: form.value.duaratus == null ? 0 : form.value.duaratus,
                seratussatu: form.value.seratussatu == null ? 0 : form.value.seratussatu,
                komunikasi: form.value.komunikasi == null ? 0 : form.value.komunikasi,
                airport: form.value.airport == null ? 0 : form.value.airport,
            }
            console.log(form.value)
            try {
                if (status != null) {
                    const response = await User_DpService.putUpdateDP(route.params.id, form.value)
                    const status = response.data.success
                    if (status == true) {
                        reset_form();
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Update down payment successfully`, life: 3000 });
                        setTimeout(function() {
                            router.push('/my-spdk');
                        }, 3000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Warning', detail: `Please refresh this page and re-enter the data.`, life: 3000 });
                    }
                } else {
                    const response = await User_DpService.postAddDP(route.params.id, form.value)
                    const status = response.data.success
                    if (status == true) {
                        reset_form();
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Create down payment successfully`, life: 3000 });
                        setTimeout(function() {
                            router.push('/my-spdk');
                        }, 3000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Warning', detail: `Please refresh this page and re-enter the data.`, life: 3000 });
                    }
                }
            } catch (error) {
                toast.add({ severity: 'danger', summary: 'Error', detail: `Please confirm to ICT Development`, life: 3000 });
            }
        } else {
            router.push('/my-spdk');
        }
    }

</script>
<template>
    <form class=" py-3">
        <Toast/>
        <Dialog v-model:visible="dialogs" modal header="Header" :style="{ width: '85rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <h4>View Detail</h4>
            </template>
            <Divider><strong>BTO</strong></Divider>
            <div></div>
            <Divider><strong>Budged</strong></Divider>
        </Dialog>
        <div class="flex align-items-center justify-content-end md:justify-content-between mb-5 px-2">
            <div class="">
                <i class="mr-4 text-2xl md:text-5xl pi pi-ticket"></i>
                <strong class="text-2xl md:text-5xl font-normal">Form DP</strong>
            </div>
            <div class="hidden md:block">
                <strong class="text-500 font-light">SPDK <i class="pi pi-angle-double-right mx-2"></i> My BTO <i class="pi pi-angle-double-right mx-2"></i> Form DP</strong>
            </div>
        </div>
        <div class="card shadow-4">
            <div class="grid align-items-end">
                <div class="col-12 md:col-12 sm:col-12 ">
                    <div class="flex justify-content-between my-3 align-items-center">
                        <span class="text-lg font-semibold">
                            DOLLAR EXCHANGE RATE
                        </span>
                        <Button icon="pi pi-money-bill" label="View BTO & Budget" severity="small" link class="py-1 px-2 text-xs" @click="showDialog"/>
                    </div>
                    <div class="p-inputgroup p-fluid">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg>
                        </span>
                        <InputNumber v-model="form.kurs_usd" inputId="integeronly" disabled/>
                    </div>
                </div>
                <!-- <div class="col-12 md:col-3 sm:col-6 p-fluid">
                    <p class="text-lg font-semibold">CONSUMPTION BUDGET</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/></svg>
                        </span>
                        <InputNumber v-model="form.sarapan" inputId="minmax" :min="0" :max="dis_form.sarapan" placeholder="Breakfast Fee" />
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M488.6 23.4c31.2 31.2 31.2 81.9 0 113.1l-352 352c-31.2 31.2-81.9 31.2-113.1 0s-31.2-81.9 0-113.1l352-352c31.2-31.2 81.9-31.2 113.1 0zM443.3 92.7c-6.2-6.2-16.4-6.2-22.6 0c-12.5 12.5-23.8 15.1-37.5 17.6l-2.5 .4c-13.8 2.5-31.6 5.6-48 22c-16.7 16.7-20.9 36-24.1 50.9l0 0v0l-.2 1c-3.4 15.6-6 26.4-15.7 36.1s-20.5 12.3-36.1 15.7l-1 .2c-14.9 3.2-34.2 7.4-50.9 24.1s-20.9 36-24.1 50.9l-.2 1c-3.4 15.6-6 26.4-15.7 36.1c-9.2 9.2-18 10.8-32.7 13.4l0 0-.9 .2c-15.6 2.8-34.9 6.9-54.4 26.4c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0c12.5-12.5 23.8-15.1 37.5-17.6l2.5-.4c13.8-2.5 31.6-5.6 48-22c16.7-16.7 20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1s20.5-12.3 36.1-15.7l1-.2c14.9-3.2 34.2-7.4 50.9-24.1s20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1c9.2-9.2 18-10.8 32.7-13.4l.9-.2c15.6-2.8 34.9-6.9 54.4-26.4c6.2-6.2 6.2-16.4 0-22.6zM191.2 479.2l288-288L495 207c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41L289 495c-10.9 10.9-25.6 17-41 17s-30.1-6.1-41-17l-15.8-15.8zM17 305C6.1 294.1 0 279.4 0 264s6.1-30.1 17-41L223 17C233.9 6.1 248.6 0 264 0s30.1 6.1 41 17l15.8 15.8-288 288L17 305z"/></svg>
                        </span>
                        <InputNumber v-model="form.makan_siang" inputId="minmax" :min="0" :max="dis_form.makan_siang" placeholder="Lunch Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L110.4 80c.5 0 1.1 0 1.6 0c176.7 0 320 143.3 320 320c0 .5 0 1.1 0 1.6l44.4-11.8c20.8-5.5 36.3-24.7 34.7-47.5C498.5 159.5 352.5 13.5 169.7 .9zM399.8 410.2c.1-3.4 .2-6.8 .2-10.2c0-159.1-128.9-288-288-288c-3.4 0-6.8 .1-10.2 .2L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1L399.8 410.2zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        </span>
                        <InputNumber v-model="form.makan_malam" :min="0" :max="dis_form.makan_malam" placeholder="Dinner Fee"/>
                    </div>
                </div> -->
                <div class="col-12 md:col-3 p-fluid">
                    <p class="text-lg font-semibold">TRANSPORTATION BUDGET</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2H248.4c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48H542.8c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32z"/></svg>
                        </span>
                        <InputNumber v-model="form.airport" :min="0" :max="dis_form.airport" placeholder="Transport to Airport Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"/></svg>
                        </span>
                        <InputNumber v-model="form.tiket" :min="0" :disabled="dis_form.tiket == 0 ? true : false" placeholder="Ticket Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512"><path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H459.6c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21H280zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104H187.3zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                        </span>
                        <InputNumber v-model="form.transport_dilokasi" :min="0" :max="dis_form.transport_dilokasi" placeholder="Local Transport Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM434.7 368a48 48 0 1 1 90.5 32 48 48 0 1 1 -90.5-32zM160 336a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                        </span>
                        <InputNumber v-model="form.official" :min="0" :max="dis_form.official" :disabled="dis_form.official == 0 ? true : false" placeholder="Official Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                        </span>
                        <InputNumber v-model="form.dualima" :min="0" :max="dis_form.dualima" :disabled="dis_form.dualima == 0 ? true : false" placeholder="025 - 100 KM"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512"><path d="M64 104v88h96V96H72c-4.4 0-8 3.6-8 8zm482 88L465.1 96H384v96H546zm-226 0V96H224v96h96zM592 384H576c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H48c-26.5 0-48-21.5-48-48V104C0 64.2 32.2 32 72 32H192 352 465.1c18.9 0 36.8 8.3 49 22.8L625 186.5c9.7 11.5 15 26.1 15 41.2V336c0 26.5-21.5 48-48 48zm-64 0a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM160 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                        </span>
                        <InputNumber v-model="form.seratussatu" :min="0" :max="dis_form.seratussatu" :disabled="dis_form.seratussatu == 0 ? true : false" placeholder="101 - 200 KM"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg>
                        </span>
                        <InputNumber v-model="form.duaratus" :min="0" :max="dis_form.duaratus" :disabled="dis_form.duaratus == 0 ? true : false" placeholder="d > 200 KM"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid hidden md:block"></div>
                <div class="col-12 md:col-3 p-fluid">
                    <p class="text-lg font-semibold">ACCOMMODATION BUDGET</p>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
                        </span>
                        <InputNumber v-model="form.hotel" :min="0" :max="dis_form.hotel" placeholder="Hotel Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512"><path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"/></svg>
                        </span>
                        <InputNumber v-model="form.laundry" :min="0" :max="dis_form.laundry" placeholder="Laundry Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-3 sm:col-6 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/></svg>
                        </span>
                        <InputNumber v-model="form.sarapan" inputId="minmax" :min="0" :max="dis_form.sarapan" placeholder="Diem Fee" />
                    </div>
                </div>
                <!-- <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                        </span>
                        <InputNumber v-model="form.saku" :min="0" :max="dis_form.saku" placeholder="Diem Fee"/>
                    </div>
                </div> -->
                <div class="col-12 md:col-3 p-fluid">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="20" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
                        </span>
                        <InputNumber v-model="form.komunikasi" :min="0"  :max="dis_form.komunikasi" :disabled="dis_form.komunikasi == 0 ? true : false" placeholder="Communication Fee"/>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex gap-2">
                        <Button label="Back" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="flex justify-content-end gap-2">
                        <Button type="button" label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                        <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>