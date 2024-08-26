<template>
    <div class="container">
        <div class="map-wrapper">
            <div class="map-container" ref="mapContainer"></div>
            <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
        </div>
        <div class="location-info" v-if="address">
            <p>현재 위치 : {{ address }}</p>
        </div>

        <!-- 타임캡슐 폼 그룹 (타이틀, 콘텐츠 내용, 사진 추가, 개봉일 설정, 비공개 설정) -->
        <div class="time-capsule-form-group">
            <!-- 타임캡슐 타이틀 입력 -->
            <div class="form-group">
                <input type="text" id="title" v-model="title" placeholder="타임캡슐 타이틀 입력" />
            </div>

            <!-- 타임캡슐 콘텐츠 내용 -->
            <div class="input-group">
                <textarea
                    id="time_capsule_content"
                    v-model="content"
                    class="editable"
                    placeholder="타임캡슐 콘텐츠 내용"
                    rows="6"
                ></textarea>
                <div id="char-count" class="char-count">{{ content.length }}/100</div>
            </div>

            <!-- 사진 추가 -->
            <div class="form-group">
                <label for="image">사진 추가</label>
                <input type="file" id="image" @change="onImageUpload" />
                <div v-if="image" class="image-preview">
                    <img :src="image" alt="Uploaded Image" />
                </div>
            </div>

            <!-- 타임캡슐 개봉일 설정 -->
            <div class="form-group">
                <label>타임캡슐 개봉일 설정</label>
                <div>
                    <label><input type="radio" v-model="openingDate" value="5일 뒤" /> 5일 뒤</label>
                    <label><input type="radio" v-model="openingDate" value="10일 뒤" /> 10일 뒤</label>
                    <label><input type="radio" v-model="openingDate" value="30일 뒤" /> 30일 뒤</label>
                    <label><input type="radio" v-model="openingDate" value="날짜 세부 선택" /> 날짜 세부 선택</label>
                </div>
            </div>

            <!-- 타임캡슐 비공개 설정 -->
            <div class="form-group">
                <label><input type="checkbox" v-model="isPrivate" /> 타임캡슐 비공개</label>
            </div>

            <!-- 생성 버튼 -->
            <div class="button-wrapper">
                <button @click="createTimeCapsule">생성</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const marker = ref(null);
const address = ref('');

// 타임캡슐 폼 관련 상태 관리
const title = ref('');
const content = ref('');
const image = ref(null);
const openingDate = ref('');
const isPrivate = ref(false);

onMounted(() => {
    loadKakaoMap(mapContainer.value);
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});

const loadKakaoMap = (container) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=537a73f99669b692ea9dd4f4748255b9&libraries=services,clusterer,drawing&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 1,
            };

            mapInstance.value = new window.kakao.maps.Map(container, options);

            refreshUserLocation();
        });
    };
};

const handleResize = () => {
    if (mapInstance.value && userLocation.value) {
        mapInstance.value.setCenter(userLocation.value);
    }
};

const refreshUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                userLocation.value = new window.kakao.maps.LatLng(lat, lng);
                mapInstance.value.setCenter(userLocation.value);
                mapInstance.value.setLevel(1);

                if (marker.value) {
                    marker.value.setMap(null);
                }

                marker.value = new window.kakao.maps.Marker({
                    position: userLocation.value,
                    map: mapInstance.value,
                    title: '사용자의 위치',
                    draggable: false,
                });

                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.coord2Address(lng, lat, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        address.value = result[0].address.address_name;
                    } else {
                        address.value = 'Failed to convert address.';
                    }
                });
            },
            (error) => {
                console.error('Error getting user location: ', error);
            },
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
};

const createTimeCapsule = () => {
    console.log('타이틀:', title.value);
    console.log('콘텐츠 내용:', content.value);
    console.log('사진:', image.value);
    console.log('개봉일:', openingDate.value);
    console.log('비공개 여부:', isPrivate.value);
};

const onImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};
</script>

<style scoped>
#title {
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    border-left: none;
    border-right: none;
    border-top: none;
    font-size: 1.2em;
    font-weight: bold;
    outline: none;
    width: 100%;
    background-color: #f9f9f9;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
    background-color: #f9f9f9;
}

.map-wrapper {
    position: relative;
    width: 100%;
    height: 20%;
}

.map-container {
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
}

.refresh-location-btn {
    position: absolute;
    top: 10px;
    right: 3px;
    z-index: 10;
    padding: 5px;
    font-size: 16px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Nanum Gothic', sans-serif;
}

.refresh-location-btn:active {
    background-color: #f0f0f0;
}

.location-info {
    padding: 10px;
    background-color: #f9f9f9;
    border-top: 1px solid #ccc;
    text-align: left;
    width: 100%;
    font-family: 'Nanum Gothic', sans-serif;
}

.time-capsule-form-group {
    margin: 0 15px;
    overflow-y: auto;
    overflow-x: hidden;
}

.form-group {
    margin-bottom: 10px;
    margin-top: 10px;
}

textarea.editable {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    resize: none;
}

.char-count {
    text-align: right;
    font-size: 0.9em;
    color: #888;
}

.image-preview img {
    max-width: 100%;
    height: auto;
    margin-top: 5px;
}

.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

button {
    padding: 10px 15px;
    font-size: 12pt;
    font-weight: bold;
    width: 100px;
    background-color: #686d76;
    color: #eeeeee;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #758694;
}

button:active {
    background-color: #405d72;
}
</style>
