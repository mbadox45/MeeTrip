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
                        user:true,
                    }
                },
                // Roles User
                {
                    path: '/my-spdk',
                    name: 'my-spdk',
                    component: () => import('@/views/meetrip/spdk/user/MySpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        adminga:true,
                        adminsdm:true,
                    }
                },
                {
                    path: '/all-spdk',
                    name: 'all-spdk',
                    component: () => import('@/views/meetrip/spdk/admin_ga/AllSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                        superadmin:true,
                    }
                },
                {
                    path: '/form-bto',
                    name: 'form-bto',
                    component: () => import('@/views/meetrip/spdk/user/FormBTO.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                        adminsdm:true,
                        user:true,
                    }
                },
                {
                    path: '/dp-bto/:id',
                    name: 'dp-bto',
                    component: () => import('@/views/meetrip/spdk/user/DPSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                        adminsdm:true,
                        user:true,
                    }
                },
                {
                    path: '/bte/:id',
                    name: 'bte',
                    component: () => import('@/views/meetrip/spdk/user/BteSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                        adminsdm:true,
                        user:true,
                    }
                },
                {
                    path: '/check-point/:id',
                    name: 'check-point',
                    component: () => import('@/views/meetrip/spdk/user/CheckPoint.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                        adminsdm:true,
                        user:true,
                    }
                },
                {
                    path: '/room',
                    name: 'room',
                    component: () => import('@/views/meetrip/meeting/Room.vue'),
                    meta:{
                        requiresAuth: true,
                        adminga:true,
                    }
                },
                {
                    path: '/booked',
                    name: 'booked',
                    component: () => import('@/views/meetrip/meeting/Booked.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        adminga:true,
                        adminsdm:true,
                    }
                },
                {
                    path: '/my-booking',
                    name: 'my-booking',
                    component: () => import('@/views/meetrip/meeting/MyBooking.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        adminga:true,
                        adminsdm:true,
                    }
                },

                // Roles Admin GA
                {
                    path: '/bto-spdk',
                    name: 'bto-spdk',
                    component: () => import('@/views/meetrip/spdk/admin_ga/BTOSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        adminsdm:true,
                        adminga:true,
                    }
                },
                {
                    path: '/surat-jalan',
                    name: 'surat-jalan',
                    component: () => import('@/views/meetrip/spdk/admin_ga/SuratSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        adminga:true,
                    }
                },
                {
                    path: '/bte-spdk',
                    name: 'bte-spdk',
                    component: () => import('@/views/meetrip/spdk/admin_ga/BTESpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        // adminsdm:true,
                        adminga:true,
                    }
                },
                {
                    path: '/disbursement-spdk',
                    name: 'disbursement-spdk',
                    component: () => import('@/views/meetrip/spdk/admin_ga/PencairanSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        // adminsdm:true,
                        adminga:true,
                    }
                },
                {
                    path: '/bom',
                    name: 'bom',
                    component: () => import('@/views/meetrip/spdk/admin_hc/BomPage.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        adminsdm:true,
                    }
                },

                // Roles Pemberi Tugas
                // {
                //     path: '/approval',
                //     name: 'approval',
                //     component: () => import('@/views/meetrip/spdk/user/ApproveSpdk.vue'),
                //     meta:{
                //         requiresAuth: true,
                //         superadmin:true,
                //     }
                // },
                {
                    path: '/approval-assignor',
                    name: 'approval-assignor',
                    component: () => import('@/views/meetrip/spdk/user/assignor_or_superior/AssignorSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        user:true,
                        adminsdm:true,
                        adminga:true,
                        // superadmin:true,
                    }
                },
                {
                    path: '/approval-superior',
                    name: 'approval-superior',
                    component: () => import('@/views/meetrip/spdk/user/assignor_or_superior/SuperiorSpdk.vue'),
                    meta:{
                        requiresAuth: true,
                        superadmin:true,
                        user:true,
                        adminsdm:true,
                        adminga:true,
                        // superadmin:true,
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
                superadmin:true,
                adminsdm:true,
                adminga:true,
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
