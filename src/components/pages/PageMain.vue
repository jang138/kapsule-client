<template>
    <div class="map-wrapper">
        <div class="map-container" ref="mapContainer"></div>
        <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
        <div v-if="store.error" class="error-message">{{ store.error }}</div>
    </div>
</template>

<script setup>
import { useTimelineStore } from '@/stores/timelineStore';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const userMarker = ref(null);
const address = ref('');
const isMapReady = ref(false);
const store = useTimelineStore();
const timelineMarkers = ref([]);
const overlays = ref([]);
const isUserLocationActive = ref(false);

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

const moveToLocation = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const location = new window.kakao.maps.LatLng(lat, lng);
    userLocation.value = location;

    mapInstance.value.setCenter(location);
    mapInstance.value.setLevel(1);

    if (isUserLocationActive.value) {
        updateUserMarker(lat, lng);
    } else {
        updateAddress(lat, lng);
    }
};

const updateUserMarker = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    if (userMarker.value) {
        userMarker.value.setMap(null);
    }

    userMarker.value = new window.kakao.maps.Marker({
        position: position,
        map: mapInstance.value,
        title: '현재 위치',
        draggable: false,
        image: new window.kakao.maps.MarkerImage(
            `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="40" r="30" fill="#FF0000" opacity="0.2"/>
                    <circle cx="50" cy="40" r="15" fill="#FF0000"/>
                </svg>
            `)}`,
            new window.kakao.maps.Size(50, 50),
            {
                offset: new window.kakao.maps.Point(25, 25),
            },
        ),
    });
};

const updateTimelineMarkers = () => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    // 기존 타임라인 마커 및 오버레이 제거
    timelineMarkers.value.forEach((marker) => marker.setMap(null));
    timelineMarkers.value = [];
    overlays.value.forEach((overlay) => overlay.setMap(null));
    overlays.value = [];

    const allItems = store.getAllTimelineItems();
    if (Array.isArray(allItems)) {
        allItems.forEach((item) => {
            if (item.latitude && item.longitude) {
                const position = new window.kakao.maps.LatLng(item.latitude, item.longitude);

                const marker = new window.kakao.maps.Marker({
                    position: position,
                    map: mapInstance.value,
                    title: item.title,
                });

                // 마커 클릭 시 오버레이 표시
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    // 기존 오버레이 제거
                    overlays.value.forEach((overlay) => overlay.setMap(null));
                    overlays.value = [];

                    const content = `
            <div class="overlay-content">
                <button class="overlay-close-btn" onclick="this.parentElement.parentElement.style.display='none';">✖</button>
                <h3>${item.title}</h3>
                <p>${item.location}</p>
                <button class="overlay-btn">자세히 보기</button>
            </div>
        `;

                    const overlay = new window.kakao.maps.CustomOverlay({
                        content: content,
                        position: position,
                        map: mapInstance.value,
                    });

                    overlays.value.push(overlay);

                    // "자세히 보기" 버튼 클릭 시 CapsuleDetail 페이지로 이동
                    const overlayBtn = overlay.a.querySelector('.overlay-btn');
                    overlayBtn.addEventListener('click', () => {
                        router.push(`/capsule/${item.coordinates.lat}/${item.coordinates.lng}`);
                    });
                });

                timelineMarkers.value.push(marker);
            }
        });
    }
};

const updateAddress = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            address.value = result[0].address.address_name;
        } else {
            address.value = '주소 변환 실패.';
        }
    });
};

const refreshUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                isUserLocationActive.value = true;
                moveToLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('사용자 위치를 가져오는 중 오류 발생: ', error);
            },
        );
    } else {
        console.error('이 브라우저는 Geolocation을 지원하지 않습니다.');
    }
};

const loadKakaoMap = (container) => {
    if (!window.kakao || !window.kakao.maps) {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=537a73f99669b692ea9dd4f4748255b9&libraries=services,clusterer,drawing&autoload=false`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                initializeMap(container);
            });
        };
    } else {
        initializeMap(container);
    }
};

const initializeMap = (container) => {
    const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 1,
    };
    mapInstance.value = new window.kakao.maps.Map(container, options);

    const zoomControl = new window.kakao.maps.ZoomControl();
    mapInstance.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    isMapReady.value = true;

    if (route.params.lat && route.params.lng) {
        isUserLocationActive.value = false;
        moveToLocation(Number(route.params.lat), Number(route.params.lng));
    } else {
        refreshUserLocation();
    }

    updateTimelineMarkers();
};

const handleResize = () => {
    if (mapInstance.value && userLocation.value) {
        mapInstance.value.setCenter(userLocation.value);
    }
};

onMounted(async () => {
    loadKakaoMap(mapContainer.value);
    window.addEventListener('resize', handleResize);

    try {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('Retrieved JWT token:', jwtToken); // JWT 토큰 로그

        let kakaoId;

        if (jwtToken) {
            const decodedToken = decodeJWT(jwtToken);
            console.log('Decoded JWT token:', decodedToken); // 디코딩된 토큰 로그

            kakaoId = decodedToken?.sub;
            console.log('Extracted kakaoId:', kakaoId); // 추출된 kakaoId 로그
        } else {
            console.log('No JWT token found in localStorage');
        }

        if (!kakaoId) {
            console.error('KakaoId not found in JWT token');
            return;
        }

        console.log('Fetching capsules for kakaoId:', kakaoId); // 캡슐 가져오기 전 kakaoId 로그
        await store.fetchMyCapsules(kakaoId);
        await store.fetchSharedCapsules(kakaoId);
        console.log('Capsules fetched successfully'); // 캡슐 가져오기 성공 로그
    } catch (error) {
        console.error('Failed to fetch capsules:', error);
    }

    watch(
        () => [store.myCapsules, store.sharedCapsules],
        () => {
            updateTimelineMarkers();
        },
        { immediate: true, deep: true },
    );
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);

    timelineMarkers.value.forEach((marker) => marker.setMap(null));
    overlays.value.forEach((overlay) => overlay.setMap(null));
    if (userMarker.value) {
        userMarker.value.setMap(null);
    }
});
</script>

<style>
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0px;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
}

.map-container {
    width: 100%;
    height: 100%;
    margin: 0px;
    background-color: #e0e0e0;
}

.refresh-location-btn {
    position: absolute;
    top: 200px;
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

.error-message {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
}

.overlay-content {
    top: -115px;
    padding: 10px 20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: 'Nanum Gothic', sans-serif;
    text-align: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
    position: relative;
}

.overlay-content::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #f9f9f9;
}

.overlay-content h3 {
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.overlay-content p {
    margin: 10px 0;
    font-size: 14px;
    color: #666;
}

.overlay-btn {
    padding: 5px;
    font-size: 14px;
    color: #f9f9f9;
    background-color: #686d76;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 5px;
    text-decoration: none;
    font-family: 'Nanum Gothic', sans-serif;
}

.overlay-btn:hover {
    background-color: #373a40;
}

.overlay-close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #f9f9f9;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #686d76;
    transition: color 0.3s ease;
}

.overlay-close-btn:hover {
    color: #373a40;
}
</style>
