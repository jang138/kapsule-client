<template>
    <div class="container">
        <!-- 오류 메시지 -->
        <div v-if="errorMessage" class="not-found-container">
            <div class="not-found-content">
                <h1 class="not-found-title">⚠️</h1>
                <p class="not-found-description">{{ errorMessage }}</p>
                <router-link to="/" class="main-link">Go to Main</router-link>
            </div>
        </div>

        <div v-else>
            <div class="map-wrapper">
                <div class="map-container" ref="mapContainer"></div>
            </div>

            <div class="location-info" v-if="address">
                <p v-if="capsuleType === 2">랜드마크 위치 : {{ address }}</p>
                <p v-else-if="capsuleType === 1">타임캡슐 위치 : {{ address }}</p>
            </div>

            <div class="time-capsule-form-group">
                <!-- 타이틀 -->
                <div class="form-group">
                    <p v-if="capsuleType === 2" class="capsule-title">{{ landmarkData?.title }}</p>
                    <p v-else-if="capsuleType === 1" class="capsule-title">{{ capsuleData?.title }}</p>
                </div>

                <!-- 기간 또는 운영시간 -->
                <div class="form-group">
                    <div v-if="capsuleType === 2" class="info-box">
                        <div class="info-icon">🕒</div>
                        <div class="info-text">운영시간 : {{ contentData.daterange }}</div>
                    </div>
                    <div v-if="capsuleType === 2" class="landmark-subtitle">{{ contentData.subtitle }}</div>
                    <div v-else-if="capsuleType === 1" class="info-box">
                        <div class="info-icon">📅</div>
                        <div class="info-text">타임캡슐 기간 : {{ capsuleData?.unlockDate }}</div>
                    </div>
                </div>

                <!-- 내용 -->
                <div class="form-group">
                    <div v-if="capsuleType === 2" class="capsule-content">{{ contentData.text }}</div>
                    <div v-else-if="capsuleType === 1" class="capsule-content" v-html="capsuleData?.content"></div>
                </div>

                <!-- 이미지 섹션 -->
                <div class="form-group">
                    <div class="image-grid" v-if="imageList.length > 0">
                        <div class="image-box" v-for="(image, index) in imageList" :key="index">
                            <img :src="image" :alt="`Image ${index + 1}`" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '@/axios';
import { useMemberStore } from '@/stores/memberStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id);
const address = ref('');
const mapContainer = ref(null);
const mapInstance = ref(null);
const capsuleData = ref(null);
const landmarkData = ref(null);

const lat = ref(null);
const lng = ref(null);
const capsuleType = ref(null);

// 이미지 목록
const imageList = ref([]);

// 오류 메시지 상태
const errorMessage = ref(null);

// JSON 파싱된 컨텐츠 정보
const contentData = ref({
    daterange: '',
    subtitle: '',
    text: '',
});

// 지도 로딩 및 설정
const loadKakaoMap = (container) => {
    const script = document.createElement('script');
    script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=537a73f99669b692ea9dd4f4748255b9&libraries=services,clusterer,drawing&autoload=false';
    document.head.appendChild(script);

    script.onload = () => {
        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(lat.value, lng.value),
                level: 2,
            };

            mapInstance.value = new window.kakao.maps.Map(container, options);

            new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(lat.value, lng.value),
                map: mapInstance.value,
                title: '위치',
                draggable: false,
            });

            // 주소 변환
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng.value, lat.value, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    address.value = result[0].address.address_name;
                } else {
                    address.value = '주소를 가져오는 데 실패했습니다.';
                }
            });

            window.addEventListener('resize', () => {
                mapInstance.value.setCenter(new window.kakao.maps.LatLng(lat.value, lng.value));
            });
        });
    };
};

const memberStore = useMemberStore();

// API 요청 시 토큰을 헤더에 포함
const fetchCapsuleData = async () => {
    try {
        const response = await axios.get(`/capsule/${id.value}`, {
            headers: {
                Authorization: `Bearer ${memberStore.token}`,
            },
            withCredentials: true,
        });

        const data = response.data;
        const serverBaseURL = 'http://localhost:8088';

        capsuleType.value = data.capsuleType;
        lat.value = data.latitude;
        lng.value = data.longitude;
        imageList.value = data.images.map((image) => `${serverBaseURL}/${image.replace(/\\/g, '/')}`) || [];
        console.log(imageList.value);

        if (capsuleType.value === 2) {
            landmarkData.value = data;

            // content 필드가 JSON 문자열로 되어있다고 가정하고 파싱
            if (landmarkData.value.content) {
                try {
                    contentData.value = JSON.parse(landmarkData.value.content);
                } catch (error) {
                    console.error('Content JSON 파싱 중 오류 발생:', error);
                }
            }
        } else if (capsuleType.value === 1) {
            capsuleData.value = data;
        }

        loadKakaoMap(mapContainer.value);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // 접근 권한 없음
            errorMessage.value = '접근 권한이 없습니다.';
        } else if (error.response && error.response.status === 404) {
            // 데이터 없음
            errorMessage.value = '타임캡슐을 찾을 수 없습니다.';
        } else {
            // 기타 오류
            errorMessage.value = '타임캡슐 데이터 가져오기 오류';
        }
    }
};

onMounted(() => {
    fetchCapsuleData();
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
}

.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #989a9c;
    color: #333;
    font-family: 'Jersey 10', sans-serif;
    text-align: center;
    user-select: none;
}

.not-found-content {
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: shake 0.6s ease;
    transform: scale(1.2);
}

@keyframes shake {
    0% {
        transform: scale(1.2) translateX(0);
    }
    25% {
        transform: scale(1.2) translateX(-10px);
    }
    50% {
        transform: scale(1.2) translateX(10px);
    }
    75% {
        transform: scale(1.2) translateX(-10px);
    }
    100% {
        transform: scale(1.2) translateX(0);
    }
}

.not-found-title {
    font-size: 4rem;
    margin: 0;
    color: #dc3545;
    font-family: 'Jersey 10', sans-serif;
}

.not-found-subtitle {
    font-size: 2rem;
    margin: 10px 0;
}

.not-found-description {
    font-size: 1rem;
    margin-bottom: 20px;
}

.main-link {
    display: inline-block;
    padding: 10px 20px;
    font-size: 1rem;
    font-family: 'Jersey 10', sans-serif;
    color: #fff;
    background-color: #dc3545;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;
}

.main-link:hover {
    background-color: #7d0a0a;
}

.map-wrapper {
    position: relative;
    width: 100%;
    height: 50%;
}

.map-container {
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
}

.location-info {
    padding: 10px 10px 0 10px;
    background-color: #f9f9f9;
    border-top: 1px solid #ccc;
    text-align: left;
    width: 100%;
    font-family: 'Nanum Gothic', sans-serif;
}

.time-capsule-form-group {
    margin: 5px 15px;
    overflow-y: auto;
    overflow-x: hidden;
    font-family: 'Nanum Gothic', sans-serif;
}

.form-group {
    margin-bottom: 10px;
    margin-top: 10px;
    font-family: 'Nanum Gothic', sans-serif;
}

.capsule-title {
    font-size: 1.2em;
    font-weight: bold;
    border-bottom: 1px solid #a2b5bb;
    padding-bottom: 5px;
    margin-bottom: 30px;
    text-align: center;
    font-family: 'Nanum Gothic', sans-serif;
}

.landmark-subtitle {
    font-size: 1em;
    font-weight: bold;
    padding-bottom: 5px;
    margin-bottom: 30px;
    text-align: center;
    font-family: 'Nanum Gothic', sans-serif;
}

.info-box {
    width: 98%;
    display: flex;
    align-items: center;
    padding: 10px;
    background: #eeeeee;
    border: 1px solid #ededed;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.info-icon {
    font-size: 2em;
    margin-right: 10px;
}

.info-text {
    font-size: 1em;
    font-weight: bold;
    color: #45474b;
}

.capsule-content {
    width: 100%;
    min-height: 150px;
    padding: 10px 10px 20px 10px;
    background: #ffffff;
    border: 1px solid #a2b5bb;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Nanum Gothic', sans-serif;
    text-align: left;
    margin-bottom: 30px;
}

.image-grid {
    display: flex;
    gap: 10px;
    flex-direction: row;
    justify-content: center;
}

.image-box {
    width: 50%;
    border: 1px solid #a2b5bb;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 10px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.image-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}
</style>
