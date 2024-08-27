<template>
    <div class="app-container">
        <header-compo></header-compo>
        <middle-compo></middle-compo>
        <footer-compo></footer-compo>
    </div>
</template>

<script>
import FooterCompo from './components/layout/FooterCompo.vue';
import HeaderCompo from './components/layout/HeaderCompo.vue';
import MiddleCompo from './components/layout/MiddleCompo.vue';
import { useMemberStore } from '@/stores/memberStore';

export default {
    name: 'App',
    components: {
        HeaderCompo,
        MiddleCompo,
        FooterCompo,
    },
    setup() {
        const memberStore = useMemberStore();

        if (!memberStore.isInitialized) {
            memberStore.initializeStore();
        }

        return {};
    },
};
</script>

<style>
@import 'assets/base.css';
div {
    color: #2c3e50;
}
</style>
