import MiddleFront from '@/components/layout/MiddleFront.vue';
import PageMain from '@/components/pages/PageMain.vue';
import PageNotFound from '@/components/pages/PageNotFound.vue';

const routes = [
    {
        path: '/',
        component: MiddleFront,
        children: [
            {
                path: 'main',
                component: PageMain,
                alias: ['/'],
            },
            {
                path: '/:catchAll(.*)',
                component: PageNotFound,
            },
        ],
    },
];

export default routes;
