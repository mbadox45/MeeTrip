import moment from "moment";

export const mata_uang = [
    {id:38, wilayah:'luar wilayah', jabatan:2, pagi:50000, siang:50000, malam:50000, hotel:500000, laundry:25000, pp:0, transport_lokal:250000, saku:150000, komunikasi:0, airport:400000, official:0}
];

export const bom = [
    {name:'BOM - 1', bom:'1'},
    {name:'BOM - 2', bom:'2'},
    {name:'BOM - 3', bom:'3'},
    {name:'BOM - 4', bom:'4'},
]

export const bg_color = [
    {status:'0', color:'red-600'},
    {status:'300', color:'cyan-500'},
    {status:'301', color:'cyan-700'},
    {status:'302', color:'teal-500'},
    {status:'303', color:'cyan-700'},
    {status:'1', color:'blue-500'},
    {status:'2', color:'orange-400'},
    {status:'3', color:'gray-500'},
    {status:'4', color:'gray-500'},
    {status:'5', color:'indigo-500'},
    {status:'6', color:'yellow-500'},
    {status:'7', color:'yellow-800'},
    {status:'8', color:'yellow-800'},
    {status:'9', color:'purple-500'},
    {status:'10', color:'blue-500'},
    {status:'11', color:'yellow-800'},
    {status:'12', color:'green-500'},
]

export const kendaraan = [
    { name: 'Public Transport', kendaraan:'Umum', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bus-front mr-2" viewBox="0 0 16 16">
                                        <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z"/>
                                        <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z"/>
                                        </svg>` },
    { name: 'Official Transport', kendaraan:'Dinas', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-car-front mr-2" viewBox="0 0 16 16">
                                    <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"/>
                                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z"/>
                                    </svg>` },
    { name: 'Private Transport', kendaraan:'Pribadi', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-car-front mr-2" viewBox="0 0 16 16">
                                    <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"/>
                                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z"/>
                                    </svg>` },
    { name: 'Airplane', kendaraan:'Pesawat', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-airplane-engines mr-2" viewBox="0 0 16 16">
                                    <path d="M8 0c-.787 0-1.292.592-1.572 1.151A4.347 4.347 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0ZM7 3c0-.432.11-.979.322-1.401C7.542 1.159 7.787 1 8 1c.213 0 .458.158.678.599C8.889 2.02 9 2.569 9 3v4a.5.5 0 0 0 .276.447l5.448 2.724a.5.5 0 0 1 .276.447v.792l-5.418-.903a.5.5 0 0 0-.575.41l-.5 3a.5.5 0 0 0 .14.437l.646.646H6.707l.647-.646a.5.5 0 0 0 .14-.436l-.5-3a.5.5 0 0 0-.576-.411L1 11.41v-.792a.5.5 0 0 1 .276-.447l5.448-2.724A.5.5 0 0 0 7 7V3Z"/>
                                    </svg>` },
];

export const down_payment = [
    { name: 'Need', uang_panjar: 1, icon:`<i class="pi pi-check-circle text-green-500 mr-2"></i>` },
    { name: 'No Need', uang_panjar: 0, icon:`<i class="pi pi-times-circle text-red-500 mr-2"></i>` },
];

const perhitungan_waktu = (t_berangkat, j_berangkat, t_sampai, j_sampai) => {
    // Assuming t_berangkat, j_berangkat, t_sampai, and j_sampai are strings
    const w_berangkat = moment(`${t_berangkat} ${j_berangkat}`);
    const w_sampai = moment(`${t_sampai} ${j_sampai}`);

    // Calculate the difference in days
    const durationInDays = w_sampai.diff(w_berangkat, 'days');

    return durationInDays;
};

export const calculateConsumtionMax = (spdk, uangs, jenis) => {
    const jam_pergi = moment(`${spdk.tgl_berangkat} ${spdk.jam_pergi}`).unix();
    const jam_kembali = moment(`${spdk.tgl_kembali} ${spdk.jam_sampai}`).unix();
    const jumlah_hari = perhitungan_waktu(spdk.tgl_berangkat, spdk.jam_pergi, spdk.tgl_kembali, spdk.jam_sampai);
    // console.log(jumlah_hari)
    let JumPagu = 0;
    if (jumlah_hari > 1) {
        if (jenis == 'pagi') {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 08:01:00`).unix()) {
                // console.log('Dapat Sarapan', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Sarapan', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 06:00:00`).unix()) {
                // console.log('Tidak Dapat Sarapan', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = 0;
            } else {
                PaguKembali = uangs;
                // console.log('Dapat Sarapan', '>> Dinas > 1 Hari, Kembali');
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 2) * uangs)
        } else if (jenis == 'siang') {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 13:01:00`).unix()) {
                // console.log('Dapat Makan Siang', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Makan Siang', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 12:00:00`).unix()) {
                // console.log('Tidak Dapat Makan Siang', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = 0;
            } else {
                // console.log('Dapat Makan Siang', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = uangs;
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 2) * uangs)
        } else {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 20:01:00`).unix()) {
                // console.log('Dapat Makan Malam', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Makan Malam', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 18:00:00`).unix()) {
                // console.log('Tidak Dapat Makan Malam', '>> Dinas > 1 Hari, Kembali');
                // 23:59:59
                PaguKembali = 0;
            } else {
                PaguKembali = uangs;
                // console.log('Dapat Makan Malam', '>> Dinas > 1 Hari, Kembali');
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 2) * uangs)
        }
    } else {
        if (jenis == 'pagi') {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 08:01:00`).unix()) {
                // console.log('Dapat Sarapan', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Sarapan', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 06:00:00`).unix()) {
                // console.log('Tidak Dapat Sarapan', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = 0;
            } else {
                PaguKembali = uangs;
                // console.log('Dapat Sarapan', '>> Dinas > 1 Hari, Kembali');
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 1) * uangs)
        } else if (jenis == 'siang') {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 13:01:00`).unix()) {
                // console.log('Dapat Makan Siang', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Makan Siang', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 12:00:00`).unix()) {
                // console.log('Tidak Dapat Makan Siang', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = 0;
            } else {
                // console.log('Dapat Makan Siang', '>> Dinas > 1 Hari, Kembali');
                PaguKembali = uangs;
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 1) * uangs)
        } else {
            let PaguBerangkat = 0;
            if (jam_pergi >= moment(`${spdk.tgl_berangkat} 00:00:00`).unix() && jam_pergi <= moment(`${spdk.tgl_berangkat} 20:01:00`).unix()) {
                // console.log('Dapat Makan Malam', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = uangs;
            } else {
                // console.log('Tidak Dapat Makan Malam', '>> Dinas > 1 Hari, Berangkat');
                PaguBerangkat = 0;
            }

            let PaguKembali = 0;
            if (jam_kembali < moment(`${spdk.tgl_kembali} 18:00:00`).unix()) {
                // console.log('Tidak Dapat Makan Malam', '>> Dinas > 1 Hari, Kembali');
                // 23:59:59
                PaguKembali = 0;
            } else {
                PaguKembali = uangs;
                // console.log('Dapat Makan Malam', '>> Dinas > 1 Hari, Kembali');
            }
            JumPagu = PaguBerangkat + PaguKembali + ((jumlah_hari - 1) * uangs)
        }
    }

    return JumPagu;
}

export const localTransport = (spdk, uangs) => {
    // const jumlah_hari = spdk.lama_hari;
    const jumlah_hari = perhitungan_waktu(spdk.tgl_berangkat, spdk.jam_pergi, spdk.tgl_kembali, spdk.jam_sampai);

    // Variable Sarapan
    const pagu = uangs;
    const TotPagu = jumlah_hari * pagu;

    return TotPagu;
}

export const hotelCalculate = (spdk, uangs) => {
    // const jumlah_hari = spdk.lama_hari - 1;
    const jumlah_hari = perhitungan_waktu(spdk.tgl_berangkat, spdk.jam_pergi, spdk.tgl_kembali, spdk.jam_sampai) - 1;

    // Variable Sarapan
    const pagu = uangs;
    let TotPagu;
    if (jumlah_hari < 0) {
        TotPagu = 0;
    } else {
        TotPagu = jumlah_hari * pagu;
    }

    return TotPagu;
}

export const laundryCalculate = (spdk, uangs) => {
    // const jumlah_hari = spdk.lama_hari - 1;
    const jumlah_hari = perhitungan_waktu(spdk.tgl_berangkat, spdk.jam_pergi, spdk.tgl_kembali, spdk.jam_sampai) - 1;

    // Variable Sarapan
    const pagu = uangs;
    let TotPagu;
    console.log(jumlah_hari)
    if (jumlah_hari < 2) {
        TotPagu = 0;
    } else {
        TotPagu = jumlah_hari * pagu;
    }

    return TotPagu;
}