<template>
    <div class="footer">
        <button class="button_add" @click="addCapsule">
            <svg
                class="icon_plus"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: 'FooterCompo',
    methods: {
        addCapsule() {
            console.log('Button clicked, navigating to add capsule page.');
            this.$router.push('/capsule');
        },
    },
};
</script>

<style scoped>
.button_add {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background-color: #eeeeee;
    color: #373a40;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, box-shadow 0.3s;
}

.button_add .icon_plus {
    width: 24px;
    height: 24px;
}

.button_add:hover {
    background-color: #bbbbbb;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.button_add:active {
    background-color: #999999;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    transform: scale(0.95);
}
</style>
