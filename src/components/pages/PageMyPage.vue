<template>
    <div class="timeline-container">
        <h1 class="title">나의 타임캡슐</h1>
        <div class="search-bar">
            <input type="text" placeholder="검색..." />
            <button class="add-button" @click="addNewItem">+</button>
        </div>
        <div class="timeline-items">
            <div v-for="(item, index) in store.timelineItems" :key="index" class="timeline-item">
                <div class="item-content" @click="navigateToMain(item)">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.dateRange }}</p>
                    <p>{{ item.location }}</p>
                </div>
                <div class="item-arrow" @click="navigateToMain(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M10 17l5-5-5-5v10z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useTimelineStore } from '@/stores/timelineStore';

const router = useRouter();
const store = useTimelineStore();

const addNewItem = () => {
    const newItem = {
        title: '새 타임캡슐',
        dateRange: '2024.09.01 ~ 2024.12.01',
        location: '서울특별시 강남구 삼성동',
        coordinates: { lat: 37.514575, lng: 127.049555 },
    };

    store.addTimelineItem(newItem);
    navigateToMain(newItem);
};

const navigateToMain = (item) => {
    router.push({
        name: 'MainPage',
        params: {
            lat: item.coordinates.lat,
            lng: item.coordinates.lng,
        },
    });
};
</script>

<style scoped>
.timeline-container {
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
    margin: 0 10px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.search-bar {
    display: flex;
    margin-bottom: 20px;
}

.search-bar input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
}

.add-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
}

.timeline-item {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item-content h3 {
    margin: 0 0 5px 0;
}

.item-content p {
    margin: 0;
    color: #666;
}

.item-arrow {
    color: #007bff;
}
</style>
