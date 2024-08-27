<template>
    <div class="container">
        <h2>새 랜드마크 추가</h2>
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

            <button type="submit">랜드마크 추가</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            landmark: {
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
                capsuleType: 2, // 캡슐 타입을 2로 설정
                member: {
                    id: 1, // 임시 멤버 ID
                    nickname: '관리자', // 임시 닉네임
                    kakaoId: 'Kakao_TMP_06', // 임시 카카오 ID
                    role: 'ROLE_ADMIN', // 임시 역할
                },
            },
        };
    },
    methods: {
        async submitLandmark() {
            try {
                const response = await axios.post('/api/landmark/create', this.landmark);
                alert(response.data); // 성공 메시지 표시
                this.$router.push({ name: 'LandmarkList' }); // 랜드마크 목록 페이지로 이동
            } catch (error) {
                console.error('랜드마크 추가 중 오류 발생:', error.response.data);
                alert('랜드마크 저장 중 오류가 발생했습니다.');
            }
        },
    },
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
