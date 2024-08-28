<template>
    <div v-if="landmark" class="landmark-detail-container">
        <h2>{{ landmark.title }}</h2>
        <div class="landmark-image">
            <img :src="landmark.image" alt="Landmark Image" />
        </div>
        <p><strong>위치:</strong> {{ landmark.location }}</p>
        <p v-if="landmark.content && landmark.content.daterange">
            <strong>운영 시간:</strong> <span v-html="landmark.content.daterange"></span>
        </p>
        <p v-if="landmark.content && landmark.content.subtitle">
            <strong>{{ landmark.content.subtitle }}</strong>
        </p>
        <div v-if="landmark.content && landmark.content.text" v-html="landmark.content.text"></div>
        <div class="button-container">
            <button @click="addMyPage">Add my capsule</button>
            <button @click="goBack">Back to List</button>
        </div>
    </div>
    <div v-else>
        <p>랜드마크 정보를 불러올 수 없습니다. 다시 시도해주세요.</p>
    </div>
</template>

<script>
import { useLandmarkStore } from '@/stores/landmark-store';
import { useTimelineStore } from '@/stores/timelineStore';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // useRoute 훅을 import

export default {
    setup() {
        const store = useLandmarkStore();
        const timelineStore = useTimelineStore();
        const route = useRoute();
        const router = useRouter();

        const landmarkId = parseInt(route.params.id);

        // computed에서 landmark를 가져올 때 content가 유효한지 검사
        const landmark = computed(() => {
            const lm = store.getLandmarkById(landmarkId);

            // content가 객체 형태로 파싱된 경우에만 사용
            if (lm && lm.content && typeof lm.content === 'object') {
                return lm;
            } else {
                console.warn('Landmark content is not in the correct JSON format:', lm);
                return null; // 또는 빈 객체를 반환할 수 있음
            }
        });

        const goBack = () => {
            router.push('/landmark');
        };

        const addMyPage = () => {
            if (landmark.value) {
                const newItem = {
                    title: landmark.value.title,
                    dateRange: landmark.value.content.daterange,
                    location: landmark.value.location,
                    coordinates: { lat: landmark.value.coordinates.lat, lng: landmark.value.coordinates.lng },
                };

                if (newItem.coordinates.lat && newItem.coordinates.lng) {
                    timelineStore.addTimelineItem(newItem);
                    router.push('/mypage');
                } else {
                    console.error('Coordinates are missing in newItem');
                }
            } else {
                console.error('Landmark is not defined');
            }
        };

        return {
            landmark,
            goBack,
            addMyPage,
        };
    },
};
</script>

<style scoped>
.landmark-detail-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landmark-detail-container h2 {
    margin-bottom: 20px;
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 10px;
}

.landmark-image {
    text-align: center;
    margin-bottom: 20px;
}

.landmark-image img {
    max-width: 100%;
    max-height: auto;
    border-radius: 8px;
}

p {
    margin: 10px 0;
}

button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>
