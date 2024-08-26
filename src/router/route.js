import MiddleFront from "@/components/layout/MiddleFront.vue";
import PageAdd from "@/components/pages/PageAdd.vue";
import PageMain from "@/components/pages/PageMain.vue";
import PageMyPage from "@/components/pages/PageMyPage.vue";
import PageNotFound from "@/components/pages/PageNotFound.vue";

const routes = [
    {
        path: "/",
        component: MiddleFront,
        children: [
            {
                path: "main",
                component: PageMain,
                alias: ["/"],
            },
            {
                path: "/main/:lat/:lng",
                name: "MainPage", // 이 부분을 'MainPage'로 변경
                component: PageMain,
                props: true,
            },
            {
                path: "capsule",
                component: PageAdd,
            },
            {
                path: "/:catchAll(.*)",
                component: PageNotFound,
            },
            {
                path: "/myPage",
                component: PageMyPage,
            },
        ],
    },
];

export default routes;
