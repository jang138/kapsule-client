<template>
    <div class="container">
        <div class="page-landmark">
            <h2 style="text-align: center; width: 100%; margin-bottom: 20px">주요 랜드마크</h2>
            <div class="search-container">
                <img
                    src="@/assets/search-svgrepo-com.svg"
                    alt="Icon"
                    style="width: 20px; height: 20px; margin: auto 5px"
                />
                <input type="text" placeholder="검색..." v-model="searchQuery" />
                <button class="search-option" @click="toggleOptions">
                    지역
                    <span style="font-size: 10px">▼</span>
                </button>
            </div>

            <!-- 검색창 아래에 표시될 체크박스 컨테이너 -->
            <div v-if="showOptions" class="checkbox-container">
                <label v-for="region in availableRegions" :key="region">
                    <input type="checkbox" v-model="selectedRegions" :value="region" />
                    {{ region }}
                </label>
            </div>
            <div v-if="filteredLandmarks.length" class="landmark-list">
                <div
                    class="landmark-item"
                    v-for="landmark in filteredLandmarks"
                    :key="landmark.id"
                    @click="handleClick(landmark)"
                >
                    <div class="landmark-photo">
                        <img :src="landmark.image" alt="Landmark Photo" />
                    </div>
                    <div class="landmark-info">
                        <!-- content가 파싱된 경우에만 subtitle과 daterange 표시 -->
                        <h3>
                            {{ landmark.title }}
                        </h3>
                        <p v-if="landmark.content && typeof landmark.content === 'object'">
                            <strong>운영시간</strong> {{ landmark.content.daterange }}
                        </p>
                        <p>{{ landmark.location }}</p>
                    </div>
                    <div class="landmark-action">
                        <button v-if="isAdmin" class="delete-button" @click.stop="deleteLandmark(landmark.id)">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Layer_1"
                                data-name="Layer 1"
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                            >
                                <path
                                    d="M12.649,12L21.886,.818c.176-.213,.146-.528-.067-.704-.211-.176-.526-.147-.704,.067L12,11.215,2.886,.182c-.178-.215-.493-.243-.704-.067-.213,.176-.243,.491-.067,.704L11.351,12,2.114,23.182c-.176,.213-.146,.528,.067,.704,.212,.175,.527,.147,.704-.067L12,12.785l9.114,11.033c.177,.214,.493,.242,.704,.067,.213-.176,.243-.491,.067-.704L12.649,12Z"
                                />
                            </svg>
                        </button>

                        <button class="send-button" @click="handleClick(landmark)">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                style="float: right"
                            >
                                <rect width="40" height="40" fill="url(#pattern0_42_388)" />
                                <defs>
                                    <pattern
                                        id="pattern0_42_388"
                                        patternContentUnits="objectBoundingBox"
                                        width="1"
                                        height="1"
                                    >
                                        <use xlink:href="#image0_42_388" transform="scale(0.00195312)" />
                                    </pattern>
                                    <image
                                        id="image0_42_388"
                                        width="512"
                                        height="512"
                                        xlink:href="data:image/png;base64,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"
                                    />
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 비어 있을 때 표시할 메시지 -->
            <div v-else class="no-results">결과가 없습니다..</div>
        </div>
    </div>
</template>

<script setup>
import { useLandmarkStore } from '@/stores/landmark-store';
import { computed, ref, onMounted } from 'vue'; // onMounted 훅 추가
import { useRouter } from 'vue-router';

// 스토어 및 라우터 초기화
const store = useLandmarkStore();
const router = useRouter();

// 관리자인지 확인
const isAdmin = computed(() => store.isAdmin);

// 검색 및 필터링과 관련된 상태 관리
const searchQuery = ref(''); // 사용자 입력을 저장하는 ref 변수
const selectedRegions = ref([]);
const showOptions = ref(false);

// Computed properties
const availableRegions = computed(() => store.availableRegions);
const filteredLandmarks = computed(() => {
    return (
        store
            .filteredLandmarks(searchQuery.value, selectedRegions.value)
            // .filter((landmark) => landmark.capsuleType === 2); // capsule-type이 2인 것만 필터링
            .filter((landmark) => landmark['capsule-type'] === 2)
    );
});

// Methods
const handleClick = (landmark) => {
    console.log(`Clicked on ${landmark.title}`);
    router.push({ name: 'LandmarkDetail', params: { id: landmark.id } });
};

const toggleOptions = () => {
    showOptions.value = !showOptions.value;
};

const deleteLandmark = async (landmarkId) => {
    try {
        await store.deleteLandmark(landmarkId);
        alert('랜드마크가 삭제되었습니다.');
    } catch (error) {
        console.error('Failed to delete landmark:', error);
        alert('랜드마크 삭제 중 오류가 발생했습니다.');
    }
};

// 데이터 불러오기
onMounted(async () => {
    try {
        await store.fetchLandmarks(); // 데이터를 불러옴
    } catch (error) {
        console.error('Failed to fetch landmarks:', error);
    }
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    user-select: none;
    font-family: 'Nanum Gothic', sans-serif;
    margin: 20px;
}

.page-landmark {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}

.search-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.search-container input {
    flex: 1;
    padding: 8px;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.search-button {
    background-color: transparent;
    border: 1px solid rgb(190, 190, 190);
    border-radius: 2px;
    color: black;
    margin-right: 5px;
}

.search-option {
    background-color: transparent;
    border: 1px solid rgb(190, 190, 190);
    border-radius: 2px;
    color: black;
}

.search-option:hover,
.search-button:hover {
    background-color: #ebebeb;
}

.checkbox-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.checkbox-container label {
    margin-bottom: 5px;
    cursor: pointer;
}

.landmark-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.landmark-photo {
    width: 150px;
    height: 190px;
    overflow: hidden;
    margin-right: 10px;
}

.landmark-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지를 컨테이너에 맞추어 자르기 */
    border-radius: 8px;
}

.landmark-item {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    position: relative; /* 상대 위치 지정 */
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.landmark-item:hover {
    background-color: #e0e0e0;
}

.landmark-info {
    text-align: left;
    width: 20vh;
    height: 200px;
}

.landmark-action {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* 요소를 오른쪽으로 정렬 */
    flex-grow: 1;
}

.send-button {
    background-color: transparent;
    border: none;
    color: black;
}

.delete-button {
    position: absolute; /* 절대 위치 지정 */
    top: 10px; /* 상단에 위치 */
    right: 5px; /* 오른쪽에 위치 */
    background-color: transparent;
    border: none;
    color: black;
}

.no-results {
    text-align: center;
    font-size: 18px;
    color: #888;
    margin-top: 20px;
}
</style>
