<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter, useRoute } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

// API
import UserService from '@/api/UserService';
import { APP_NAME } from '@/api/DataVariable.js';

const apps = ref(APP_NAME);
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const displayConfirmation = ref(false);
const displayPassword = ref(false);
const router = useRouter();
const route = useRoute();
const route_name = computed(() => route.name)
const roles = localStorage.getItem('roles');
const payload = JSON.parse(localStorage.getItem('payload'));
const formUpdate = ref({name: payload.name, email: payload.email, password:'', c_password:''})

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const viewUpdate = () => {
    displayPassword.value = true
    formUpdate.value = {name: payload.name, email: payload.email, password:'', c_password:''}
    console.log(payload);
};

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    // const roles = localStorage.getItem('roles');
    try {
        // const resp = UserService.logoutUser();
        // const load = resp.data;
        // if (load.code == 200) {
            localStorage.removeItem('usertoken');
            localStorage.removeItem('payload');
            localStorage.removeItem('roles');
            router.push('/auth/login');
            window.close();
        // }
    } catch (error) {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('payload');
        localStorage.removeItem('roles');
        router.push('/auth/login');
        window.close();
    }
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const items = ref([
    {
        label: 'Furniture',
        icon: 'pi pi-box',
    },
    {
        label: 'Electronics',
        icon: 'pi pi-mobile',
    },
    {
        label: 'Sports',
        icon: 'pi pi-clock',
    }
]);
</script>

<template>
    <div class="py-3 px-5 fixed w-full bg-gray-100 z-3">
        <Dialog v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true" position="topright" :draggable="false">
            <template #header>
                <h4>Sign Out</h4>
            </template>
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color:red;" />
                <span class="font-semibold">Do you want to exit this app?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayConfirmation = false" class="p-button-text p-button-secondary" />
                <Button label="Yes" icon="pi pi-check" @click="onSettingsClick" class="p-button-danger" autofocus />
            </template>
        </Dialog>
        <Menubar class="shadow-2 bg-yellow-200" style="border-radius: 3rem">
            <template #start>
                <div class="flex align-items-center">
                    <router-link to="/" class="flex align-items-center">
                        <img src="/layout/meetrip.png" alt="PT Industri Nabati Lestari" class="mx-3" style="width: 50px;" />
                        <span class="text-2xl font-semibold text-pink-700 hidden sm:block md:block">{{apps}}</span>
                    </router-link>
                </div>
            </template>
            <template #end>
                <button class="p-link sm:layout-topbar-menu-button md:layout-topbar-button text-orange-400 mx-3 p-2 bg-yellow-50 border-circle" v-tooltip.bottom="'Menu'" @click="onMenuToggle()">
                    <i class="pi pi-th-large text-3xl m-1"></i>
                </button>
                    <!-- <Divider layout="vertical" class="hidden sm:block md:block"/> -->
                <button @click="displayConfirmation = true" class="p-link layout-topbar-button text-orange-400 mx-3 p-2 bg-yellow-50 border-circle" v-tooltip.bottom="'Sign Out'">
                    <i class="pi pi-sign-out text-3xl m-1"></i>
                </button>
                <!-- <div class="layout-topbar-menu" :class="topbarMenuClasses">
                </div> -->
            </template>
        </Menubar>
    </div>
    <!-- <div class="layout-topbar bg-yellow-100">
        
        <button class="p-link sm:layout-topbar-menu-button md:  layout-topbar-button text-cyan-800" v-tooltip.bottom="'Menu'" @click="onMenuToggle()">
            <i class="pi pi-th-large"></i>
        </button>
        <router-link to="/" class="layout-topbar-logo">
            <img src="/layout/meetrip.png" alt="PT Industri Nabati Lestari" class="mx-3" />
            <span>{{apps}}</span>
        </router-link>


        <button class="p-link layout-topbar-menu-button layout-topbar-button text-cyan-800" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            
            <button @click="displayConfirmation = true" class="p-link layout-topbar-button text-cyan-800">
                <i class="pi pi-sign-out"></i>
                <span>Sign Out</span>
            </button>
        </div>
    </div> -->
</template>

<style lang="scss" scoped></style>
