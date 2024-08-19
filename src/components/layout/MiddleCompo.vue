<template>
    <router-view>
        <MiddleFront />
    </router-view>
</template>

<script>
import MiddleFront from '@/components/layout/MiddleFront.vue';

export default {
    components: {
        MiddleFront,
    },
};
</script>

<style scoped></style>
