import { Question } from "@/types";

// PRD docs/PRD.md 5. 질문 설계 참고.
// Q1~Q11: 향미 축(A~G) 점수를 쌓는 핵심 매칭 질문
// Q12~Q13: 경험수준/서빙방식 보정 질문
export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "flavor",
    axis: "peat",
    text: "훈제 베이컨, 훈제오리, 스모크 치즈 같은 훈연 요리를 먹을 때 나는?",
    options: [
      { id: "q1-1", text: "향만 맡아도 설렌다, 진할수록 좋다", axisScores: { peat: 3 } },
      { id: "q1-2", text: "적당히 스모키한 정도가 맛있다", axisScores: { peat: 2 } },
      { id: "q1-3", text: "향이 약하면 괜찮다", axisScores: { peat: 1 } },
      { id: "q1-4", text: "훈연향보다 깔끔한 재료 맛이 좋다", axisScores: { peat: 0 } },
    ],
  },
  {
    id: 2,
    category: "flavor",
    axis: "peat",
    text: "캠핑장에서 장작불 냄새가 옷에 배는 것에 대한 생각은?",
    options: [
      { id: "q2-1", text: "그 냄새가 좋아서 불 옆에 계속 앉아있는다", axisScores: { peat: 3 } },
      { id: "q2-2", text: "은은하게 남는 정도는 낭만있다", axisScores: { peat: 2 } },
      { id: "q2-3", text: "살짝 남아있는 정도는 괜찮다", axisScores: { peat: 1 } },
      { id: "q2-4", text: "냄새가 빠질 때까지 옷을 따로 세탁한다", axisScores: { peat: 0 } },
    ],
  },
  {
    id: 3,
    category: "flavor",
    axis: "sweet",
    text: "케이크, 마카롱 같은 달콤한 디저트를 얼마나 좋아하나요?",
    options: [
      { id: "q3-1", text: "디저트는 무조건 달아야 한다", axisScores: { sweet: 3 } },
      { id: "q3-2", text: "적당히 단 편이 좋다", axisScores: { sweet: 2 } },
      { id: "q3-3", text: "너무 달지 않은 게 좋다", axisScores: { sweet: 1 } },
      { id: "q3-4", text: "단맛보다 다른 맛이 중요하다", axisScores: { sweet: 0 } },
    ],
  },
  {
    id: 4,
    category: "flavor",
    axis: "sweet",
    text: "탄산음료 중 나의 취향은?",
    options: [
      { id: "q4-1", text: "콜라, 사이다처럼 확실히 단 음료", axisScores: { sweet: 3 } },
      { id: "q4-2", text: "과일맛 탄산음료(오렌지, 포도 등)", axisScores: { sweet: 2 } },
      { id: "q4-3", text: "제로 콜라처럼 단맛은 약한 음료", axisScores: { sweet: 1 } },
      { id: "q4-4", text: "토닉워터, 탄산수처럼 씁쓸/드라이한 음료", axisScores: { sweet: 0 } },
    ],
  },
  {
    id: 5,
    category: "flavor",
    axis: "fruit",
    text: "가장 좋아하는 과일 스타일은?",
    options: [
      { id: "q5-1", text: "오렌지, 자몽, 레몬 같은 상큼한 시트러스", axisScores: { fruit: 3 } },
      { id: "q5-2", text: "사과, 배처럼 은은하게 단 과일", axisScores: { fruit: 2 } },
      { id: "q5-3", text: "바나나, 복숭아처럼 부드럽고 달콤한 과일", axisScores: { fruit: 1 } },
      { id: "q5-4", text: "과일보다 초콜릿, 견과류 간식이 좋다", axisScores: { fruit: 0 } },
    ],
  },
  {
    id: 6,
    category: "flavor",
    axis: "fruit",
    text: "하이볼이나 에이드에서 가장 기대하는 향은?",
    options: [
      { id: "q6-1", text: "레몬/라임 같은 상큼한 시트러스 향", axisScores: { fruit: 3 } },
      { id: "q6-2", text: "복숭아, 사과 같은 과일 시럽 향", axisScores: { fruit: 2 } },
      { id: "q6-3", text: "과일향이 살짝만 있어도 좋다", axisScores: { fruit: 1 } },
      { id: "q6-4", text: "과일향보다 탄산의 청량감이 중요하다", axisScores: { fruit: 0 } },
    ],
  },
  {
    id: 7,
    category: "flavor",
    axis: "sherry",
    text: "다크초콜릿, 건포도, 말린 자두 같은 간식에 대한 취향은?",
    options: [
      { id: "q7-1", text: "진하고 묵직한 단맛, 최고로 좋아한다", axisScores: { sherry: 3 } },
      { id: "q7-2", text: "가끔 즐긴다", axisScores: { sherry: 2 } },
      { id: "q7-3", text: "있으면 먹지만 자주 찾지는 않는다", axisScores: { sherry: 1 } },
      { id: "q7-4", text: "전혀 안 먹는다", axisScores: { sherry: 0 } },
    ],
  },
  {
    id: 8,
    category: "flavor",
    axis: "vanilla",
    text: "바닐라아이스크림, 카라멜 마키아토 같은 크리미한 단맛은 나에게?",
    options: [
      { id: "q8-1", text: "최애 디저트 스타일이다", axisScores: { vanilla: 3 } },
      { id: "q8-2", text: "종종 즐기는 편이다", axisScores: { vanilla: 2 } },
      { id: "q8-3", text: "있으면 먹지만 찾진 않는다", axisScores: { vanilla: 1 } },
      { id: "q8-4", text: "느끼해서 별로 안 좋아한다", axisScores: { vanilla: 0 } },
    ],
  },
  {
    id: 9,
    category: "flavor",
    axis: "spice",
    text: "수정과, 애플파이처럼 시나몬/생강 향이 들어간 음식은?",
    options: [
      { id: "q9-1", text: "향이 강할수록 좋다", axisScores: { spice: 3 } },
      { id: "q9-2", text: "적당히 들어간 정도가 좋다", axisScores: { spice: 2 } },
      { id: "q9-3", text: "향이 약하면 괜찮다", axisScores: { spice: 1 } },
      { id: "q9-4", text: "향신료 향은 부담스럽다", axisScores: { spice: 0 } },
    ],
  },
  {
    id: 10,
    category: "flavor",
    axis: "body",
    text: "커피를 마신다면 나의 스타일은?",
    options: [
      { id: "q10-1", text: "진한 에스프레소, 콜드브루", axisScores: { body: 3 } },
      { id: "q10-2", text: "아메리카노(기본 농도)", axisScores: { body: 2 } },
      { id: "q10-3", text: "연하게 마시는 아메리카노", axisScores: { body: 1 } },
      { id: "q10-4", text: "커피보다 가벼운 차/음료를 선호", axisScores: { body: 0 } },
    ],
  },
  {
    id: 11,
    category: "flavor",
    axis: "body",
    text: "평소 좋아하는 음식의 무게감은?",
    options: [
      { id: "q11-1", text: "스테이크, 갈비처럼 묵직하고 진한 음식", axisScores: { body: 3 } },
      { id: "q11-2", text: "파스타, 찌개처럼 적당히 진한 음식", axisScores: { body: 2 } },
      { id: "q11-3", text: "샐러드, 담백한 흰살 요리처럼 가벼운 음식", axisScores: { body: 1 } },
      { id: "q11-4", text: "가볍고 산뜻한 음식을 항상 선호", axisScores: { body: 0 } },
    ],
  },
  {
    id: 12,
    category: "meta",
    text: "위스키(또는 하이볼)를 마셔본 경험은?",
    options: [
      { id: "q12-1", text: "위스키는 처음이에요", meta: { experience: "초급" } },
      { id: "q12-2", text: "하이볼로만 마셔봤어요", meta: { experience: "초급" } },
      { id: "q12-3", text: "스트레이트/온더락으로 몇 번 마셔봤어요", meta: { experience: "중급" } },
      { id: "q12-4", text: "좋아하는 위스키가 이미 있어요", meta: { experience: "상급" } },
    ],
  },
  {
    id: 13,
    category: "meta",
    text: "위스키를 마신다면 어떤 방식이 가장 당길까요?",
    options: [
      { id: "q13-1", text: "하이볼(탄산+얼음)로 가볍게", meta: { serving: "하이볼" } },
      { id: "q13-2", text: "온더락(얼음만 넣어서)", meta: { serving: "온더락" } },
      { id: "q13-3", text: "스트레이트(니트)로 향과 맛을 그대로", meta: { serving: "스트레이트" } },
      { id: "q13-4", text: "아직 잘 모르겠다, 추천해달라", meta: { serving: "미정" } },
    ],
  },
];
