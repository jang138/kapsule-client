<template>
    <div>
        <h1>타임캡슐 상세 페이지</h1>
        <p>Latitude: {{ lat }}</p>
        <p>Longitude: {{ lng }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const lat = ref(route.params.lat);
const lng = ref(route.params.lng);

onMounted(() => {
    console.log('Latitude:', lat.value);
    console.log('Longitude:', lng.value);
});
</script>

<style scoped></style>
