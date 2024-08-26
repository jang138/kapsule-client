import { defineStore } from 'pinia';
import axios from 'axios';

export const useLandmarkStore = defineStore('landmark', {
    state: () => ({
        /* 
        현재 하나하나 넣어뒀던 데이터는 따로 notion에 저장해 둠, axios가 잘 작동되는지 확인하기 위해
        public/landmarks.json에 데이터를 넣어두고 API 엔드포인트를 landmarks.json로 설정함
        */
        // 서버에서 데이터를 가져올 것이므로, 초기 상태는 빈 배열로 설정
        landmarks: [],
    }),
    getters: {
        // 특정 ID를 기반으로 해당 랜드마크를 반환하는 역할
        getLandmarkById: (state) => (id) => {
            return state.landmarks.find((landmark) => landmark.id === id);
        },
        availableRegions(state) {
            const regions = new Set();
            state.landmarks.forEach((landmark) => {
                regions.add(landmark.location.slice(0, 2));
            });
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
                // 서버에서 타임라인 아이템을 가져오는 API 호출 ->임시로 설정 중, 작동이 잘 되는지 json 파일로 테스트 완료
                const response = await axios.get('/landmarks.json');
                this.landmarks = response.data; // 서버로부터 받은 데이터를 스토어의 state에 저장
            } catch (error) {
                console.error('Failed to fetch landmarks:', error);
            }
        },
    },
});
