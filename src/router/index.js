import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
// import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [
                // MEETRIP
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/meetrip/home/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        adminsdm:true,
                        adminga:true,
                        admincnb:true,
                        admincs:true,
                        user:true,
                    }
                },
                {
                    path: '/my-spdk',
                    name: 'my-spdk',
                    component: () => import('@/views/meetrip/spdk/MySpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/form-bto',
                    name: 'form-bto',
                    component: () => import('@/views/meetrip/spdk/FormBTO.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/dp-bto',
                    name: 'dp-bto',
                    component: () => import('@/views/meetrip/spdk/DPSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/booked',
                    name: 'booked',
                    component: () => import('@/views/meetrip/meeting/Booked.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/my-booking',
                    name: 'my-booking',
                    component: () => import('@/views/meetrip/meeting/MyBooking.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/test-maps',
                    name: 'test-maps',
                    component: () => import('@/views/meetrip/spdk/TestMaps.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
                {
                    path: '/test-maps2',
                    name: 'test-maps2',
                    component: () => import('@/views/meetrip/spdk/TestMaps2.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },
            ]
        },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/meetrip/sign/SignOut.vue'),
            meta:{
                requiresAuth: true,
                user:true,
                // admin:true,
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: () => import('@/views/meetrip/sign/Verify.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/meetrip/sign/NotFound.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 'superadmin') {
                if (to.matched.some((route) => route.meta.superadmin)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'adminsdm') {
                if (to.matched.some((route) => route.meta.adminsdm)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'adminga') {
                if (to.matched.some((route) => route.meta.adminga)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'admincnb') {
                if (to.matched.some((route) => route.meta.admincnb)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'admincs') {
                if (to.matched.some((route) => route.meta.admincs)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.user)) {
                    next();
                } else {
                    next('/home');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            next('/home');
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
