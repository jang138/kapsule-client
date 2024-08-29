<template>
    <div class="header">
        <h2 class="title_header" @click="goToMain">Kapsule</h2>
        <img
            class="icon_kakao"
            :src="profileImageSrc"
            :alt="isLoggedIn ? 'Profile Image' : 'KakaoTalk Icon'"
            @click="handleKakaoIconClick"
        />

        <!-- 팝업 메뉴 -->
        <div v-if="showPopup" class="popup-menu">
            <p class="user-name">{{ member?.nickname }}</p>
            <p class="user-role">{{ userRoleText }}</p>
            <button class="logout-button" @click="logout">로그아웃</button>
        </div>
    </div>
</template>

<script setup>
import kakaoIcon from '@/assets/icon_kakao.png';
import { useMemberStore } from '@/stores/memberStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const memberStore = useMemberStore();
const { isLoggedIn, member, imageUrl } = storeToRefs(memberStore);

const showPopup = ref(false);

const profileImageSrc = computed(() => {
    return isLoggedIn.value && imageUrl.value ? imageUrl.value : kakaoIcon;
});

const userRoleText = computed(() => {
    const roleMap = {
        ROLE_ADMIN: '관리자',
        ROLE_FREEUSER: '일반회원',
        ROLE_PAIDUSER: '구독회원',
    };
    return roleMap[member.value?.role] || '';
});

const handleKakaoIconClick = () => {
    if (isLoggedIn.value) {
        togglePopup();
    } else {
        memberStore.redirectToKakaoLogin();
    }
};

const togglePopup = async () => {
    if (!showPopup.value) {
        await memberStore.fetchMemberData();
    }
    showPopup.value = !showPopup.value;
};

const logout = () => {
    memberStore.logout();
    showPopup.value = false;
    router.push('/');
};

const goToMain = () => {
    showPopup.value = false;
    router.push('/');
};

watch(imageUrl, (newValue) => {
    console.log('imageUrl changed:', newValue);
});

onMounted(async () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        await memberStore.setToken(token);
    }
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
    border-radius: 50%; /* 이미지를 원형으로 만듭니다 */
    object-fit: cover; /* 이미지가 원 안에 꽉 차도록 합니다 */
    border: 2px solid #ffffff; /* 흰색 테두리 추가 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* 선택적: 약간의 그림자 효과 추가 */
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
