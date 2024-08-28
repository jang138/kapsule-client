<template>
    <div class="header">
        <h2 class="title_header" @click="goToMain">Kapsule</h2>
        <img class="icon_kakao" src="@/assets/icon_kakao.png" alt="KakaoTalk Icon" @click="handleKakaoIconClick" />

        <!-- 팝업 메뉴 -->
        <div v-if="showPopup" class="popup-menu">
            <p class="user-name">{{ memberStore.member?.nickname }}</p>
            <p class="user-role">{{ userRoleText }}</p>
            <button class="logout-button" @click="logout">로그아웃</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/memberStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const memberStore = useMemberStore();
const { isLoggedIn, member } = storeToRefs(memberStore);

const showPopup = ref(false);

const userRoleText = computed(() => {
    switch (member.value?.role) {
        case 'ROLE_ADMIN':
            return '관리자';
        case 'ROLE_FREEUSER':
            return '일반회원';
        case 'ROLE_PAIDUSER':
            return '구독회원';
        default:
            return '';
    }
});

const handleKakaoIconClick = async () => {
    if (!isLoggedIn.value) {
        memberStore.redirectToKakaoLogin();
    } else {
        togglePopup();
    }
};

const togglePopup = async () => {
    if (!showPopup.value) {
        await memberStore.fetchMemberData();
    }
    showPopup.value = !showPopup.value;
};

const handleOutsideClick = (event) => {
    const popup = document.querySelector('.popup-menu');
    const iconKakao = document.querySelector('.icon_kakao');

    if (showPopup.value && popup && !popup.contains(event.target) && !iconKakao.contains(event.target)) {
        showPopup.value = false;
    }
};

const logout = () => {
    memberStore.logout();
    showPopup.value = false;
    router.push('/'); // 로그아웃 후 메인 페이지로 리다이렉트
};

const goToMain = () => {
    showPopup.value = false;
    router.push('/');
};

onMounted(async () => {
    document.addEventListener('click', handleOutsideClick);
    await memberStore.checkAuth(); // 컴포넌트 마운트 시 인증 상태 확인
});

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
});
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
