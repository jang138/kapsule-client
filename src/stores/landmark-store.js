import { defineStore } from 'pinia';

// 앞서 생성한 axiosInstance를 가져옵니다
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
            return state.landmarks.filter((landmark) => {
                const matchesQuery = landmark.title.includes(searchQuery) || landmark.location.includes(searchQuery);
                const matchesRegion =
                    selectedRegions.length === 0 || selectedRegions.includes(landmark.location.slice(0, 2));
                return matchesQuery && matchesRegion;
            });
        },
    },
    actions: {
        async fetchLandmarks() {
            try {
                const response = await axiosInstance.get('/api/landmark'); // GET /api/landmark 요청
                this.landmarks = response.data; // 서버로부터 받은 데이터를 state에 저장
            } catch (error) {
                console.error('Failed to fetch landmarks:', error);
            }
        },
        async addLandmark(formData) {
            try {
                const response = await axiosInstance.post('/api/landmark', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                this.landmarks.push(response.data); // 추가된 랜드마크를 리스트에 추가
            } catch (error) {
                console.error('Failed to add landmark:', error);
                throw error;
            }
        },
    },
});
