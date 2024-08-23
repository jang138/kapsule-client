<template>
    <div class="landmark-detail-container">
        <h2>{{ landmark.title }}</h2>
        <div class="landmark-image">
            <img :src="landmark.image" alt="Landmark Image" />
        </div>
        <p><strong>위치:</strong> {{ landmark.location }}</p>
        <p><strong>운영 시간:</strong> <span v-html="landmark.daterange"></span></p>
        <div v-html="landmark.description"></div>
        <button @click="goBack">Back to List</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            landmark: null,
        };
    },
    created() {
        const landmarkId = this.$route.params.id;
        this.fetchLandmarkDetails(landmarkId);
    },
    methods: {
        fetchLandmarkDetails(id) {
            const landmarks = [
                {
                    id: 1,
                    title: '경복궁',
                    location: '서울특별시 종로구 사직로 161',
                    daterange: '오전 9:00~오후 6:00 (화요일 휴무)',
                    image: 'https://mblogthumb-phinf.pstatic.net/MjAxODA0MDVfMTU5/MDAxNTIyOTA0MDczNDgx.9XbBJvQC0Cjd0_vRovae7PCd_96zzyNyQyc1nEtDVuAg.Xn7MGvNx5yiUOFsJUHzs8EBXTRiNvo5igzpZZ9NSYCYg.PNG.royalculture/%EA%B2%BD%EB%B3%B5%EA%B6%81%EC%82%AC%EC%A7%84.png?type=w800',
                    description: `<p style="text-align: center;"><strong>경복궁(景福宮)은 1392년 조선 건국 후 1395년에 창건한 조선왕조 제일의 법궁(法宮)이다.</strong></p>
                    경복궁은 백악산(북악산)을 주산으로 넓은 지형에 건물을 배치하였고 정문인 광화문 앞으로 넓은 육조거리가 펼쳐진 한양의 중심이었다. ‘경복’의 이름은 ‘새 왕조가 큰 복을 누려 번영할 것’이라는 의미가 담겨있으며, 이곳에서 세종 대에 훈민정음이 창제되어 반포되기도 하였다. 경복궁은 1592년(선조 25) 임진왜란으로 소실되었는데 그 후 복구되지 못하였다가 270여년이 지난 1867년(고종 4)에 다시 지어졌다. 고종 대에 들어 건청궁과 태원전, 집옥재 등이 조성되었으며, 특히 건청궁 옥호루는 1895년 을미사변으로 명성황후가 시해되는 비운의 장소이기도 하다. 1910년 경술국치 후 경복궁은 계획적으로 훼손되기 시작하여 1915년 조선물산공진회를 개최한다는 명분으로 대부분의 전각들이 철거되었고, 1926년에는 조선총독부 청사를 지어 경복궁의 경관을 훼손하였다. 이후 1990년대부터 본격적으로 경복궁 복원공사가 진행되었고, 1995년부터 1997년까지 조선총독부 청사를 철거하였으며 흥례문 일원, 침전 권역, 건청궁과 태원전, 그리고 광화문 등이 복원되어 현재에 이르고 있습니다.`,
                },
                {
                    id: 2,
                    title: '예술의 전당',
                    location: '서울특별시 서초구 남부순환로 2406',
                    daterange: '오전 12:00 ~ 오후 10:00 (월요일 휴무)',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6gGRePRdd51LRhnBPkrkhXrFxUw5tlwdn-Q&s',
                    description: `<p style="text-align: center;"><strong>예술의전당은 문화예술의 창달과 국민의 문화향수 기회 확대를 위한 문화예술공간의 운영과 문화예술진흥을 위한 사업 추진을 위해 조성한 복합문화예술센터입니다.</strong></p>
                    1982년 국가 문화 예술 진흥을 위하여 문화공보부장관이 예술의전당 건립을 발의 한 후 1984년 11월 우면산 기슭 서초동 700번지에 첫 삽을 팠습니다. 1988년 음악당과 서울서예박물관 1차로 개관되었고, 1990년에는 한가람미술관과 예술자료관, 1993년 오페라하우스가 개관하며 전관 오픈하였습니다. 전통과 현대적인 감각이 어우러진 건물은 예술의전당의 또다른 볼거리로 1984년 국제 지명공모를 통하여 선정된 우리나라 건축가 김석철의 작품입니다.`,
                },
                {
                    id: 3,
                    title: '강남 코엑스',
                    location: '서울특별시 강남구 영동대로 513',
                    daterange: '오전 9:00 ~ 오후 10:00',
                    image: 'https://i.namu.wiki/i/N3HeYeRRnwQahmlYSLl4G3Sb0tq_ZwQMjdEViRy3ruU0tVZA48PKbz30mt3fiHV0r9DvMzo2EiZMj5EKleoqPQ.webp',
                    description: `<p style="text-align: center;"><strong>코엑스(COEX, COnvention & EXhibition)는 대한민국 서울특별시 강남구에 있는 한국무역협회 소속의 사기업으로, 종합전시설과 코엑스몰을 운영·관리하고 있습니다.</strong></p>
                    원래 명칭은 KOEX였으나 1998년 3월 14일에 명칭을 COEX로 변경했습니다. 2호선 삼성역과 9호선 봉은사역이 코엑스와 연결되어 있습니다. 종합전시시설은 본관과 별관으로 구성되어 있고 주변에는 외국인 카지노를 비롯, 호텔과 백화점 등의 편의시설이 있으며, 지상에는 공연장인 '코엑스 아티움' 위치하고 있습니다.COEX는 매월 30~50여개의 국제전시회를 기획, 주최하던 대한민국 최대의 전시주최자(PEO:Professional Exhibition Organizer)이면서 전문 국제회의 기획사(PCO:Professional Convention Organzier)이다. 코엑스가 주최하던 전시회 중 6개의 전시회는 국제전시협회(UFI)의 국제인증을 받은 전시회이며, 최근(2009~)엔 베트남 호치민에서 대한민국 최초로 독자 해외전시회(Vietnam Shop & Franchise show)를 개최하고 있습니다.`,
                },
                {
                    id: 4,
                    title: '광안대교',
                    location: '부산광역시 수영구 광안해변로 219(광안동)',
                    daterange: `기본 조명 - 평일(일-목) : 일몰 - 24시, 주말(금-토) : 일몰 - 02시 <br/>
                    이벤트 조명 연출: 매일 3회(20:00, 21:00, 22:00) 평일_약 10분, 주말_약 30분간 조명연출`,
                    image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQjJZN3BQ3AX6P8wTwkXBLvriWxMxbUFHc7jcfPHLHgOOov962SVEhFlUquE4mCt-MoY5dpK0GSf-UjqI1aSneU4bhXFKepJ-N-H2Ufyg',
                    description: `<p style="text-align: center;"><strong>부산광역시 수영구 남천동과 해운대구 우동의 센텀시티를 연결하는 다리.</strong></p>
                    광안대교는 부산광역시의 항로 및 산업물동량의 원활한 우회 수송을 통해 수영로·중앙로 등 도심 간선도로의 교통난을 완화하고, 해상 관광시설의 역할을 제고할 목적으로 1994년 8월에 착공해 2003년 1월 6일 완전 개통하였습니다. 이렇게 교통의 중심으로 이용되던 광안대교는 야경으로도 명성을 떨치기 시작해 지금은 광안대교를 보기 위해 밤에 많은 사람들이 광안리해수욕장을 찾고 있습니다. <br/>
                    광안대교는 시간대별, 요일별, 계절별로 구분해 10만 가지 이상의 다양한 색상을 낼 수 있는 경관 조명시설을 갖추었습니다. 국내 최초의 2층 해상 교량으로, 현수교 역시 국내 최대 규모이고 연속 2층 트러스교를 현수교 양측에 360m씩 건설함으로써 광안해수욕장의 야경과 함께 부산광역시의 명소로 자리잡았습니다. 낮에 보는 광안대교도 바다빛에 일렁이기에 아름답지만 아무래도 밤하늘에 수를 놓는 듯한 광안대교의 모습이 더 황홀하다는 생각이 듭니다. 밤이 되면 특히 연인들에게 가장 좋은 여행코스가 되는데 아름다운 바다와 화려한 빛으로 빛나는 광안대교를 보면 자연스럽게 로맨틱한 분위기로 바뀌어 있을 것 입니다. 연인 외에도 많은 사진가들이 광안대교의 멋을 사진에 담으려 많이 찾아오고 있습니다.`,
                },
                {
                    id: 5,
                    title: '서문시장',
                    location: '대구광역시 중구 큰장로26길 45',
                    daterange: '오전 9:00~오후 6:30',
                    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/10%EA%B2%BD_%EC%84%9C%EB%AC%B8%EC%8B%9C%EC%9E%A5.jpg',
                    description: `<p style="text-align: center;"><strong>대구광역시 중구 대신동에 있는 대구 최대의 전통시장.</strong></p>
                    대구 뿐만 아니라 전국에서도 손꼽힐 만한 대규모의 전국구 인지도를 자랑하는 재래시장이다. <br />
                    대구읍성 서문 밖에 있는 시장이라고 하여 서문시장이라는 명칭이 붙여졌다. 2016년 6월부터는 서문시장 야시장도 영업하고 있다.
                    대구 도시철도 3호선 서문시장역과 가까우며 총 6개 지구(1지구, 2지구, 4지구, 5지구, 동산상가, 건해산물상가)에 4,000여 개의 점포가 입주해 있다. 서문시장의 북쪽과 서쪽(큰장네거리)에 대신지하상가도 위치하고 있으며, 서구 비산4동까지 지하상가가 뻗어 있다.
                    수원, 청주에도 같은 이름의 시장이 있지만, 인지도 및 규모는 단연코 대구 서문시장이 독보적이다. 수원시의 경우 서문시장 말고 팔달문 근처에 있는 남문시장이 경기도 최대 규모의 전통시장을 자랑하고 있다. 반대로 대구는 남문시장이 그저 그런 중소규모 시장이다. 고령층의 경우 서문시장에 가는 것을 두고 "대신동 간다"고 표현하기도 한다.`,
                },
            ];

            this.landmark = landmarks.find((landmark) => landmark.id === parseInt(id));
        },
        goBack() {
            this.$router.push('/landmark');
        },
    },
};
</script>

<style scoped>
.landmark-detail-container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landmark-detail-container h2 {
    margin-bottom: 20px;
    text-align: center;
}

.landmark-image {
    text-align: center;
    margin-bottom: 20px;
}

.landmark-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

p {
    margin: 10px 0;
}

button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>
