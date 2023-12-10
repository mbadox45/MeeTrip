<script setup>
    import { ref, onMounted } from 'vue';
    import { APP_NAME } from '@/api/DataVariable.js';

    const apps = ref(APP_NAME);

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12 text-center p-4">
            <img :src="'/layout/meetrip.png'" alt="Home Pages" class="my-4 md:my-3 w-23rem md:w-23rem" />
            <h1 class="text-2xl font-semibold">Selamat datang di website kami,</h1>
            <h1><span class="font-bold">{{apps}}</span> <span class="font-normal">- PT. Industri Nabati Lestari</span></h1>
        </div>
    </div>
</template>