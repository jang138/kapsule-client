import MiddleFront from '@/components/layout/MiddleFront.vue';
import LandmarkDetail from '@/components/pages/LandmarkDetail.vue';
import PageAdd from '@/components/pages/PageAdd.vue';
import PageLandmark from '@/components/pages/PageLandmark.vue';
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
            {
                path: 'landmark',
                component: PageLandmark,
            },
            {
                path: 'landmark/:id', // 랜드마크 상세 페이지를 위한 경로
                component: LandmarkDetail,
                name: 'LandmarkDetail',
            },
        ],
    },
];

export default routes;
