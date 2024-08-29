<template>
    <div class="container">
        <div class="map-wrapper">
            <div class="map-container" ref="mapContainer"></div>
            <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
        </div>
        <div class="location-info" v-if="address">
            <p>현재 위치 : {{ address }}</p>
        </div>

        <div class="time-capsule-form-group">
            <div class="form-group">
                <input type="text" class="capsule-title" v-model="title" placeholder="타임캡슐 제목을 입력하세요" />
            </div>

            <div class="input-group">
                <textarea
                    class="capsule-content"
                    v-model="content"
                    :class="{ error: isContentLimitExceeded }"
                    placeholder="타임캡슐에 추가할 내용을 작성하세요"
                    rows="10"
                ></textarea>
                <div id="char-count" :class="['char-count', { exceeded: isContentLimitExceeded }]">
                    {{ content.length }}/500
                </div>
            </div>

            <!-- 이미지 업로드 -->
            <div class="form-group">
                <div class="image-grid">
                    <div v-for="(img, index) in images" :key="index" class="image-box" @click="selectImage(index)">
                        <img v-if="img" :src="img" alt="Uploaded Image" />
                        <button class="button_add" v-else @click="openFileInput">
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
                </div>
                <input type="file" ref="fileInput" @change="onImageUpload" style="display: none" />
            </div>

            <!-- 타임캡슐 개봉일 설정 -->
            <div class="form-group">
                <div class="opening-date-box">
                    <p class="box-title">타임캡슐 개봉일 설정</p>
                    <div class="radio-group">
                        <label><input type="radio" v-model="openingDate" value="5일 뒤" /> 5일 뒤</label>
                        <label><input type="radio" v-model="openingDate" value="10일 뒤" /> 10일 뒤</label>
                        <label><input type="radio" v-model="openingDate" value="30일 뒤" /> 30일 뒤</label>
                        <label class="direct-setting">
                            <input type="radio" v-model="openingDate" value="직접 설정" /> 직접 설정
                            <input
                                v-if="openingDate === '직접 설정'"
                                type="date"
                                v-model="customDate"
                                @change="updateCustomDate"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div class="button-wrapper">
                <button class="btn-create_capsule" @click="createTimeCapsule">생성</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const marker = ref(null);
const address = ref('');

// 타임캡슐 폼 관련 상태 관리
const title = ref('');
const content = ref('');
const images = ref([null, null, null]); // 이미지가 들어갈 배열 (3개)
const selectedIndex = ref(-1);
const fileInput = ref(null);

const openingDate = ref('');
const isPrivate = ref(false);
const customDate = ref('');

const contentLimit = 499;
const hasExceededLimit = ref(false);

const isContentLimitExceeded = computed(() => hasExceededLimit.value);

watch(content, (newValue) => {
    if (newValue.length > contentLimit) {
        content.value = newValue.slice(0, contentLimit + 1);
        hasExceededLimit.value = true;
    } else {
        hasExceededLimit.value = false;
    }
});

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
                level: 2,
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
                mapInstance.value.setLevel(2);

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
    console.log('타임캡슐 타이틀 : ', title.value);
    console.log('타임캡슐 내용 : ', content.value);
    console.log('타임캡슐 사진 : ', images.value);
    console.log('타임캡슐 개봉일 : ', openingDate.value);
    console.log('타임캡슐 비공개 :', isPrivate.value);
};

// 이미지를 선택하는 함수
// TODO 이미지 선택창이 두 번 연속으로 나타나는 오류 발생
const selectImage = (index) => {
    selectedIndex.value = index;
    fileInput.value.click();
};

const openFileInput = () => {
    selectedIndex.value = -1;
    fileInput.value.click();
};

const onImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            images.value[selectedIndex.value] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = null;
};

// 날짜 선택 함수
const updateCustomDate = (event) => {
    customDate.value = event.target.value;
};
</script>

<style scoped>
body,
html {
    font-family: 'Nanum Gothic', sans-serif;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
    background-color: #f9f9f9;
    overflow-x: hidden;
    overflow-y: auto;
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
    margin: 0 15px 20px 15px;
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
    margin: 10px 0;
    border-bottom: 1px solid #a2b5bb;
    border-left: none;
    border-right: none;
    border-top: none;
    font-size: 1.2em;
    font-weight: bold;
    outline: none;
    width: 100%;
    background-color: #f9f9f9;
    font-family: 'Nanum Gothic', sans-serif;
}

.capsule-content {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #a2b5bb;
    background: #ffffff;
    border-radius: 5px;
    box-sizing: border-box;
    resize: none;
    font-family: 'Nanum Gothic', sans-serif;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.char-count {
    text-align: right;
    font-size: 0.9em;
    color: #93979e;
    margin-top: 5px;
    margin-bottom: 20px;
}

.char-count.exceeded {
    color: red;
}

.image-preview img {
    max-width: 100%;
    height: auto;
    margin-top: 5px;
}

.image-grid {
    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.image-box {
    width: 30%;
    aspect-ratio: 1 / 1;
    border: 1px solid #a2b5bb;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
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

.button_add {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #686d76;
    color: #f9f9f9;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, box-shadow 0.3s;
}

.button_add .icon_plus {
    width: 20px;
    height: 20px;
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

.opening-date-box {
    background: #ffffff;
    border: 1px solid #a2b5bb;
    border-radius: 5px;
    margin-top: 20px;
    padding: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Nanum Gothic', sans-serif;
    display: flex;
    flex-direction: column;
}

.box-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.radio-group {
    display: flex;
    flex-direction: column;
}

.radio-group label {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 1em;
    color: #555;
}

.radio-group input[type='radio'] {
    margin-right: 10px;
    transform: scale(1.2);
    cursor: pointer;
    vertical-align: middle;
}

.direct-setting {
    display: flex;
    align-items: center;
}

.direct-setting input[type='date'] {
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #a2b5bb;
    border-radius: 5px;
    font-size: 1em;
}

.private-setting-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 20px 0;
}

.private-setting-group label {
    display: flex;
    align-items: center;
    font-size: 1em;
    color: #555;
}

.private-setting-group input[type='checkbox'] {
    margin-left: 10px;
    transform: scale(1.2);
    cursor: pointer;
}

.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.btn-create_capsule {
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

.btn-create_capsule:hover {
    background-color: #758694;
}

.btn-create_capsule:active {
    background-color: #405d72;
}
</style>
