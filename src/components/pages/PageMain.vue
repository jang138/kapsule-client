<template>
    <div class="map-wrapper">
        <div class="map-container" ref="mapContainer"></div>
        <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
        <!-- <div class="location-info" v-if="address">
            <p class="location-content">위치 : {{ address }}</p>
        </div> -->
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTimelineStore } from '@/stores/timelineStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const userMarker = ref(null);
const address = ref('');
const isMapReady = ref(false);
const store = useTimelineStore();
const timelineMarkers = ref([]);
const isUserLocationActive = ref(false);

const moveToLocation = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const location = new window.kakao.maps.LatLng(lat, lng);
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

    // 기존 타임라인 마커 제거
    timelineMarkers.value.forEach((marker) => marker.setMap(null));
    timelineMarkers.value = [];

    store.timelineItems.forEach((item) => {
        const position = new window.kakao.maps.LatLng(item.coordinates.lat, item.coordinates.lng);

        const marker = new window.kakao.maps.Marker({
            position: position,
            map: mapInstance.value,
            title: item.title,
        });

        timelineMarkers.value.push(marker);
    });
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

                updateTimelineMarkers(); // 타임라인 마커 업데이트
            });
        };
    } else {
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

        updateTimelineMarkers(); // 타임라인 마커 업데이트
    }
};

const handleResize = () => {
    if (mapInstance.value && userLocation.value) {
        mapInstance.value.setCenter(userLocation.value);
    }
};

onMounted(() => {
    loadKakaoMap(mapContainer.value);
    window.addEventListener('resize', handleResize);

    // 타임라인 항목이 변경될 때마다 타임라인 마커 업데이트
    watch(
        () => store.timelineItems,
        () => {
            updateTimelineMarkers();
        },
        { immediate: true },
    );
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);

    // 메모리 누수를 방지하기 위해 타임라인 마커 제거
    timelineMarkers.value.forEach((marker) => marker.setMap(null));
    if (userMarker.value) {
        userMarker.value.setMap(null);
    }
});
</script>

<style scoped>
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

.location-info {
    display: flex;
    margin: 0px;
    background-color: #f5f5f5;
    border-top: 1px solid #ccc;
    text-align: left;
    width: 100%;
    height: 10%;
    justify-content: center;
    align-items: center;
}

.location-content {
    color: #2c3e50;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
}
</style>
