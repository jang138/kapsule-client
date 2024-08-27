<!-- <script>
import { computed, onMounted } from 'vue';
import { useMemberStore } from '@/stores/memberStore';
import LoginInfo from '@/components/pages/LoginInfo.vue';
import axios from 'axios';
// import jwt_decode from 'jwt-decode';

export default {
    name: 'LoginInfo',
    setup() {
        const memberStore = useMemberStore();

        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 JWT 토큰 가져오기
                if (!token) {
                    console.warn('No JWT token found');
                    return;
                }

                const response = await axios.get('http://localhost:8088/api/v1/user-info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = response.data;
                memberStore.setUserInfo(userData); // Pinia store에 사용자 정보 저장
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        onMounted(() => {
            if (memberStore.isLoggedIn) {
                fetchUserInfo(); // 사용자가 로그인되어 있다면 사용자 정보 가져오기
            }
        });

        const isLoggedIn = computed(() => memberStore.isLoggedIn);
        const userNickname = computed(() => memberStore.userNickname || 'Guest');

        return {
            isLoggedIn,
            userNickname,
        };
    },
    components: {
        LoginInfo,
    },
};
</script>

<style scoped>
p {
    font-size: 18px;
    margin: 5px 0;
}
</style> -->
