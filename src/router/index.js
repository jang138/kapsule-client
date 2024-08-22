import PageNotFound from '@/components/pages/PageNotFound.vue';
import routes from '@/router/route';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound }],
});

export default router;
