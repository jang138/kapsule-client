<template>
    <div class="map-wrapper">
        <div class="map-container" ref="mapContainer"></div>
        <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const marker = ref(null); // 사용자 위치를 나타내는 마커
const infowindow = ref(null); // 사용자 위치에 대한 정보창

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

            const zoomControl = new window.kakao.maps.ZoomControl();
            mapInstance.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

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

                // 기존 마커와 정보창 제거
                if (marker.value) {
                    marker.value.setMap(null);
                }
                if (infowindow.value) {
                    infowindow.value.close();
                }

                // 새로운 마커 생성
                marker.value = new window.kakao.maps.Marker({
                    position: userLocation.value,
                    map: mapInstance.value,
                    title: '사용자의 위치',
                    draggable: false,
                });

                // Geocoder를 이용한 주소 변환
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.coord2Address(lng, lat, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const address = result[0].address.address_name;

                        // 새로운 정보창 생성
                        infowindow.value = new window.kakao.maps.InfoWindow({
                            content: `<div style="padding:5px;">현재 나의 위치<br>주소: ${address}</div>`,
                        });
                        infowindow.value.open(mapInstance.value, marker.value);
                    } else {
                        console.error('Failed to convert address.');
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
</script>

<style scoped>
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
}

.map-container {
    width: 100%;
    height: 100%;
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
}

.refresh-location-btn:active {
    background-color: #f0f0f0;
}
</style>
