const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        https: true, // HTTPS 사용
        proxy: {
            '/api': {
                target: 'http://localhost:8088', // Spring Boot 서버의 기본 URL
                changeOrigin: true,
                pathRewrite: { '^/api': '' }, // API 요청 경로에서 '/api' 제거
            },
        },
    },
});
