<template>
    <div class="map-wrapper">
        <div class="map-container" ref="mapContainer"></div>
        <button class="refresh-location-btn" @click="refreshUserLocation">🔄</button>
        <div class="location-info" v-if="address">
            <p class="location-content">현재 위치 : {{ address }}</p>
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
                   const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="40" r="30" fill="#FF0000" opacity="0.2"/>
                        <circle cx="50" cy="40" r="15" fill="#FF0000"/>
                    </svg>`;
                    const encodedSvg = btoa(svgString);

                // 기존 마커 제거
                if (marker.value) {
                    marker.value.setMap(null);
                }

                // 새로운 마커 생성
                marker.value = new window.kakao.maps.Marker({
                    position: userLocation.value,
                    map: mapInstance.value,
                    title: '사용자의 위치',
                    draggable: false,
                     image: new window.kakao.maps.MarkerImage(
                            `data:image/svg+xml;base64,${encodedSvg}`,
                            new window.kakao.maps.Size(50, 50), // 아이콘 크기
                            {
                                offset: new window.kakao.maps.Point(25, 25) // 아이콘의 중심 점
                            }
                        )
                });

                // Geocoder를 이용한 주소 변환
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
</script>

<style scoped>
.container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    user-select: none;
}

.map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
}

.map-container {
    width: 100%;
    height: 90%;
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
