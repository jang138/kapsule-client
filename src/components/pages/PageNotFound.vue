<template>
    <div class="not-found-container">
        <div class="not-found-content">
            <h1 class="not-found-title">404</h1>
            <h2 class="not-found-subtitle">Page Not Found :(</h2>
            <p class="not-found-description">The page you are looking for does not exist.</p>
            <router-link to="/" class="main-link">Go to Main</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',
};
</script>

<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #989a9c;
    color: #333;
    font-family: 'Jersey 10', sans-serif;
    text-align: center;
    user-select: none;
}

.not-found-content {
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: shake 0.6s ease;
    transform: scale(1.2);
}

@keyframes shake {
    0% {
        transform: scale(1.2) translateX(0);
    }
    25% {
        transform: scale(1.2) translateX(-10px);
    }
    50% {
        transform: scale(1.2) translateX(10px);
    }
    75% {
        transform: scale(1.2) translateX(-10px);
    }
    100% {
        transform: scale(1.2) translateX(0);
    }
}

.not-found-title {
    font-size: 6rem;
    margin: 0;
    color: #dc3545;
    font-family: 'Jersey 10', sans-serif;
}

.not-found-subtitle {
    font-size: 2rem;
    margin: 10px 0;
}

.not-found-description {
    font-size: 1rem;
    margin-bottom: 20px;
}

.main-link {
    display: inline-block;
    padding: 10px 20px;
    font-size: 1rem;
    font-family: 'Jersey 10', sans-serif;
    color: #fff;
    background-color: #007bff;
    text-decoration: none;
    border-radius: 4px;
}

.main-link:hover {
    background-color: #0056b3;
}
</style>
