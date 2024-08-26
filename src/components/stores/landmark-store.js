import { defineStore } from 'pinia';

export const useLandmarkStore = defineStore('landmark', {
    state: () => ({
        landmarks: [
            {
                id: 1,
                title: '경복궁',
                location: '서울특별시 종로구 사직로 161',
                daterange: '오전 9:00~오후 6:00 (화요일 휴무)',
                image: 'https://mblogthumb-phinf.pstatic.net/MjAxODA0MDVfMTU5/MDAxNTIyOTA0MDczNDgx.9XbBJvQC0Cjd0_vRovae7PCd_96zzyNyQyc1nEtDVuAg.Xn7MGvNx5yiUOFsJUHzs8EBXTRiNvo5igzpZZ9NSYCYg.PNG.royalculture/%EA%B2%BD%EB%B3%B5%EA%B6%81%EC%82%AC%EC%A7%84.png?type=w800',
                description: `<p style="text-align: center;"><strong>경복궁(景福宮)은 1392년 조선 건국 후 1395년에 창건한 조선왕조 제일의 법궁(法宮)입니다.</strong></p>
                경복궁은 백악산(북악산)을 주산으로 넓은 지형에 건물을 배치하였고 정문인 광화문 앞으로 넓은 육조거리가 펼쳐진 한양의 중심이었다. ‘경복’의 이름은 ‘새 왕조가 큰 복을 누려 번영할 것’이라는 의미가 담겨있으며, 이곳에서 세종 대에 훈민정음이 창제되어 반포되기도 하였다. 경복궁은 1592년(선조 25) 임진왜란으로 소실되었는데 그 후 복구되지 못하였다가 270여년이 지난 1867년(고종 4)에 다시 지어졌다. 고종 대에 들어 건청궁과 태원전, 집옥재 등이 조성되었으며, 특히 건청궁 옥호루는 1895년 을미사변으로 명성황후가 시해되는 비운의 장소이기도 하다. 1910년 경술국치 후 경복궁은 계획적으로 훼손되기 시작하여 1915년 조선물산공진회를 개최한다는 명분으로 대부분의 전각들이 철거되었고, 1926년에는 조선총독부 청사를 지어 경복궁의 경관을 훼손하였다. 이후 1990년대부터 본격적으로 경복궁 복원공사가 진행되었고, 1995년부터 1997년까지 조선총독부 청사를 철거하였으며 흥례문 일원, 침전 권역, 건청궁과 태원전, 그리고 광화문 등이 복원되어 현재에 이르고 있습니다.
                `,
            },
            {
                id: 2,
                title: '예술의 전당',
                location: '서울특별시 서초구 남부순환로 2406',
                daterange: '오전 12:00 ~ 오후 10:00 (월요일 휴무)',
                image: 'https://i.namu.wiki/i/vm8301UOF76c5g9F_0R3zClSSr5ua7rc0IyIuS3Z2pkGnQV0xeCrVf0-o6qs3t2RNEg0i9JvMcMAsGAzQAS6X3uF_zPI4AJStbnIfmKLVE02E02iWTY-E8EviUnQ1S0kXeQEyT2dAiHHh7dAuAurPg.webp',
                description: `<p style="text-align: center;"><strong>예술의전당은 문화예술의 창달과 국민의 문화향수 기회 확대를 위한 문화예술공간의 운영과 문화예술진흥을 위한 사업 추진을 위해 조성한 복합문화예술센터입니다.</strong></p>
                1982년 국가 문화 예술 진흥을 위하여 문화공보부장관이 예술의전당 건립을 발의 한 후 1984년 11월 우면산 기슭 서초동 700번지에 첫 삽을 팠습니다. 1988년 음악당과 서울서예박물관 1차로 개관되었고, 1990년에는 한가람미술관과 예술자료관, 1993년 오페라하우스가 개관하며 전관 오픈하였습니다. 전통과 현대적인 감각이 어우러진 건물은 예술의전당의 또다른 볼거리로 1984년 국제 지명공모를 통하여 선정된 우리나라 건축가 김석철의 작품입니다.
                `,
            },
            {
                id: 3,
                title: '강남 코엑스',
                location: '서울특별시 강남구 영동대로 513',
                daterange: '오전 9:00 ~ 오후 10:00',
                image: 'https://i.namu.wiki/i/N3HeYeRRnwQahmlYSLl4G3Sb0tq_ZwQMjdEViRy3ruU0tVZA48PKbz30mt3fiHV0r9DvMzo2EiZMj5EKleoqPQ.webp',
                description: `<p style="text-align: center;"><strong>코엑스(COEX, COnvention & EXhibition)는 대한민국 서울특별시 강남구에 있는 한국무역협회 소속의 사기업으로, 종합전시설과 코엑스몰을 운영·관리하고 있습니다.</strong></p>
                원래 명칭은 KOEX였으나 1998년 3월 14일에 명칭을 COEX로 변경했습니다. 2호선 삼성역과 9호선 봉은사역이 코엑스와 연결되어 있습니다. 종합전시시설은 본관과 별관으로 구성되어 있고 주변에는 외국인 카지노를 비롯, 호텔과 백화점 등의 편의시설이 있으며, 지상에는 공연장인 '코엑스 아티움' 위치하고 있습니다.COEX는 매월 30~50여개의 국제전시회를 기획, 주최하던 대한민국 최대의 전시주최자(PEO:Professional Exhibition Organizer)이면서 전문 국제회의 기획사(PCO:Professional Convention Organzier)입니다. 코엑스가 주최하던 전시회 중 6개의 전시회는 국제전시협회(UFI)의 국제인증을 받은 전시회이며, 최근(2009~)엔 베트남 호치민에서 대한민국 최초로 독자 해외전시회(Vietnam Shop & Franchise show)를 개최하고 있습니다.
                `,
            },
            {
                id: 4,
                title: '광안대교',
                location: '부산광역시 수영구 광안해변로 219(광안동)',
                daterange: `평일(일-목) : 일몰 - 24시 <br /> 주말(금-토) : 일몰 - 02시`,
                image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQjJZN3BQ3AX6P8wTwkXBLvriWxMxbUFHc7jcfPHLHgOOov962SVEhFlUquE4mCt-MoY5dpK0GSf-UjqI1aSneU4bhXFKepJ-N-H2Ufyg',
                description: `<p style="text-align: center;"><strong>부산광역시 수영구 남천동과 해운대구 우동의 센텀시티를 연결하는 다리.</strong></p>
                광안대교는 부산광역시의 항로 및 산업물동량의 원활한 우회 수송을 통해 수영로·중앙로 등 도심 간선도로의 교통난을 완화하고, 해상 관광시설의 역할을 제고할 목적으로 1994년 8월에 착공해 2003년 1월 6일 완전 개통하였습니다. 이렇게 교통의 중심으로 이용되던 광안대교는 야경으로도 명성을 떨치기 시작해 지금은 광안대교를 보기 위해 밤에 많은 사람들이 광안리해수욕장을 찾고 있습니다. <br/>
                광안대교는 시간대별, 요일별, 계절별로 구분해 10만 가지 이상의 다양한 색상을 낼 수 있는 경관 조명시설을 갖추었습니다. 국내 최초의 2층 해상 교량으로, 현수교 역시 국내 최대 규모이고 연속 2층 트러스교를 현수교 양측에 360m씩 건설함으로써 광안해수욕장의 야경과 함께 부산광역시의 명소로 자리잡았습니다. 낮에 보는 광안대교도 바다빛에 일렁이기에 아름답지만 아무래도 밤하늘에 수를 놓는 듯한 광안대교의 모습이 더 황홀하다는 생각이 듭니다. 밤이 되면 특히 연인들에게 가장 좋은 여행코스가 되는데 아름다운 바다와 화려한 빛으로 빛나는 광안대교를 보면 자연스럽게 로맨틱한 분위기로 바뀌어 있을 것 입니다.연인 외에도 많은 사진가들이 광안대교의 멋을 사진에 담으려 많이 찾아오고 있습니다.
                `,
            },
            {
                id: 5,
                title: '서문시장',
                location: '대구광역시 중구 큰장로26길 45',
                daterange: '오전 9:00 ~ 오후 6:30',
                image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/10%EA%B2%BD_%EC%84%9C%EB%AC%B8%EC%8B%9C%EC%9E%A5.jpg',
                description: `<p style="text-align: center;"><strong>대구광역시 중구 대신동에 있는 대구 최대의 전통시장.</strong></p>
                대구 뿐만 아니라 전국에서도 손꼽힐 만한 대규모의 전국구 인지도를 자랑하는 재래시장입니다. <br />
                대구읍성 서문 밖에 있는 시장이라고 하여 서문시장이라는 명칭이 붙여졌다. 2016년 6월부터는 서문시장 야시장도 영업하고 있다.
                대구 도시철도 3호선 서문시장역과 가까우며 총 6개 지구(1지구, 2지구, 4지구, 5지구, 동산상가, 건해산물상가)에 4,000여 개의 점포가 입주해 있다. 서문시장의 북쪽과 서쪽(큰장네거리)에 대신지하상가도 위치하고 있으며, 서구 비산4동까지 지하상가가 뻗어 있다.
                수원, 청주에도 같은 이름의 시장이 있지만, 인지도 및 규모는 단연코 대구 서문시장이 독보적입니다. 수원시의 경우 서문시장 말고 팔달문 근처에 있는 남문시장이 경기도 최대 규모의 전통시장을 자랑하고 있다. 반대로 대구는 남문시장이 그저 그런 중소규모 시장입니다. 고령층의 경우 서문시장에 가는 것을 두고 "대신동 간다"고 표현하기도 한다.
                `,
            },
            {
                id: 6,
                title: '강원랜드',
                location: '강원도 정선군 사북읍 하이원길 265',
                daterange: '오전 10:00 ~ 오전 06:00',
                image: 'https://lh3.googleusercontent.com/p/AF1QipMcYik9ZcBp8f3zK6XKqlhXPKhC9DXVJxCA5xFQ=s1360-w1360-h1020-rw',
                description: `<p style="text-align: center;"><strong>1998년 6월 설립된 산업통상자원부 산하의 공기업, 대한민국에서 유일하게 내국인이 출입 가능한 카지노를 운영하고 있다.</strong></p>
                국내에 존재하는 카지노는 강원랜드 외에도 여럿 있지만 강원랜드 말고는 전부 외국인 전용입니다.게다가 한국인은 속인주의 때문에 외국의 카지노든 선상 카지노든 뭘 해도 원칙상으로는 일단 불법이므로, 전 세계의 카지노 중에서 유일한 곳이기도 하다.
                2016년 1월 1일부터 9,000원이다. 여신전문금융업법 제2조3에 따라 외국인을 제외하고는 신용카드로는 결제할 수 없다. 체크카드도 신용카드의 전산망을 사용하므로 불가능하다. 다만 자신의 명의로 된 실시간 계좌이체로 빠져나가는 현금카드나 직불카드 결제는 가능하다. 단 현금카드는 IC부만, 직불카드는 MS부만 승인이 가능하기에 주의해야 한다. 현금카드 기능이 있는 체크카드는 결제가 가능한지 불명. 
                직불카드는 사용하는 사람이 없는거나 마찬가지이므로 사실상 오직 현금결제만 가능하다고 보면된다. 칩 구매 역시 현금만 된다.
                입장료 자체가 세금이며, 입장료를 분석해 보면 개별소비세 6300원, 교육세 1890원, 부가가치세 810원이다. 즉 형식상 다른 세금에 다시 부가가치세가 붙은 셈이다. 외국인과 외국 영주권 등을 취득해서 재외국민 주민등록증 혹은 거주여권(PR여권)을 소지한 내국인은 입장료를 받지 않는다.
                `,
            },
            {
                id: 7,
                title: '롯데월드',
                location: '서울특별시 송파구 올림픽로 240',
                daterange: '오전 10:30 ~ 오후 8:30',
                image: 'https://i.namu.wiki/i/1x-j9vNlZuyIYUUbvD4t4tSyZl42XCH4c1EoeXXvO3FdxGijUATt_1Uxv697oMU-sr5hgoKUFkCoHnmSSrX-zQ.webp',
                description: `<p style="text-align: center;"><strong>서울특별시 송파구 잠실동 롯데월드 쇼핑몰 내부에 위치한 테마파크. 서울 도심 한복판의 잠실역과 연결되어 있으며, 1년 365일 날씨에 거의 영향을 받지 않고 즐길 수 있는 실내 테마파크이다. 보통 '롯데월드'라고 부른다.</strong></p>
                1989년에 세계 최대규모의 실내 테마파크로 개장하였다. 현재는 대지면적 기준으로 페라리 월드 아부다비에 이어 '세계 2위' 규모를 가진 실내 테마파크이자 연간 약 800만 명이 방문하는 대한민국 대표 테마파크 중 하나이다. 1989년 7월 12일에 실내구역인 어드벤처가 개원하였으며, 1990년 3월 24일 실외구역인 매직아일랜드가 추가로 개원하며 현재에 이른다.
                서울 도심 한복판, 그것도 강남권의 잠실역 바로 앞에 위치한 테마파크여서, 접근성에서는 타의 추종을 불허한다는 장점을 가지고 있다.
                테마파크의 정식 명칭은 '롯데월드 어드벤처'이나, 일반인들이나 롯데월드 어드벤처 운영측 모두 보통 '롯데월드'로 통칭하는 경우가 많다. 하지만 롯데월드는 엄밀히 말하면 테마파크인 롯데월드 어드벤처를 비롯하여 백화점, 아이스링크, 민속박물관, 호텔 등이 들어서 있는 건물을 통칭하기 때문에 롯데월드 어드벤처와 구분해서 부를 필요가 있다. 공식 명칭이 개장 당시만 해도 '롯데월드 어드벤처'였지만, 시간이 지나며 롯데월드 건물 자체의 존재가 희석됨으로써, 공식적인 명칭이 '롯데월드'로 굳어진 적도 있었다. 그러다 개장 25주년인 2014년 1월 1일에 '롯데월드 어드벤처'로 다시 바꾸면서 현재 명칭이 되었다.
                실외 구역인 매직아일랜드의 경우 개장 당시 롯데가 서울시에 기부채납 후 소유권 없이 운영권만 가지고 운영하는 상태였기 때문에 롯데월드 어드벤처와는 별개의 이름으로 현재에 이르게 되었다.
                세계 테마파크 순위에 오른 한국의 테마파크 중에서는 순위가 에버랜드와 더불어 가장 높으며 해마다 홍콩 디즈니랜드를 사이에 두고 서로 엎치락 뒤치락한다.
                `,
            },
            {
                id: 8,
                title: 'N서울타워',
                location: '서울특별시 용산구 남산공원길 105',
                daterange: '오전 10:00 ~ 오후 11:00',
                image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTARYIFCwPKitUREife1j9pEj9l-sNUqZ9p1v2tw4QkAKB4bBy2v4i9yZ5DTOz7jR8OI4YBYmBECITFsohx2bqKTfcC0CLjiDjpYSXAkw',
                description: `<p style="text-align: center;"><strong>서울특별시 용산구 남산에 있는 송신탑이자 서울을 대표하는 랜드마크로서 세계타워연맹(WFGT)에 가입되어 있다.</strong></p>
                N서울타워는 1969년에 건설이 시작되어 1971년에 완공되었습니다. 초기에는 서울 전역에 방송 전파를 송신하기 위한 용도로 세워졌으나, 시간이 지나면서 방송 목적 외에도 관광지로 발전했습니다. 1980년에 일반인에게 개방되었으며, 이후 꾸준히 서울을 찾는 관광객들에게 사랑받는 명소가 되었습니다. 2005년에는 리모델링을 거쳐 "N서울타워"라는 이름으로 새롭게 단장되었습니다. 여기서 "N"은 "새로움(New)", "남산(Namsan)", "자연(Nature)"을 의미합니다.
                상가에서 타워 전망대로 올라갈 수 있다. 밤에는 대기 상태에 따라 다양한 색상의 불빛이 들어온다. 황사 주의보나 초미세먼지 주의보 발령 시 빨간색, 초미세먼지 농도 20㎍/㎥ 이하로 공기 질이 좋은 날은 파란색, 이외의 날에는 시시각각 변하는 조명을 사용한다. 또한 '세계 헌혈자의 날'에 빨간색 조명을 사용하는등 특정 기념일에는 색상이 바뀌기도 한다.
                `,
            },
            {
                id: 9,
                title: '한라산',
                location: '제주특별자치도 제주시 1100로 2070-61',
                daterange: '오전 5:00 ~ 오후 6:00',
                image: 'https://i.namu.wiki/i/oGubnjns6sR5lwsuvUF4LN4Nm9ffhbh-0QILciEvqiZCh3G_W0VfIz6Njpr4ybAsIf5fd79p1PlREfsHbcvqsziJ3AHgQIslINIR9EWGxsgUNNVDAL8jxfmPR6WPMXoOBXNb3w2JlOZjKkT8-NyIzQ.webp',
                description: `<p style="text-align: center;"><strong>제주도에 위치한 남한에서 가장 높은 산(해발 1,947m)이자 대한민국의 가장 높은 국립공원이다.</strong></p>
                국립공원 전역이 유네스코 세계유산으로 지정되었다. 그리고 해상 활화산이다. 이름을 풀이하면 운한(雲漢: 은하수, 또는 높은 하늘)을 당긴다(拏)는 뜻으로 은하수를 붙잡을 정도로 높은 산이라는 뜻이다. 금강산, 지리산과 함께 대한민국 삼신산(三神山) 중 하나로 꼽힌다.
                제주도는 오랫동안 '한라산'이라는 이름으로 대표되는 하나의 거대한 순상화산체인 섬이라는 것이 정설이었다. 이것이 제주도 사람들의 한라산에 대한 인식과 합쳐져서 생긴 말이 "한라산이 곧 제주도이며 제주도가 곧 한라산."이다. 그러나 연구 결과가 쌓이면서, 한라산은 제주도를 쌓아올린 여러 단성 내지는 준단성화산체 중에서 가장 중앙에 높게 쌓인 것에 불과하며, 사실 제주도는 하나의 커다란 화산지대였다는 주장이 힘을 얻고 있다. 실제로 대부분 화산 폭발이 한라산의 중심부에서의 폭발이 아니었다.
                한라산은 높은 산이지만, 멀리서 보면 흔히 '산' 하면 떠오르는 뾰족하고 깎아지른 모습이 아니라 비교적 완만한 경사로 되어있다. 순상화산의 특징 중 하나. 한라산은 오랫동안 순상화산으로 분화하다가, 마그마의 분화와 점도 상승으로 인해 종상화산으로 분화 형태가 변화하면서 정상부에 종상화산체를 형성한다.
                겨울철에는 대설특보 등으로 입산 통제가 빈번하며 봄철에도 장마급 비가 내리는 한국에서 대표적인 호우 지역이다. 하루에만 1,000mm (1m)이상의 무시무시한 집중호우가 내리는 경우도 있다. 이 점을 잘 공략한다면 물이 가득찬 백록담을 보는 행운을 누릴 수도 있다.
                `,
            },
            {
                id: 10,
                title: '애버랜드',
                location: '경기도 용인시 에버랜드로 199',
                daterange: '오전 10:00 ~ 오후 10:00',
                image: 'https://cdn.gbtopnews.net/news/photo/202101/40261_70369_5512.jpg',
                description: `<p style="text-align: center;"><strong>경기도 용인시 처인구 포곡읍에 위치한 테마파크. 삼성이 설립, 운영하는 대한민국 최대 규모의 테마파크이다.</strong></p>
                1976년 3월 26일 용인자연농원(龍仁自然農園)으로 처음 개장한 이래 대한민국의 테마파크 중 가장 큰 규모를 자랑한다. 주요 시설물로는 테마파크 에버랜드, 워터파크 캐리비안 베이, 숙박시설 홈브리지 등이 있다. 1996년 1월에 에버랜드로 BI를 변경했고, 2006년 1월에 에버랜드 리조트로 BI를 다시 변경하였다.
                삼성 계열사인 삼성에버랜드㈜가 운영하다가 2014년 제일모직㈜으로, 2015년 삼성물산㈜으로 운영사가 변경되었습니다. 2013년에는 용인 경전철 에버라인이 개통되어 기흥역에서 에버랜드까지 연결되었고, 대중교통으로는 분당선과 여러 버스를 통해 접근할 수 있습니다.
                `,
            },
            {
                id: 11,
                title: '랜드마크',
                location: '인천광역시',
                daterange: '오전',
                image: '',
                description: '확인용 입니다.',
            },
        ],
    }),
    getters: {
        // 특정 ID를 기반으로 해당 랜드마크를 반환하는 역할
        getLandmarkById: (state) => (id) => {
            return state.landmarks.find((landmark) => landmark.id === id);
        },
        availableRegions(state) {
            const regions = new Set();
            state.landmarks.forEach((landmark) => {
                regions.add(landmark.location.slice(0, 2));
            });
            return Array.from(regions);
        },
        filteredLandmarks: (state) => (searchQuery, selectedRegions) => {
            return state.landmarks.filter((landmark) => {
                const matchesQuery = landmark.title.includes(searchQuery) || landmark.location.includes(searchQuery);
                const matchesRegion =
                    selectedRegions.length === 0 || selectedRegions.includes(landmark.location.slice(0, 2));
                return matchesQuery && matchesRegion;
            });
        },
    },
});
