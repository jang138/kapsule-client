<template>
    <div class="landmark-detail-container">
        <h2>{{ landmark.title }}</h2>
        <div class="landmark-image">
            <img :src="landmark.image" alt="Landmark Image" />
        </div>
        <p><strong>위치:</strong> {{ landmark.location }}</p>
        <p><strong>운영 시간:</strong> <span v-html="landmark.daterange"></span></p>
        <div v-html="landmark.description"></div>
        <button @click="goBack">Back to List</button>
    </div>
</template>

<script>
import { useLandmarkStore } from '@/stores/landmark-store';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // useRoute 훅을 import

export default {
    setup() {
        const store = useLandmarkStore();
        const route = useRoute(); // useRoute 훅 사용
        const router = useRouter(); // useRouter 훅 사용

        const landmarkId = parseInt(route.params.id); // useRoute 훅에서 id 가져오기

        const landmark = computed(() => store.getLandmarkById(landmarkId));

        const goBack = () => {
            router.push('/landmark'); // useRouter 훅에서 push 사용
        };

        return {
            landmark,
            goBack,
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
