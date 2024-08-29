<template>
    <div class="container">
        <h2>{{ isEdit ? '랜드마크 수정' : '새 랜드마크 추가' }}</h2>
        <form @submit.prevent="submitLandmark">
            <div>
                <label for="title">제목:</label>
                <input type="text" id="title" v-model="landmark.title" required />
            </div>
            <div>
                <label for="location">위치:</label>
                <input type="text" id="location" v-model="landmark.location" required />
            </div>

            <div>
                <label for="daterange">운영시간:</label>
                <input type="text" id="daterange" v-model="landmark.content.daterange" required />
            </div>

            <div>
                <label for="subtitle">소제목:</label>
                <input type="text" id="subtitle" v-model="landmark.content.subtitle" required />
            </div>

            <div>
                <label for="text">본문:</label>
                <textarea id="text" v-model="landmark.content.text" required></textarea>
            </div>

            <div>
                <label for="lat">위도 (Latitude):</label>
                <input type="number" id="lat" v-model="landmark.coordinates.lat" step="0.00000000000001" required />
            </div>

            <div>
                <label for="lng">경도 (Longitude):</label>
                <input type="number" id="lng" v-model="landmark.coordinates.lng" step="0.00000000000001" required />
            </div>

            <div>
                <label for="unlockDate">해제 날짜:</label>
                <input type="date" id="unlockDate" v-model="landmark.unlockDate" required />
            </div>

            <button type="submit">{{ isEdit ? '수정' : '추가' }}</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/memberStore';
// import axios from 'axios';
import axiosInstance from '@/axios';

const router = useRouter();
const memberStore = useMemberStore();

const landmark = ref({
    title: '',
    location: '',
    content: {
        daterange: '',
        subtitle: '',
        text: '',
    },
    coordinates: {
        lat: null,
        lng: null,
    },
    unlockDate: '',
    capsuleType: 2,
    member: {},
});

onMounted(() => {
    // 로그인된 사용자 정보 가져오기
    if (memberStore.isLoggedIn && memberStore.member) {
        landmark.value.member = {
            id: memberStore.member.id,
            nickname: memberStore.member.nickname,
            kakaoId: memberStore.member.kakaoId,
            role: memberStore.member.role,
        };
    } else {
        // 멤버 정보가 없을 경우 로그인 페이지로 리디렉션 또는 알림
        alert('로그인이 필요합니다.');
        router.push('/login'); // 로그인 페이지로 리디렉션
    }
});

const submitLandmark = async () => {
    try {
        // 멤버 정보가 없는 경우 방어 코드 추가
        if (!landmark.value.member.id) {
            throw new Error('멤버 정보가 없습니다. 다시 로그인해주세요.');
        }

        // Authorization 헤더에 토큰 추가
        const token = localStorage.getItem('jwtToken'); // 로컬 스토리지에서 토큰 가져오기
        if (!token) {
            throw new Error('유효한 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const response = await axiosInstance.post('/landmark/create', landmark.value, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert(response.data); // 성공 메시지 표시
        router.push('/landmark'); // 랜드마크 목록 페이지로 이동
    } catch (error) {
        if (error.response && error.response.data) {
            console.error('랜드마크 추가 중 오류 발생:', error.response.data);
            alert(error.response.data);
        } else {
            console.error('예기치 않은 오류가 발생했습니다:', error);
            alert('랜드마크 저장 중 오류가 발생했습니다.');
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
    padding: 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

form div {
    margin-bottom: 15px;
    margin-right: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    padding: 10px 15px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #4cae4c;
}
</style>
