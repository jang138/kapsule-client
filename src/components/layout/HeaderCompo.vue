<template>
    <div class="header">
        <svg class="icon_mypage" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24">
            <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
        </svg>

        <h2 class="title_header" @click="goToMain">Kapsule</h2>

        <img class="icon_kakao" src="@/assets/icon_kakao.png" alt="KakaoTalk Icon" />
    </div>
</template>

<script>
export default {
    name: 'HeaderCompo',
    methods: {
        goToMain() {
            console.log('Title clicked, navigating to home.');
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
.icon_mypage {
    width: 40px;
    height: 40px;
    padding: 20px;
    fill: #ffffff;
}

.title_header {
    color: #ffffff;
    font-family: 'Piedra', cursive;
    margin: 0;
    cursor: pointer;
}

.icon_kakao {
    width: 40px;
    height: 40px;
    padding: 20px;
}
</style>
