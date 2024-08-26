import { createApp } from "vue";
import { createPinia } from "pinia"; // Pinia를 가져오기
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia(); // Pinia 인스턴스 생성

app.use(pinia); // Pinia를 앱에 등록
app.use(router);

app.mount("#app");
