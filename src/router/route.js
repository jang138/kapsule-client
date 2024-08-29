import MiddleFront from '@/components/layout/MiddleFront.vue';
import LandmarkDetail from '@/components/pages/LandmarkDetail.vue';
import OAuthCompo from '@/components/pages/OAuthCompo.vue';
import PageAdd from '@/components/pages/PageAdd.vue';
import PageCapsuleDetail from '@/components/pages/PageCapsuleDetail.vue';
import PageLandmark from '@/components/pages/PageLandmark.vue';
import PageMain from '@/components/pages/PageMain.vue';
import PageMyPage from '@/components/pages/PageMyPage.vue';
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
                path: '/main/:lat/:lng',
                name: 'MainPage', // 이 부분을 'MainPage'로 변경
                component: PageMain,
                props: true,
            },
            {
                path: '/capsule/create',
                component: PageAdd,
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
                path: '/auth/oauth-response/:token/:expirationTime',
                name: 'OAuth',
                component: OAuthCompo,
            },
            {
                path: '/capsule/:id',
                component: PageCapsuleDetail,
                name: 'CapsuleDetail',
                props: true,
            },
            {
                path: '/:catchAll(.*)',
                component: PageNotFound,
            },
        ],
    },
];

export default routes;
