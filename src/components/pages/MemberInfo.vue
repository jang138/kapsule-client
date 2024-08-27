<template>
    <div>
        <h1>Welcome, {{ userName }}</h1>
        <p>Your Role: {{ userRole }}</p>
        <button @click="fetchUserInfo">Fetch User Info</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default {
    name: 'UserInfoComponent',
    setup() {
        const userName = ref('Guest');
        const userRole = ref('');
        const kakaoId = ref('');

        const fetchUserInfo = async () => {
            try {
                // JWT 토큰 가져오기 (예: 로컬 스토리지에서)
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error('No JWT token found');
                }

                // JWT 토큰에서 kakaoid 추출
                const decodedToken = jwt_decode(token);
                kakaoId.value = decodedToken.sub;

                // 백엔드로 Kakao ID 전송
                const response = await axios.post(
                    '/api/v1/member-info',
                    { kakaoId: kakaoId.value },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                // 서버에서 받은 사용자 정보 처리
                userName.value = response.data.nickname;
                userRole.value = response.data.role;
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        // 컴포넌트가 마운트될 때 사용자 정보를 가져오기
        fetchUserInfo();

        return {
            userName,
            userRole,
            fetchUserInfo,
        };
    },
};
</script>

<style scoped>
h1 {
    font-size: 24px;
    color: #333;
}
button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:hover {
    background-color: #2980b9;
}
</style>
