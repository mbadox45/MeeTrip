<script setup>
import { onMounted, ref } from 'vue';

// Components
import AppMenuItem from './AppMenuItem.vue';

// API
import { menu_superadmin, menu_adminsdm, menu_adminsdm_approve, menu_adminga, menu_adminga_approve, menu_admincnb, menu_user, menu_user_approve, menu_admincs } from '@/api/DataVariable.js';

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
    console.log(roles, payload.value.grade)
    if (roles == 'superadmin') {
        model.value = menu_superadmin;
    } else if (roles == 'adminsdm') {
        if (payload.value.grade >= 3) {
            model.value = menu_adminsdm_approve;
        } else {
            model.value = menu_adminsdm;
        }
    } else if (roles == 'adminga') {
        if (payload.value.grade >= 3) {
            model.value = menu_adminga_approve;
        } else {
            model.value = menu_adminga;
        }
    } else if (roles == 'admincnb') {
        model.value = menu_admincnb;
    } else if (roles == 'admincs') {
        model.value = menu_admincs;
    } else {
        if (payload.value.grade >= 3) {
            model.value = menu_user_approve;
        } else {
            model.value = menu_user;
        }
    }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <Avatar image="layout/inl-ori2.png" class="bg-white mt-3 " style="width: 80px; height: 80px;" shape="circle" />
            <!-- <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" class="w-6 mt-3" /> -->
        </li>
        <li class="text-center text-lg text-yellow-100">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center text-sm font-semibold text-yellow-200">
            <span>{{ payload.email }}</span>
        </li>
        <li class="text-center text-sm py-2 bg-white border-round font-semibold text-teal-600 mt-3 mb-5">
            <span class="" style="text-transform: uppercase;">{{ roles == 'adminga' ? 'admin - ga' : roles == 'adminsdm' ? 'admin - sdm' : 'user' }}</span>
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
