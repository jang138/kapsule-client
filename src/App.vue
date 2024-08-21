<template>
    <div>
        <header-compo></header-compo>
        <middle-compo></middle-compo>
        <footer-compo></footer-compo>
    </div>
</template>

<script>
import FooterCompo from './components/layout/FooterCompo.vue';
import HeaderCompo from './components/layout/HeaderCompo.vue';
import MiddleCompo from './components/layout/MiddleCompo.vue';

export default {
    name: 'App',
    components: {
        HeaderCompo,
        MiddleCompo,
        FooterCompo,
    },
};
</script>

<style>
@import 'assets/base.css';
div {
    color: #2c3e50;
}
</style>
