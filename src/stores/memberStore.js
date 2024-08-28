import { defineStore } from 'pinia';
import axios from 'axios';

export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        token: null,
        member: null,
        isLoggedIn: false,
        isInitialized: false, // 초기화 여부 상태 추가
    }),

    actions: {
        initializeStore() {
            if (this.isInitialized) return; // 이미 초기화되었으면 아무것도 하지 않음

            const token = localStorage.getItem('jwtToken');
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                this.fetchMemberData();
            } else {
                this.token = null;
                this.isLoggedIn = false;
                this.member = null;
            }

            this.isInitialized = true; // 스토어 초기화 완료
        },

        async fetchMemberData() {
            if (!this.token) return;

            try {
                const response = await axios.get('http://localhost:8088/api/v1/member-info', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.member = response.data;
            } catch (error) {
                console.error('Failed to fetch member data:', error);
                this.clearStore(); // 오류 발생 시 스토어 초기화
            }
        },

        setToken(token) {
            this.token = token;
            this.isLoggedIn = true;
            localStorage.setItem('jwtToken', token);
            this.fetchMemberData(); // 토큰 설정 후 사용자 정보 가져오기
        },

        clearStore() {
            this.token = null;
            this.isLoggedIn = false;
            this.member = null;
            this.isInitialized = false;
            localStorage.removeItem('jwtToken');
        },
    },
});
