import { createRouter, createWebHistory } from "vue-router";
import routes from "@/router/route";
import PageNotFound from "@/components/pages/PageNotFount.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, { path: "/:pathMatch(.*)*", name: "NotFound", component: PageNotFound }],
});

export default router;
