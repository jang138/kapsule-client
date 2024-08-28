<script>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useMemberStore } from '@/stores/memberStore';

export default {
    name: 'OAuth',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const memberStore = useMemberStore();

        onMounted(() => {
            const token = route.params.token;
            const expirationTime = route.params.expirationTime;

            if (!token || !expirationTime) return;

            // JWT 토큰을 Pinia store에 저장
            memberStore.setToken(token);

            // 메인 페이지로 리디렉션
            router.push('/');
        });
    },
};
</script>
