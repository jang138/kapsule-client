import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://port-0-kapsule-server-m0kjv4e106cdef3c.sel4.cloudtype.app';

export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        token: null,
        member: null,
        imageUrl: null,
        isLoggedIn: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async checkAuth() {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                this.setToken(token);
                this.isLoggedIn = true;
                await this.fetchMemberData();
            }
        },

        async authenticateWithToken(token) {
            if (this.isLoggedIn && this.token) {
                console.log('Already logged in');
                return;
            }
            this.setToken(token);
            await this.fetchMemberData();
            this.isLoggedIn = true;
        },

        async setToken(token) {
            this.token = token; // 토큰 설정
            localStorage.setItem('jwtToken', token); // 로컬 스토리지에 토큰 저장
            this.decodeImageUrlFromToken(token); // 이미지 URL 디코딩
            this.isLoggedIn = true; // 로그인 상태 설정
            await this.fetchMemberData(); // 회원 데이터 가져오기
        },

        decodeImageUrlFromToken(token) {
            try {
                const decodedToken = jwtDecode(token);
                this.imageUrl = decodedToken.profileImage;
                console.log('Decoded imageUrl from token:', this.imageUrl);
            } catch (error) {
                console.error('Error decoding token:', error);
                this.imageUrl = null;
            }
        },

        async fetchMemberData() {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/member-info`, {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.member = response.data;
                this.decodeImageUrlFromToken(this.token);
            } catch (error) {
                console.error('Failed to fetch member data:', error);
                this.clearAuthentication();
            }
        },

        clearAuthentication() {
            this.token = null;
            this.member = null;
            this.imageUrl = null;
            this.isLoggedIn = false;
            localStorage.removeItem('jwtToken');
        },

        logout() {
            this.clearAuthentication();
        },

        redirectToKakaoLogin() {
            if (!this.isLoggedIn) {
                window.location.href = `${API_BASE_URL}/api/v1/auth/oauth2/kakao`;
            } else {
                console.log('User is already logged in');
            }
        },

        async loginAndFetchUserData(token) {
            this.setToken(token);
            this.isLoggedIn = true;
            await this.fetchMemberData();
            return this.imageUrl;
        },
    },
});
