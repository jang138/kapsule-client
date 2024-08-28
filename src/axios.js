import axios from 'axios';

const axiosInstance = axios.create({
    // 프록시 설정을 사용하여 /api로 시작하는 모든 요청은 Spring Boot 서버로 전달됨
    baseURL: '/api',
    // 인증 관련 설정이 필요한 경우
    withCredentials: true,
});

export default axiosInstance;
0;
