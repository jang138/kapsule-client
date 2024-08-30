import { defineStore } from 'pinia';
import { useMemberStore } from '@/stores/memberStore';

// 앞서 생성한 axiosInstance를 가져옵니다
import axios from 'axios';
import axiosInstance from '@/axios';

export const useLandmarkStore = defineStore('landmark', {
    state: () => ({
        landmarks: [],
    }),
    getters: {
        getLandmarkById: (state) => (id) => state.landmarks.find((landmark) => landmark.id === id),

        availableRegions(state) {
            const regions = new Set();
            state.landmarks.forEach((landmark) => regions.add(landmark.location.slice(0, 2)));
            return Array.from(regions);
        },

        filteredLandmarks: (state) => (searchQuery, selectedRegions) => {
            return state.landmarks
                .filter((landmark) => landmark !== null) // null 값을 필터링
                .filter((landmark) => {
                    const matchesQuery =
                        landmark.title.includes(searchQuery) || landmark.location.includes(searchQuery);
                    const matchesRegion =
                        selectedRegions.length === 0 || selectedRegions.includes(landmark.location.slice(0, 2));
                    return matchesQuery && matchesRegion;
                });
        },
        isAdmin() {
            const memberStore = useMemberStore();
            return memberStore.member && memberStore.member.role === 'ROLE_ADMIN';
        },
    },
    actions: {
        async fetchLandmarks() {
            try {
                const response = await axios.get('/landmarks.json');
                // const response = await axiosInstance.get('/landmark');
                this.landmarks = response.data; // 서버로부터 받은 데이터를 state에 저장
            } catch (error) {
                console.error('Failed to fetch landmarks:', error);
            }
        },
        async addLandmark(formData) {
            try {
                const token = localStorage.getItem('jwtToken');

                const response = await axiosInstance.post('/landmark', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.landmarks.push(response.data); // 추가된 랜드마크를 리스트에 추가
            } catch (error) {
                console.error('Failed to add landmark:', error);
                throw error;
            }
        },
        async deleteLandmark(landmarkId) {
            try {
                // DELETE 요청을 서버로 보냅니다.
                console.log(`Sending DELETE request to /landmark/${landmarkId}`);
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axiosInstance.delete(`http://localhost:8088/landmark/${landmarkId}`, {
                    headers,
                });

                // 서버로부터의 응답 상태 코드가 204 또는 200(일반적인 경우)이면 삭제된 것으로 간주하고 배열을 업데이트합니다.
                if (response.status === 204 || response.status === 200) {
                    this.landmarks = this.landmarks.filter((landmark) => landmark.id !== landmarkId);
                } else {
                    console.warn('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.error('Failed to delete landmark:', error);
                throw error;
            }
        },

        async findLandmarkById(landmarkId) {
            try {
                const response = await axiosInstance.get(`/landmarks/${landmarkId}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch landmark:', error);
                throw error;
            }
        },
        async updateLandmark(landmarkId, updatedLandmark) {
            try {
                await axiosInstance.put(`/landmarks/${landmarkId}`, updatedLandmark);
                // 상태 업데이트 로직 (필요시)
            } catch (error) {
                console.error('Failed to update landmark:', error);
                throw error;
            }
        },
    },
});
