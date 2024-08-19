<template>
    <div class="middle">
        <menu-compo></menu-compo>
        <div class="content">
            <h3>Front Main</h3>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
// import MenuCompo from '../MenuCompo.vue';
export default {
    // components: { MenuCompo },
};
</script>

<style scoped>
    .middle {
        height : 80vh;
    }
</style>
