<script>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useMemberStore } from '@/stores/memberStore';

export default {
    name: 'OAuth',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { cookies } = useCookies();
        const memberStore = useMemberStore();

        onMounted(() => {
            const token = route.params.token;
            const expirationTime = route.params.expirationTime;

            if (!token || !expirationTime) return;

            const now = new Date().getTime();
            const expires = new Date(now + Number(expirationTime) * 1000);

            // JWT 토큰을 쿠키에 저장, 만료 시간 설정
            cookies.set('accessToken', token, { expires, path: '/' });

            // JWT 토큰을 Pinia store에 저장
            memberStore.login(token);

            // 메인 페이지로 리디렉션
            router.push('/');
        });
    },
};
</script>
