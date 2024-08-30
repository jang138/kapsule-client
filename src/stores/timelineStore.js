import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088';

export const useTimelineStore = defineStore('timeline', {
    state: () => ({
        myCapsules: [],
        sharedCapsules: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchMyCapsules(kakaoId) {
            return this.fetchData(`${API_BASE_URL}/capsule/list`, { kakaoId }, 'myCapsules');
        },

        async fetchSharedCapsules(kakaoId) {
            return this.fetchData(`${API_BASE_URL}/key/findAll`, { kakaoId }, 'sharedCapsules');
        },

        async fetchData(url, params, stateKey) {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(url, { params, headers });
                this[stateKey] = response.data;
                return response.data;
            } catch (error) {
                this.handleError(error, `Error fetching ${stateKey}`);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        handleError(error, message) {
            console.error(message, error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                console.error('Status code:', error.response.status);
                this.error = `Server error: ${error.response.status}. ${error.response.data.message || ''}`;
            } else if (error.request) {
                console.error('No response received:', error.request);
                this.error = 'No response from server';
            } else {
                console.error('Error setting up request:', error.message);
                this.error = 'Request setup error';
            }
        },

        getAllTimelineItems() {
            return [...this.myCapsules, ...this.sharedCapsules];
        },

        async addCapsule(newCapsule) {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.post(`${API_BASE_URL}/capsule/create`, newCapsule, { headers });
                this.myCapsules.push(response.data);
                return response.data;
            } catch (error) {
                this.handleError(error, 'Error adding new capsule');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteCapsule(capsuleId) {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await axios.delete(`${API_BASE_URL}/capsule/${capsuleId}`, { headers });
                this.myCapsules = this.myCapsules.filter((capsule) => capsule.id !== capsuleId);
            } catch (error) {
                this.handleError(error, 'Error deleting capsule');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteSharedCapsule(sharedCapsuleId) {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await axios.delete(`${API_BASE_URL}/key/${sharedCapsuleId}`, { headers });
                this.sharedCapsules = this.sharedCapsules.filter((capsule) => capsule.id !== sharedCapsuleId);
            } catch (error) {
                this.handleError(error, 'Error deleting shared capsule');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCapsule(capsuleId, updatedData) {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.put(`${API_BASE_URL}/capsule/${capsuleId}`, updatedData, { headers });
                const index = this.myCapsules.findIndex((capsule) => capsule.id === capsuleId);
                if (index !== -1) {
                    this.myCapsules[index] = response.data;
                }
                return response.data;
            } catch (error) {
                this.handleError(error, 'Error updating capsule');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addSharedCapsule(capsuleCode, kakaoId) {
            this.loading = true;
            try {
                const response = await axios.post(`${API_BASE_URL}/key/save`, null, {
                    params: { capsuleCode, kakaoId },
                });
                // 서버 응답을 확인하여 성공 여부를 판단합니다.
                return { success: true, data: response.data };
            } catch (error) {
                console.error('Error adding shared capsule:', error);
                return { success: false, error: error.response?.data?.message || '캡슐 추가 중 오류가 발생했습니다.' };
            } finally {
                this.loading = false;
            }
        },

        // 새 타임라인 아이템을 추가하는 함수
        addTimelineItem(newItem) {
            this.myCapsules.push(newItem);
        },
    },
});
