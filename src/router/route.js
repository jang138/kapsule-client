import MiddleFront from '@/components/layout/MiddleFront.vue';
import LandmarkDetail from '@/components/pages/LandmarkDetail.vue';
import PageAdd from '@/components/pages/PageAdd.vue';
import PageLandmark from '@/components/pages/PageLandmark.vue';
import PageMain from '@/components/pages/PageMain.vue';
import PageNotFound from '@/components/pages/PageNotFound.vue';
import PageMyPage from '@/components/pages/PageMyPage.vue';
import LandmarkAdd from '@/components/pages/LandmarkAdd.vue';
import OAuthCompo from '@/components/pages/OAuthCompo.vue';

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
                path: '/main/:lat/:lng',
                name: 'MainPage', // 이 부분을 'MainPage'로 변경
                component: PageMain,
                props: true,
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
                path: '/myPage',
                component: PageMyPage,
            },
            {
                path: 'landmark',
                component: PageLandmark,
                name: 'LandmarkList',
            },
            {
                // 랜드마크 상세 페이지를 위한 경로
                path: 'landmark/:id',
                component: LandmarkDetail,
                name: 'LandmarkDetail',
            },
            {
                path: 'add-landmark',
                name: 'LandmarkAdd',
                component: LandmarkAdd, // 새롭게 추가된 페이지 경로
            },
            {
                path: '/auth/oauth-response/:token/:expirationTime',
                name: 'OAuth',
                component: OAuthCompo,
            },
        ],
    },
];

export default routes;
