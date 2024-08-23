<template>
    <div class="header" @click.stop>
        <svg class="icon_mypage" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24">
            <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
        </svg>

        <h2 class="title_header" @click="goToMain">Kapsule</h2>

        <img class="icon_kakao" src="@/assets/icon_kakao.png" alt="KakaoTalk Icon" @click="togglePopup" />

        <!-- 팝업 메뉴 -->
        <div v-if="showPopup" class="popup-menu">
            <p class="user-name">이름</p>
            <p class="user-nickname">닉네임</p>
            <button class="logout-button" @click="logout">로그아웃</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeaderCompo',
    data() {
        return {
            showPopup: false,
        };
    },
    methods: {
        goToMain() {
            console.log('Title clicked, navigating to home.');
            this.showPopup = false;
            this.$router.push('/');
        },
        togglePopup() {
            this.showPopup = !this.showPopup;

            if (this.showPopup) {
                document.addEventListener('click', this.handleOutsideClick);
                window.addEventListener('beforeunload', this.closePopup);
            } else {
                this.removeListeners();
            }
        },
        handleOutsideClick(event) {
            const popup = this.$el.querySelector('.popup-menu');
            const iconKakao = this.$el.querySelector('.icon_kakao');

            if (popup && !popup.contains(event.target) && !iconKakao.contains(event.target)) {
                this.showPopup = false;
                this.removeListeners();
            }
        },
        removeListeners() {
            document.removeEventListener('click', this.handleOutsideClick);
            window.removeEventListener('beforeunload', this.closePopup);
        },
        closePopup() {
            this.showPopup = false;
        },
        logout() {
            console.log('User logged out.');
            this.showPopup = false;
            this.removeListeners();
        },
    },
    beforeRouteLeave(to, from, next) {
        if (this.showPopup) {
            this.showPopup = false;
            this.removeListeners();
        }
        next();
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
    cursor: pointer;
    position: relative;
}

.popup-menu {
    position: absolute;
    top: 80px;
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
