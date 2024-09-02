const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        https: true, // HTTPS 사용
        proxy: {
            '/api': {
                target: 'https://port-0-kapsule-server-m0kjv4e106cdef3c.sel4.cloudtype.app', // Spring Boot 서버의 기본 URL
                changeOrigin: true,
                secure: true,
                pathRewrite: { '^/api': '' }, // API 요청 경로에서 '/api' 제거
            },
        },
    },
});
