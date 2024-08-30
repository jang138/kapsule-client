<template>
    <div class="timeline-container">
        <h1 class="title">나의 타임캡슐</h1>

        <h2 style="text-align: center; margin-top: 50px" v-if="store.loading">로딩 중...</h2>
        <div v-else-if="store.error">{{ store.error }}</div>
        <div v-else class="timeline-itemContainer">
            <!-- 내 캡슐 섹션 -->
            <div class="timeline-section">
                <!-- 내 캡슐 search bar -->
                <div class="search-bar">
                    <input type="text" v-model="mySearchQuery" placeholder="검색..." />
                    <button class="add-button" @click="showAddCapsuleModal">+</button>
                </div>
                <h2>내 캡슐</h2>
                <div class="timeline-items">
                    <div v-for="capsule in filteredMyCapsules" :key="capsule.id" class="timeline-item">
                        <button class="delete-button" @click.stop="deleteMyCapsule(capsule.id)">
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
                        <div class="item-content" @click="navigateToMain(capsule)">
                            <h3>{{ capsule.title }}</h3>
                            <p>열람 가능 날짜: {{ capsule.unlockDate }}</p>
                            <p>주소: {{ capsule.address }}</p>
                        </div>
                        <div class="item-arrow" @click="navigateToMain(capsule)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M10 17l5-5-5-5v10z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 공유 캡슐 섹션 -->
            <div class="timeline-section">
                <!-- 공유 캡슐 search bar -->
                <div class="search-bar">
                    <input type="text" v-model="sharedSearchQuery" placeholder="검색..." />
                    <button class="add-button" @click="showCapsuleCodePopup">+</button>
                </div>
                <h2>공유 캡슐</h2>
                <div class="timeline-items">
                    <div v-for="capsule in filteredSharedCapsules" :key="capsule.id" class="timeline-item">
                        <button class="delete-button" @click.stop="deleteSharedCapsule(capsule.id)">
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
                        <div class="item-content" @click="navigateToMain(capsule)">
                            <h3>{{ capsule.title }}</h3>
                            <p>열람 가능 날짜: {{ capsule.unlockDate }}</p>
                            <p>주소: {{ capsule.address }}</p>
                        </div>
                        <div class="item-arrow" @click="navigateToMain(capsule)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M10 17l5-5-5-5v10z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CapsuleCodePopup
        :isOpen="isPopupOpen"
        :errorMessage="popupErrorMessage"
        @close="closePopup"
        @submit="submitCapsuleCode"
    />
</template>

<script setup>
import { useTimelineStore } from '@/stores/timelineStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CapsuleCodePopup from './CapsuleCodePopup.vue';

const router = useRouter();
const store = useTimelineStore();
const mySearchQuery = ref('');
const sharedSearchQuery = ref('');
const isPopupOpen = ref(false);
const popupErrorMessage = ref('');

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

const filteredMyCapsules = computed(() => {
    return store.myCapsules.filter(
        (capsule) =>
            capsule.title.toLowerCase().includes(mySearchQuery.value.toLowerCase()) ||
            capsule.address.toLowerCase().includes(mySearchQuery.value.toLowerCase()),
    );
});

const filteredSharedCapsules = computed(() => {
    return store.sharedCapsules.filter(
        (capsule) =>
            capsule.title.toLowerCase().includes(sharedSearchQuery.value.toLowerCase()) ||
            capsule.address.toLowerCase().includes(sharedSearchQuery.value.toLowerCase()),
    );
});

onMounted(async () => {
    try {
        const jwtToken = localStorage.getItem('jwtToken');

        let kakaoId;

        if (jwtToken) {
            const decodedToken = decodeJWT(jwtToken);
            kakaoId = decodedToken?.sub;
            console.log('마이 페이지 카카오 아이디: :', kakaoId); // 추출된 kakaoId 로그
        } else {
            console.log('No JWT token found in localStorage');
        }

        if (!kakaoId) {
            console.error('KakaoId not found in JWT token');
            return;
        }

        await store.fetchMyCapsules(kakaoId);
        await store.fetchSharedCapsules(kakaoId);
    } catch (error) {
        console.error('Failed to fetch capsules:', error);
    }
});

const showAddCapsuleModal = () => {
    // 새 캡슐 추가 모달을 표시하는 로직
    // 이 부분은 별도의 모달 컴포넌트를 만들어 구현해야 합니다
};

const navigateToMain = (capsule) => {
    router.push({
        name: 'MainPage',
        params: {
            lat: capsule.latitude,
            lng: capsule.longitude,
        },
    });
};

const showCapsuleCodePopup = () => {
    isPopupOpen.value = true;
    popupErrorMessage.value = '';
};

const closePopup = () => {
    isPopupOpen.value = false;
    popupErrorMessage.value = '';
};

const submitCapsuleCode = async (code) => {
    try {
        const jwtToken = localStorage.getItem('jwtToken');
        console.log('JWT !!!!!!!!!! :', jwtToken);
        if (!jwtToken) {
            console.error('No JWT token found in localStorage');
            popupErrorMessage.value = '인증 정보를 찾을 수 없습니다. 다시 로그인해 주세요.';
            return;
        }

        const decodedToken = decodeJWT(jwtToken);
        if (!decodedToken || !decodedToken.sub) {
            console.error('Failed to decode JWT token or sub (kakaoId) not found');
            popupErrorMessage.value = '사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.';
            return;
        }

        const kakaoId = decodedToken.sub;
        console.log('Using kakaoId for adding shared capsule:', kakaoId);

        const result = await store.addSharedCapsule(code, kakaoId);
        if (result.success) {
            closePopup();
            // 성공적으로 추가되었을 때만 공유 캡슐 목록을 새로고침합니다.
            await store.fetchSharedCapsules(kakaoId);
        } else {
            popupErrorMessage.value = '올바른 캡슐 코드를 입력해주세요.';
        }
    } catch (error) {
        console.error('Error adding shared capsule:', error);
        popupErrorMessage.value = '캡슐 추가 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
};

const deleteMyCapsule = async (capsuleId) => {
    if (confirm('정말로 이 캡슐을 삭제하시겠습니까?')) {
        try {
            await store.deleteCapsule(capsuleId);
            console.log('캡슐이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('캡슐 삭제 중 오류 발생:', error);
        }
    }
};

const deleteSharedCapsule = async (capsuleId) => {
    if (confirm('정말로 이 공유 캡슐을 삭제하시겠습니까?')) {
        try {
            await store.deleteSharedCapsule(capsuleId);
            console.log('공유 캡슐이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('공유 캡슐 삭제 중 오류 발생:', error);
        }
    }
};
</script>

<style scoped>
.timeline-container {
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
    margin: 0 10px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.search-bar {
    display: flex;
    margin-bottom: 20px;
}

.search-bar input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
}

.add-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
}

.timeline-itemContainer {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    h2 {
        text-align: center;
    }
}

.timeline-section {
    flex: 1;
}

.timeline-section h2 {
    margin-bottom: 10px;
}
.timeline-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.timeline-item {
    position: relative;
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 75%;
}

.item-content h3 {
    margin: 0 0 5px 0;
}

.item-content p {
    margin: 0;
    color: #666;
}

.item-arrow {
    color: #007bff;
}

.delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    color: #f44336;
    cursor: pointer;
    padding: 5px;
    z-index: 1;
}
</style>
