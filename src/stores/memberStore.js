import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088';

export const useMemberStore = defineStore('memberStore', {
    state: () => ({
        token: null,
        member: null,
        isLoggedIn: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async checkAuth() {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                this.token = token;
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

        setToken(token) {
            this.token = token;
            localStorage.setItem('jwtToken', token);
        },

        async fetchMemberData() {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/member-info`, {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.member = response.data;
            } catch (error) {
                console.error('Failed to fetch member data:', error);
                this.clearAuthentication();
                throw error;
            }
        },

        clearAuthentication() {
            this.token = null;
            this.member = null;
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
    },
});
