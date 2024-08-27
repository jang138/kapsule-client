<template>
    <div class="header">
        <h2 class="title_header" @click="goToMain">Kapsule</h2>
        <img class="icon_kakao" src="@/assets/icon_kakao.png" alt="KakaoTalk Icon" @click="togglePopup" />

        <!-- 팝업 메뉴 -->
        <div v-if="showPopup" class="popup-menu">
            <p class="user-name">{{ userNickname }}</p>
            <p class="user-role">{{ userRoleText }}</p>
            <button class="logout-button" @click="logout">로그아웃</button>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useMemberStore } from '@/stores/memberStore';

export default {
    name: 'HeaderCompo',
    setup() {
        const memberStore = useMemberStore();
        const router = useRouter(); // Vue Router에 접근하기 위해 useRouter를 사용합니다.

        const isLoggedIn = computed(() => memberStore.isLoggedIn);
        const userRole = ref('');
        const userNickname = ref('');
        const userRoleText = computed(() => {
            switch (userRole.value) {
                case 'ROLE_ADMIN':
                    return '관리자';
                case 'ROLE_FREEUSER':
                    return '일반회원';
                case 'ROLE_PAIDUSER':
                    return '구독회원';
                default:
                    return '알 수 없음'; // 기본값
            }
        });

        // `ref`를 사용하여 `showPopup` 상태를 반응형으로 관리
        const showPopup = ref(false);

        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
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

                console.log(userData);

                userNickname.value = userData.nickname;
                userRole.value = userData.role;
                memberStore.setUserInfo(userData);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        const togglePopup = () => {
            if (!isLoggedIn.value) {
                window.location.href = 'http://localhost:8088/api/v1/auth/oauth2/kakao';
                return;
            }

            showPopup.value = !showPopup.value;

            if (showPopup.value) {
                fetchUserInfo(); // 팝업이 열릴 때 사용자 정보를 가져옴
                document.addEventListener('click', handleOutsideClick);
                window.addEventListener('beforeunload', closePopup);
            } else {
                removeListeners();
            }
        };

        const handleOutsideClick = (event) => {
            const popup = document.querySelector('.popup-menu');
            const iconKakao = document.querySelector('.icon_kakao');

            if (popup && !popup.contains(event.target) && !iconKakao.contains(event.target)) {
                showPopup.value = false;
                removeListeners();
            }
        };

        const removeListeners = () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('beforeunload', closePopup);
        };

        const closePopup = () => {
            showPopup.value = false;
        };

        const logout = () => {
            memberStore.logout();
            showPopup.value = false;
            removeListeners();
            window.location.reload();
        };

        const goToMain = async () => {
            const token = localStorage.getItem('jwtToken');

            const response = await axios.get('http://localhost:8088/api/v1/print-kakaoid', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data;
            console.log(userData);

            showPopup.value = false;
            removeListeners();
            router.push('/'); // router.push('/')로 메인 페이지로 이동
        };

        return {
            isLoggedIn,
            userRole,
            userNickname,
            userRoleText,
            showPopup,
            togglePopup,
            logout,
            goToMain,
        };
    },
};
</script>

<style scoped>
.title_header {
    color: #ffffff;
    font-family: 'Piedra', cursive;
    margin: 0;
    cursor: pointer;
    text-align: center;
    flex-grow: 1;
}

.icon_kakao {
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
}

.popup-menu {
    position: absolute;
    top: 60px;
    right: 10px;
    background-color: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    text-align: left;
    width: 150px;
}

.popup-menu::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 20px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent #ffffff transparent;
    filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1));
}

.popup-menu p {
    margin: 10px 0;
    font-size: 14px;
    color: #333;
}

.logout-button {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 10px;
    cursor: pointer;
    width: 100%;
}

.logout-button:hover {
    background-color: #d32f2f;
}
</style>
