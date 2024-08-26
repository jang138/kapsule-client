import { defineStore } from "pinia";

export const useTimelineStore = defineStore("timeline", {
    state: () => ({
        timelineItems: [
            {
                title: "혜화역 미션!",
                dateRange: "2024.08.23 ~ 2024.08.24",
                location: "서울특별시 종로구 명륜동 4가 1 ",
                coordinates: { lat: 37.582083337, lng: 127.001914726 },
            },
            {
                title: "혜화 약국",
                dateRange: "2024.07.01 ~ 2024.09.30",
                location: "서울특별시 종로구 혜화동 109-1",
                coordinates: { lat: 37.586436703496, lng: 127.00050862877 },
            },
            {
                title: "타임캡슐 타이틀 3",
                dateRange: "2024.08.11 ~ 2024.12.01",
                location: "서울특별시 종로구 삼청로 4",
                coordinates: { lat: 37.5798, lng: 126.9772 },
            },
            {
                title: "한성대입구역",
                dateRange: "2024.08.11 ~ 2024.12.01",
                location: "서울특별시 성북구 삼선동1가 14",
                coordinates: { lat: 37.588468215545, lng: 127.00631668479 },
            },
            {
                title: "서울대학교 의과대학",
                dateRange: "2024.08.11 ~ 2024.12.01",
                location: "서울특별시 종로구 연건동 28-21",
                coordinates: { lat: 37.580201794385, lng: 127.00190016466 },
            },
            {
                title: "성균관대학교",
                dateRange: "2024.08.11 ~ 2024.12.01",
                location: "서울특별시 종로구 명륜3가 53",
                coordinates: { lat: 37.584979066596, lng: 126.99694926632 },
            },
        ],
    }),
    actions: {
        addTimelineItem(item) {
            this.timelineItems.push(item);
        },
    },
});
