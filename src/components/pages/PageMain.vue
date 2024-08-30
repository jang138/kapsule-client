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

const router = useRouter();

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

                const isLandmark = item.capsuleType === 2; // 랜드마크 캡슐 타입을 확인

                // SVG 선택
                let svgString;
                if (isLandmark) {
                    // 랜드마크 캡슐용 SVG
                    svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="black" stroke="none">
                        <path d="M1983 4255 c-28 -12 -45 -38 -130 -209 l-98 -196 -41 0 c-56 0 -276 24 -599 64 -234 30 -274 33 -301 21 -72 -30 -81 -91 -29 -209 102 -234 268 -403 501 -513 l104 -48 0 -247 0 -247 -152 -3 -153 -3 -262 -175 c-279 -186 -299 -205 -287 -269 13 -65 48 -81 362 -167 l62 -17 0 -610 0 -609 33 -33 32 -32 435 -6 c401 -5 1851 -4 2399 1 l233 2 34 34 34 34 0 609 0 610 83 22 c291 79 338 103 340 174 0 20 -5 46 -12 59 -7 13 -130 102 -274 198 l-262 175 -152 3 -153 4 0 247 0 247 58 24 c191 78 380 236 480 403 51 84 102 208 102 247 0 44 -23 78 -64 95 -27 12 -67 9 -301 -21 -323 -40 -543 -64 -599 -64 l-41 0 -98 196 c-88 177 -101 197 -132 210 -50 21 -1104 20 -1152 -1z m1144 -397 c65 -127 107 -199 126 -212 26 -19 33 -20 187 -8 87 7 268 26 401 42 133 17 244 29 246 27 7 -8 -106 -142 -150 -179 -122 -101 -263 -168 -415 -200 -88 -18 -141 -18 -995 -16 l-902 3 -80 23 c-195 57 -352 157 -461 296 -30 38 -53 70 -51 73 2 2 113 -10 246 -27 133 -16 314 -35 401 -42 154 -12 161 -11 187 8 19 13 61 85 126 212 l97 192 470 0 470 0 97 -192z m393 -978 l0 -210 -960 0 -960 0 0 210 0 210 960 0 960 0 0 -210z m585 -517 c71 -47 125 -88 120 -89 -131 -40 -556 -132 -775 -168 -361 -59 -498 -70 -885 -70 -382 -1 -462 5 -825 60 -236 35 -696 132 -845 178 -5 1 49 42 120 89 l130 87 1415 0 1415 0 130 -87z m-2739 -417 c851 -172 1529 -172 2390 0 95 19 177 34 183 34 8 0 11 -145 11 -510 l0 -510 -110 0 -110 0 0 286 0 286 -34 34 -34 34 -401 0 c-345 0 -406 -2 -432 -16 -55 -28 -59 -55 -59 -354 l0 -270 -210 0 -210 0 0 263 c0 153 -5 278 -11 300 -7 26 -21 44 -42 57 -30 19 -53 20 -435 20 l-404 0 -34 -34 -34 -34 0 -286 0 -286 -110 0 -110 0 0 510 c0 418 2 510 13 510 8 0 90 -15 183 -34z m764 -771 l0 -215 -265 0 -265 0 0 215 0 215 265 0 265 0 0 -215z m1390 0 l0 -215 -265 0 -265 0 0 215 0 215 265 0 265 0 0 -215z"/>
                        </g>
                    </svg>`;
                } else {
                    // 일반 캡슐용 SVG (기존 SVG 유지)
                    svgString = `
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                            <path d="M2395 5114 c-367 -42 -637 -130 -912 -296 -99 -60 -263 -178 -263 -189 0 -4 21 -32 46 -63 l46 -56 27 20 c301 231 619 368 959 416 174 24 474 15 638 -20 537 -114 1007 -447 1337 -946 151 -228 293 -572 351 -846 24 -116 58 -345 52 -351 -2 -2 -32 10 -68 26 -195 89 -609 174 -1053 216 -93 9 -189 18 -212 21 l-42 5 -24 74 c-23 68 -24 75 -9 88 10 8 92 68 183 135 214 156 252 209 253 352 0 60 -5 86 -26 131 -35 76 -88 133 -156 166 -57 28 -58 28 -297 31 l-241 3 -72 219 c-68 203 -77 223 -119 270 -64 71 -129 102 -225 108 -120 7 -227 -42 -286 -130 -15 -23 -59 -136 -98 -252 l-71 -211 -239 -5 c-224 -5 -242 -6 -291 -29 -62 -28 -136 -103 -165 -168 -45 -103 -31 -239 35 -325 19 -25 106 -96 204 -168 95 -69 175 -128 179 -133 4 -4 -3 -41 -16 -82 -27 -87 -10 -79 -200 -95 -477 -40 -924 -132 -1124 -232 l-58 -29 7 63 c61 578 295 1096 679 1503 l76 80 -52 52 c-30 30 -56 49 -65 46 -22 -9 -199 -208 -280 -318 -256 -342 -430 -772 -501 -1238 -24 -159 -24 -635 0 -794 91 -598 346 -1122 733 -1507 351 -349 736 -550 1210 -633 153 -26 500 -23 659 6 454 82 836 284 1172 618 397 395 646 903 741 1513 25 161 26 634 1 797 -105 686 -416 1258 -911 1670 -383 319 -879 498 -1366 492 -64 -1 -129 -4 -146 -5z m198 -645 c21 -5 53 -24 72 -41 32 -27 42 -53 120 -294 l86 -264 283 0 c277 0 284 0 317 -23 42 -28 79 -98 79 -152 0 -40 -28 -98 -59 -122 -17 -14 -398 -294 -413 -304 -5 -3 27 -118 71 -255 84 -258 93 -311 66 -363 -35 -69 -123 -110 -194 -91 -24 6 -122 70 -247 161 -114 83 -213 153 -219 156 -7 2 -106 -64 -221 -148 -115 -84 -227 -159 -249 -167 -78 -27 -166 13 -205 93 -29 60 -28 66 69 363 l79 243 -57 42 c-31 24 -130 96 -219 161 -92 66 -172 132 -183 150 -28 45 -26 133 4 176 51 75 46 74 365 80 l287 5 85 255 c92 276 99 293 133 312 64 37 95 43 150 27z m-2072 -2163 c203 -94 603 -174 1094 -220 572 -54 1311 -54 1890 0 171 16 524 63 539 71 4 3 5 22 2 43 l-6 37 75 15 75 15 6 -39 7 -39 41 7 c22 3 91 21 153 39 62 18 113 29 113 24 0 -30 -34 -230 -55 -323 -58 -254 -193 -585 -325 -796 -225 -360 -530 -648 -890 -839 -175 -93 -385 -135 -675 -135 -215 -1 -287 8 -476 55 -804 202 -1446 942 -1609 1854 -17 96 -39 265 -35 265 1 0 35 -15 76 -34z"/>
                            <path d="M2409 1786 c-79 -28 -139 -68 -196 -129 -68 -73 -123 -200 -123 -284 l0 -33 79 0 78 0 7 42 c16 101 79 187 171 236 43 23 62 27 135 27 73 0 92 -4 135 -27 60 -32 114 -87 146 -148 19 -36 24 -61 24 -125 -1 -100 -28 -166 -92 -226 -62 -57 -123 -81 -215 -87 l-78 -5 0 -168 0 -169 80 0 80 0 0 94 0 94 38 7 c109 20 249 133 304 247 110 225 27 494 -192 620 -108 63 -262 76 -381 34z"/>
                            <path d="M2480 460 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"/>
                            </g>
                            </svg>
                    `;
                }

                const encodedSvg = btoa(svgString);

                const markerImage = new window.kakao.maps.MarkerImage(
                    `data:image/svg+xml;base64,${encodedSvg}`,
                    new window.kakao.maps.Size(40, 40), // 마커 크기 조정
                    {
                        offset: new window.kakao.maps.Point(20, 20),
                    },
                );

                const marker = new window.kakao.maps.Marker({
                    position: position,
                    map: mapInstance.value,
                    title: item.title,
                    image: markerImage,
                });

                // Check if the unlock date is in the future and if the capsule is a landmark
                const unlockDate = new Date(item.unlockDate);
                const currentDate = new Date();
                const isLocked = item.capsuleType !== 2 && unlockDate > currentDate;

                // 마커 클릭 시 오버레이 표시
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    // 기존 오버레이 제거
                    overlays.value.forEach((overlay) => overlay.setMap(null));
                    overlays.value = [];

                    const content = `
                        <div class="overlay-content">
                            <button class="overlay-close-btn" onclick="this.parentElement.parentElement.style.display='none';">✖</button>
                            <h3>${item.title}</h3>
                            <p>${item.address}</p>
                            ${
                                isLocked
                                    ? `<p>🔒</p>`
                                    : `<button class="overlay-btn" data-id="${item.id}">자세히 보기</button>`
                            }
                        </div>
                    `;

                    const overlay = new window.kakao.maps.CustomOverlay({
                        content: content,
                        position: position,
                        map: mapInstance.value,
                    });

                    overlays.value.push(overlay);

                    // "자세히 보기" 버튼 클릭 시 Vue Router를 사용하여 페이지 이동
                    if (!isLocked) {
                        const overlayBtn = overlay.a.querySelector('.overlay-btn');
                        overlayBtn.addEventListener('click', (event) => {
                            const itemId = event.target.getAttribute('data-id');
                            if (itemId) {
                                router.push({ name: 'CapsuleDetail', params: { id: itemId } });
                            }
                        });
                    }
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

.overlay-content p.locked {
    font-size: 24px;
    text-align: center;
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
