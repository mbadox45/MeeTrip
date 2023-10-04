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
                // Distributor
                {
                    path: '/beranda',
                    name: 'beranda',
                    component: () => import('@/views/survey/distributor/Home/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        distributor:true,
                    }
                },
                {
                    path: '/survey-user',
                    name: 'survey-user',
                    component: () => import('@/views/survey/distributor/Survey/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        distributor:true,
                    }
                },
                {
                    path: '/update-password',
                    name: 'update-password',
                    component: () => import('@/views/survey/distributor/Profile/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        distributor:true,
                    }
                },

                // Administrator
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/survey/administrator/pages/Home.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/survey/administrator/pages/Users.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/survey/administrator/pages/Categories.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/questions',
                    name: 'questions',
                    component: () => import('@/views/survey/administrator/pages/Questions.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/survey',
                    name: 'survey',
                    component: () => import('@/views/survey/administrator/pages/Surveys/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/edit-question/:id',
                    name: 'edit-question',
                    component: () => import('@/views/survey/administrator/pages/EditQuestion.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/form-question/:cond',
                    name: 'form-question',
                    component: () => import('@/views/survey/administrator/pages/Question/Components/FormQuestions.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/form-survey/:cond',
                    name: 'form-survey',
                    component: () => import('@/views/survey/administrator/pages/Surveys/Components/FormSurvey.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/response-survey/:id',
                    name: 'response-survey',
                    component: () => import('@/views/survey/administrator/pages/Surveys/Components/ResponseSurvey.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/response-survey-byuser/:id',
                    name: 'response-survey-byuser',
                    component: () => import('@/views/survey/administrator/pages/Surveys/Components/ResponseUser.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
            ]
        },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/survey/administrator/sign/SignOut.vue'),
            meta:{
                requiresAuth: true,
                distributor:true,
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
            component: () => import('@/views/survey/administrator/sign/Verify.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/form/preview/:id',
            name: 'preview',
            component: () => import('@/views/survey/administrator/pages/FormPreview.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/survey/administrator/sign/NotFound.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 'admin') {
                if (to.matched.some((route) => route.meta.admin)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.distributor)) {
                    next();
                } else {
                    next('/beranda');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'admin') {
                next('/home');
            } else {
                next('/beranda');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
