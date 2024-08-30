<template>
    <div v-if="landmark" class="landmark-detail-container">
        <h2>{{ landmark.title }}</h2>
        <div class="landmark-image">
            <img
                src="https://mblogthumb-phinf.pstatic.net/MjAxODA0MDVfMTU5/MDAxNTIyOTA0MDczNDgx.9XbBJvQC0Cjd0_vRovae7PCd_96zzyNyQyc1nEtDVuAg.Xn7MGvNx5yiUOFsJUHzs8EBXTRiNvo5igzpZZ9NSYCYg.PNG.royalculture/%EA%B2%BD%EB%B3%B5%EA%B6%81%EC%82%AC%EC%A7%84.png?type=w800"
                :alt="landmark.title"
            />
        </div>
        <p><strong>위치:</strong> {{ landmark.location }}</p>
        <p v-if="landmark.content && landmark.content.daterange">
            <strong>운영 시간:</strong> <span v-html="landmark.content.daterange"></span>
        </p>
        <p v-if="landmark.content && landmark.content.subtitle">
            <strong>{{ landmark.content.subtitle }}</strong>
        </p>
        <div v-if="landmark.content && landmark.content.text" v-html="landmark.content.text"></div>
        <div class="button-container">
            <button @click="addMyPage">Add to my capsule</button>
            <button @click="goBack">Back to List</button>
            <button v-if="isAdmin" @click="update">Update</button>
        </div>
    </div>
    <div v-else>
        <p>랜드마크 정보를 불러올 수 없습니다. 다시 시도해주세요.</p>
    </div>
</template>

<script setup>
import { useLandmarkStore } from '@/stores/landmark-store';
import { useTimelineStore } from '@/stores/timelineStore';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // useRoute 훅을 import

const store = useLandmarkStore();
const timelineStore = useTimelineStore();
const route = useRoute();
const router = useRouter();

const landmarkId = parseInt(route.params.id);

// 관리자인지 확인
const isAdmin = computed(() => store.isAdmin);

// computed에서 landmark를 가져올 때 content가 유효한지 검사
const landmark = computed(() => {
    const lm = store.getLandmarkById(landmarkId);

    // content가 객체 형태로 파싱된 경우에만 사용
    if (lm && lm.content && typeof lm.content === 'object') {
        return lm;
    } else {
        console.warn('Landmark content is not in the correct JSON format:', lm);
        return null; // 또는 빈 객체를 반환할 수 있음
    }
});

const goBack = () => {
    router.push('/landmark');
};

// JWT 토큰 디코딩 함수
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};
const addMyPage = async () => {
    if (landmark.value) {
        try {
            const capsuleCode = landmark.value.capsuleCode; // 랜드마크의 capsuleCode 사용
            const jwtToken = localStorage.getItem('jwtToken');
            console.log('Retrieved JWT token:', jwtToken); // JWT 토큰 로그

            let kakaoId;

            if (jwtToken) {
                const decodedToken = decodeJWT(jwtToken);
                console.log('Decoded JWT token:', decodedToken); // 디코딩된 토큰 로그

                kakaoId = decodedToken?.sub;
                console.log('capsuleCode:', capsuleCode);
                console.log('kakaoId:', kakaoId);

                const result = await timelineStore.addSharedCapsule(capsuleCode, kakaoId);

                if (result.success) {
                    console.log('Shared capsule successfully added:', result.data);
                    router.push('/mypage'); // 성공 시 마이페이지로 이동
                } else {
                    console.error('Failed to add shared capsule:', result.error);
                }
            } else {
                console.error('JWT token is missing');
            }
        } catch (error) {
            console.error('Error in addMyPage:', error);
        }
    } else {
        console.error('Landmark is not defined');
    }
};
</script>

<style scoped>
.landmark-detail-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landmark-detail-container h2 {
    margin-bottom: 20px;
    text-align: center;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 10px;
}

.landmark-image {
    text-align: center;
    margin-bottom: 20px;
}

.landmark-image img {
    max-width: 100%;
    max-height: auto;
    border-radius: 8px;
}

p {
    margin: 10px 0;
}

button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.landmark-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}
</style>
