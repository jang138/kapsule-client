<template>
    <div :style="{ display: isHidden ? 'none' : 'flex' }" class="footer">
        <button class="button_add" @click="toggleMenu">
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

        <transition name="slide-fade-vertical">
            <div v-if="isMenuOpen" class="menu_options">
                <span class="menu_item" @click="appMyPage">마이페이지</span>
                <span class="menu_separator">|</span>
                <span class="menu_item" @click="addCapsule">타임캡슐 생성</span>
                <span class="menu_separator">|</span>
                <span class="menu_item" @click="addLandmark">랜드마크</span>
            </div>
        </transition>
    </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'FooterCompo',
    setup() {
        const route = useRoute();
        const router = useRouter();

        const isHidden = computed(() => route.path === '/capsule');
        const isMenuOpen = ref(false);

        function toggleMenu() {
            isMenuOpen.value = !isMenuOpen.value;
        }

        function addCapsule() {
            router.push('/capsule');
            isMenuOpen.value = false;
        }

        function appMyPage() {
            router.push('/myPage');
            isMenuOpen.value = false;
        }

        function addLandmark() {
            router.push('/landmark');
            isMenuOpen.value = false;
        }

        // Menu를 닫는 함수
        function closeMenu() {
            isMenuOpen.value = false;
        }

        // 외부 클릭 감지 함수
        function handleClickOutside(event) {
            const menu = document.querySelector('.menu_options');
            const button = document.querySelector('.button_add');

            if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
                closeMenu();
            }
        }

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            isHidden,
            isMenuOpen,
            toggleMenu,
            addCapsule,
            appMyPage,
            addLandmark,
        };
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
    position: relative;
    z-index: 1;
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

.menu_options {
    position: absolute;
    bottom: 100%;
    transform: translateX(-50);
    display: flex;
    flex-direction: row;
    background-color: rgba(55, 58, 64, 0.9);
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    font-family: 'Nanum Gothic', sans-serif;
    z-index: 2;
}

.menu_item {
    background-color: rgba(55, 58, 64, 0);
    color: #eeeeee;
    border: none;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    transition: background-color 0.3s;
}

.menu_item:hover {
    background-color: rgba(187, 187, 187, 0.8);
}

.menu_item:active {
    background-color: rgba(153, 153, 153, 0.8);
    transform: scale(0.95);
}

.menu_separator {
    display: flex;
    align-items: center;
    color: #eeeeee;
    font-size: 15px;
    padding: 0 15px;
}

.slide-fade-vertical-enter-active,
.slide-fade-vertical-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-fade-vertical-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.slide-fade-vertical-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
