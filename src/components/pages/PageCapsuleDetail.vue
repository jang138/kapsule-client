<template>
    <div class="container">
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
                    <div class="info-text">운영시간 : {{ landmarkData?.unlockDate }}</div>
                </div>
                <div v-else-if="capsuleType === 1" class="info-box">
                    <div class="info-icon">📅</div>
                    <div class="info-text">타임캡슐 기간 : {{ capsuleData?.unlockDate }}</div>
                </div>
            </div>

            <!-- 내용 -->
            <div class="form-group">
                <div v-if="capsuleType === 2" class="capsule-content" v-html="landmarkData?.content"></div>
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

        // 데이터 설정
        capsuleType.value = data.capsuleType;
        lat.value = data.latitude;
        lng.value = data.longitude;
        imageList.value = data.images || [];

        if (capsuleType.value === 2) {
            landmarkData.value = data;
        } else if (capsuleType.value === 1) {
            capsuleData.value = data;
        }

        loadKakaoMap(mapContainer.value);
    } catch (error) {
        console.error('타임캡슐 데이터 가져오기 오류:', error);
    }
};

onMounted(() => {
    memberStore.initializeStore();
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

.map-wrapper {
    position: relative;
    width: 100%;
    height: 30%;
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

.info-box {
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
    flex-wrap: wrap;
    gap: 10px;
}

.image-box {
    border: 1px solid #a2b5bb;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 10px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.image-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}
</style>
