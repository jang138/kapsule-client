<template>
    <div v-if="isOpen" class="popup-overlay">
        <div class="popup-content">
            <h2>캡슐 코드 입력</h2>
            <input v-model="capsuleCode" placeholder="캡슐 코드를 입력하세요" />
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <div class="button-group">
                <button @click="submitCode">확인</button>
                <button @click="close">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    isOpen: Boolean,
    errorMessage: String,
});

const emit = defineEmits(['close', 'submit']);

const capsuleCode = ref('');

const submitCode = () => {
    emit('submit', capsuleCode.value);
};

const close = () => {
    emit('close');
    capsuleCode.value = '';
};
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.error-message {
    color: red;
    margin-top: 10px;
}

.popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.popup-input {
    width: 75%;
    padding: 10px;
    margin: 10px 0;
}

input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
}

.button-group {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    gap: 10px;
}

button {
    padding: 10px 20px;
    cursor: pointer;
}
</style>
