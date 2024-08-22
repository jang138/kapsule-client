import MiddleFront from '@/components/layout/MiddleFront.vue';
import PageAdd from '@/components/pages/PageAdd.vue';
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
                path: 'capsule',
                component: PageAdd,
            },
            {
                path: '/:catchAll(.*)',
                component: PageNotFound,
            },
        ],
    },
];

export default routes;
