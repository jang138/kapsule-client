import { defineStore } from 'pinia';

export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        token: null,
        userInfo: null,
        isLoggedIn: false,
    }),
    actions: {
        initializeStore() {
            // 여기에 초기화 로직을 작성
            this.token = localStorage.getItem('jwtToken');
            this.isLoggedIn = !!this.token;

            if (this.isLoggedIn) {
                // 로컬 스토리지에서 JWT 토큰을 가져와서 사용자의 정보를 초기화할 수 있습니다.
            }
        },
        login(token) {
            this.token = token;
            this.isLoggedIn = true;
            localStorage.setItem('jwtToken', token);
        },
        logout() {
            this.token = null;
            this.userInfo = null;
            this.isLoggedIn = false;
            localStorage.removeItem('jwtToken');
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
        },
    },
    getters: {
        userName: (state) => state.userInfo?.name || '',
        userNickname: (state) => state.userInfo?.nickname || '',
    },
});
