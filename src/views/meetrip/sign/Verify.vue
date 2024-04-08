<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute  } from 'vue-router';
import VerifyService from '@/api/VerifyService';
import { URL_WEB, URL_WEB_Portal} from '@/api/env';

const router = useRouter();
const route = useRoute();
const time = ref(3000)
const dept = ref('')

const idUser = ref(null);
const loadings = ref(true);

onMounted(() => {
    loadParams()
});

const loadParams = async () => {
    const token = route.query.token;
    try {
        if (token == null || token == '') {
            setTimeout(function() {
                window.close();
                loadings.value = false;
            }, time.value);
        } else {
            // if token expired
            const tokenData = parseJwt(token);
            const expirationTime = tokenData.exp * 1000;
            if (Date.now() > expirationTime) {
                setTimeout(function() {
                    loadings.value = false;
                    window.location.replace(`${URL_WEB_Portal}auth/login`);
                    console.log('token expired')
                }, time.value);
            } else {
                const tokens = localStorage.getItem('usertoken');
                idUser.value = route.params.id;
                if (tokens == null) {
                    const header = {
                        headers:{
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                    
                    const response = await VerifyService.getUser(idUser.value,header);
                    const load = response.data;
                    const data = load.data;

                    let akses;
                    if (data != null) {
                        const response_akses = await VerifyService.getAkses(header)
                        const load_akses = response_akses.data;
                        const data_akses = load_akses.data;
                        const index = data_akses.find(a => a.user_id === Number(idUser.value))
                        console.log(index);
                        if (!index) {
                            console.log('No Access');
                            window.location.replace(`${URL_WEB}`);
                        } else {
                            let roles;
                            if (index.level_akses == 10) {
                                roles = 'superadmin';
                            } else if (index.level_akses == 9) {
                                roles = 'adminga';
                            } else if (index.level_akses >= 5 && index.level_akses < 9) {
                                roles = 'adminsdm';
                            } else {
                                roles = 'user';
                            }

                            // Kondisi department menggunakan number atau string
                            // if (data.department !== null) {
                            //     dept.value = data.department.department;
                            // } else {
                            //     dept.value = data.divisi;
                            // }

                            const pushdata = {
                                id :  idUser.value,
                                email : data.email,
                                name : data.name,
                                divisi : data.divisi,
                                departemen : data.departemen,
                                department : data.department,
                                division : data.division,
                                grade : data.grade,
                                level : index.level_akses,
                                type: roles,
                            }
                            console.log(pushdata);
                            // Set data in LocalStorage
                            localStorage.setItem('roles', roles);
                            localStorage.setItem('usertoken', token);
                            localStorage.setItem('payload', JSON.stringify(pushdata));

                            // Redirect to home
                            setTimeout(function() {
                                loadings.value = false;
                                window.location.replace(`${URL_WEB}home`);
                                // router.push('/home')
                            }, time.value);
                        }
                    } else {
                        console.log('User tidak terdaftar di sso');
                    }
                } else {
                    setTimeout(function() {
                        loadings.value = false;
                        // window.location.replace("http://localhost:8086/home");
                    }, time.value);
                }
            }
        }
    } catch (error) {
        setTimeout(function() {
            loadings.value = false;
            // window.location.replace("http://localhost:8086/home");
            // window.location.replace("http://192.168.1.223:8086/home");
            // router.push('/home')
        }, time.value);
    }
}
const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

</script>

<template>
    <div class="flex align-items-center justify-content-center h-screen">
        <div class="" v-show="loadings == true">
            <ProgressSpinner aria-label="Loading"/>
            <div class="text-gray-500 font-semibold">Please wait ...</div>
        </div>
    </div>
</template>