import { QUESTIONS } from "@/lib/questions";
import { WHISKIES } from "@/lib/whisky-data";
import {
  FlavorAxis,
  FlavorVector,
  MetaScores,
  QuizRecommendation,
  ScoredWhisky,
  StoredAnswer,
  Whisky,
} from "@/types";

// PRD docs/PRD.md 6. 추천 알고리즘 참고.
export const FLAVOR_AXES: FlavorAxis[] = [
  "peat",
  "sweet",
  "fruit",
  "sherry",
  "vanilla",
  "spice",
  "body",
];

// 각 축의 질문별 최대 원점수 합 (정규화 분모)
const AXIS_MAX_RAW: Record<FlavorAxis, number> = {
  peat: 6,
  sweet: 6,
  fruit: 6,
  sherry: 3,
  vanilla: 3,
  spice: 3,
  body: 6,
};

const AXIS_LABEL: Record<FlavorAxis, { user: string; whisky: string }> = {
  peat: { user: "훈연·스모키한 향", whisky: "피트/스모키함" },
  sweet: { user: "달콤한 맛", whisky: "묵직한 단맛" },
  fruit: { user: "상큼한 과일향", whisky: "싱그러운 과일향" },
  sherry: { user: "건과일·초콜릿 같은 진한 풍미", whisky: "셰리 캐스크의 깊은 풍미" },
  vanilla: { user: "바닐라·크림 같은 부드러운 단맛", whisky: "바닐라·크리미한 질감" },
  spice: { user: "시나몬·생강 같은 스파이시함", whisky: "스파이시한 여운" },
  body: { user: "묵직하고 진한 음식", whisky: "묵직한 바디감" },
};

// 7축 모두 0~5 스케일이므로 이론상 최대 거리 = sqrt(7 * 5^2)
const MAX_DISTANCE = Math.sqrt(FLAVOR_AXES.length * 5 * 5);

function findOption(answer: StoredAnswer) {
  const question = QUESTIONS.find((q) => q.id === answer.questionId);
  return question?.options.find((o) => o.id === answer.optionId);
}

// Step 1. 사용자 취향 벡터 정규화 (0~5 스케일)
export function buildUserVector(answers: StoredAnswer[]): FlavorVector {
  const raw: Record<FlavorAxis, number> = {
    peat: 0,
    sweet: 0,
    fruit: 0,
    sherry: 0,
    vanilla: 0,
    spice: 0,
    body: 0,
  };

  answers.forEach((answer) => {
    const option = findOption(answer);
    if (!option?.axisScores) return;
    (Object.keys(option.axisScores) as FlavorAxis[]).forEach((axis) => {
      raw[axis] += option.axisScores![axis] ?? 0;
    });
  });

  const normalized = {} as FlavorVector;
  FLAVOR_AXES.forEach((axis) => {
    normalized[axis] = (raw[axis] / AXIS_MAX_RAW[axis]) * 5;
  });
  return normalized;
}

export function extractMeta(answers: StoredAnswer[]): MetaScores {
  const meta: MetaScores = {};
  answers.forEach((answer) => {
    const option = findOption(answer);
    if (!option?.meta) return;
    Object.assign(meta, option.meta);
  });
  return meta;
}

function euclideanDistance(a: FlavorVector, b: FlavorVector): number {
  const sumSquares = FLAVOR_AXES.reduce((sum, axis) => {
    const diff = a[axis] - b[axis];
    return sum + diff * diff;
  }, 0);
  return Math.sqrt(sumSquares);
}

// Step 3. 보정 필터 적용 (경험수준/서빙방식/도수선호/예산)
function applyAdjustments(
  baseDistance: number,
  whisky: Whisky,
  userVector: FlavorVector,
  meta: MetaScores
): number {
  let distance = baseDistance;

  if (meta.experience === "초급" && whisky.difficulty === "도전" && userVector.peat < 4) {
    distance += 2.0;
  }
  if (meta.serving === "하이볼" && whisky.highballFriendly) {
    distance -= 1.0;
  }
  if (meta.serving === "스트레이트" && whisky.flavor.body >= 3) {
    distance -= 0.5;
  }
  if (meta.abvPreference === "낮음" && whisky.abv >= 46) {
    distance += 0.5;
  }
  if (meta.abvPreference === "높음" && whisky.abv >= 45) {
    distance -= 0.5;
  }
  if (meta.budget === "가성비" && whisky.priceTier === "프리미엄") {
    distance += 0.5;
  }

  return Math.max(distance, 0);
}

function toMatchRate(distance: number): number {
  const rate = (1 - distance / MAX_DISTANCE) * 100;
  return Math.max(0, Math.min(100, Math.round(rate)));
}

export function rankWhiskies(
  userVector: FlavorVector,
  meta: MetaScores
): ScoredWhisky[] {
  return WHISKIES.map((whisky) => {
    const baseDistance = euclideanDistance(userVector, whisky.flavor);
    const distance = applyAdjustments(baseDistance, whisky, userVector, meta);
    return { whisky, distance, matchRate: toMatchRate(distance) };
  }).sort((a, b) => a.distance - b.distance);
}

// 사용자 벡터에서 가장 두드러진 상위 2개 축을 골라 추천 이유 문장을 생성한다.
function buildReason(userVector: FlavorVector, whisky: Whisky): string {
  const topAxes = [...FLAVOR_AXES]
    .sort((a, b) => userVector[b] - userVector[a])
    .slice(0, 2);

  const userPhrase = topAxes.map((axis) => AXIS_LABEL[axis].user).join("과 ");
  const whiskyPhrase = topAxes.map((axis) => AXIS_LABEL[axis].whisky).join("·");

  return `${userPhrase}를 선호하는 당신의 취향은, ${whiskyPhrase}이 도드라지는 ${whisky.nameKr}와 잘 맞아요.`;
}

export function getRecommendation(answers: StoredAnswer[]): QuizRecommendation {
  const userVector = buildUserVector(answers);
  const meta = extractMeta(answers);
  const ranked = rankWhiskies(userVector, meta);

  const [recommended, ...rest] = ranked;
  const similar = rest.slice(0, 2);

  return {
    recommended,
    similar,
    userVector,
    meta,
    reason: buildReason(userVector, recommended.whisky),
  };
}
