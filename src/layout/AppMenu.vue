<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const payload = ref(JSON.parse(localStorage.getItem('payload')));
const token = localStorage.getItem('usertoken');
const roles = localStorage.getItem('roles');

const model = ref([]);

onMounted(() => {
    token;
    load();
    Menu();
});

const Menu = () => {
    // console.log(roles)
    if (roles == 'distributor') {
        model.value = [
            {
                label: 'Menu',
                items: [
                    { label: 'Beranda', icon: 'pi pi-fw pi-home', to: '/beranda' },
                    { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey-user' },
                ]
            },
            {
                label: 'Profile',
                items: [
                    { label: 'Update Password', icon: 'pi pi-fw pi-lock', to: '/update-password' },
                ]
            },
        ];
    } else {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
            },
            
            {
                label: 'Main Menu',
                items: [
                    { label: 'SPDK', icon: 'pi pi-fw pi-car', 
                        items: [
                            {
                                label: 'My SPDK',
                                icon: 'pi pi-fw pi-briefcase',
                                to: '/spdk'
                            },
                            {
                                label: 'Logs',
                                icon: 'pi pi-fw pi-history',
                                to: '/logs'
                            },
                        ]
                    },
                    { label: 'Meeting Room', icon: 'pi pi-fw pi-question-circle', to: '/questions', },
                    { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey', },
                ]
            },
        ]
    }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <Avatar image="/distributor.png" class="bg-red-100 mt-3" size="xlarge" shape="circle" />
            <!-- <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" class="w-6 mt-3" /> -->
        </li>
        <li class="text-center">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center mb-5">
            <span>{{ payload.email }}</span>
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
