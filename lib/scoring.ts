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
// 질문당 5지선다(4~0점)로, 축당 질문 2개는 최대 8점, 1개는 최대 4점이다.
const AXIS_MAX_RAW: Record<FlavorAxis, number> = {
  peat: 8,
  sweet: 8,
  fruit: 8,
  sherry: 4,
  vanilla: 4,
  spice: 4,
  body: 8,
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

// 피트/셰리처럼 호불호가 뚜렷하게 갈리는 축은 가중치를 더 줘서, 그 축이
// 완벽히 일치할 때 다른 축의 사소한 차이에 밀리지 않도록 한다.
const AXIS_WEIGHT: Record<FlavorAxis, number> = {
  peat: 1.8,
  sweet: 1.0,
  fruit: 1.0,
  sherry: 1.3,
  vanilla: 1.0,
  spice: 1.0,
  body: 1.0,
};

// 사용자가 압도적으로 선호하는(1위와 2위 점수 차이가 뚜렷한) 축과 강하게
// 일치하는 위스키에 주는 추가 보너스
const DOMINANT_AXIS_THRESHOLD = 4;
const DOMINANT_AXIS_MARGIN = 1.0;
const DOMINANT_AXIS_BONUS = 1.5;
const DOMINANT_AXIS_MATCH_THRESHOLD = 4;

// 이론상 최대 거리 = sqrt(Σ weight * 5^2)
const MAX_DISTANCE = Math.sqrt(
  FLAVOR_AXES.reduce((sum, axis) => sum + AXIS_WEIGHT[axis] * 25, 0)
);

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

// 축별 가중치를 반영한 거리. 가중치가 클수록 그 축의 차이가 전체 거리에
// 더 크게 반영된다.
function weightedDistance(a: FlavorVector, b: FlavorVector): number {
  const sumSquares = FLAVOR_AXES.reduce((sum, axis) => {
    const diff = a[axis] - b[axis];
    return sum + AXIS_WEIGHT[axis] * diff * diff;
  }, 0);
  return Math.sqrt(sumSquares);
}

// 사용자 벡터에서 1위 축이 2위 축보다 뚜렷하게 높으면(=명확한 최애 취향이
// 있으면) 그 축을 반환한다. 다 고만고만하면 null.
function findDominantAxis(userVector: FlavorVector): FlavorAxis | null {
  const sorted = [...FLAVOR_AXES].sort((a, b) => userVector[b] - userVector[a]);
  const [top, runnerUp] = sorted;

  if (
    userVector[top] >= DOMINANT_AXIS_THRESHOLD &&
    userVector[top] - userVector[runnerUp] >= DOMINANT_AXIS_MARGIN
  ) {
    return top;
  }
  return null;
}

// Step 3. 보정 필터 적용 (경험수준/서빙방식 + 압도적 취향 보너스)
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

  const dominantAxis = findDominantAxis(userVector);
  if (dominantAxis && whisky.flavor[dominantAxis] >= DOMINANT_AXIS_MATCH_THRESHOLD) {
    distance -= DOMINANT_AXIS_BONUS;
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
    const baseDistance = weightedDistance(userVector, whisky.flavor);
    const distance = applyAdjustments(baseDistance, whisky, userVector, meta);
    return { whisky, distance, matchRate: toMatchRate(distance) };
  }).sort((a, b) => a.distance - b.distance);
}

// 사용자 취향과 위스키의 실제 향미가 "둘 다 강한" 축을 골라 추천 이유 문장을
// 생성한다. 사용자 벡터만 보고 축을 고르면(과거 방식), 위스키가 실제로는
// 약한 축인데도 강조하는 오류가 생길 수 있어(예: 피트=0인 위스키인데
// "피트가 도드라진다"고 설명) 두 벡터의 최솟값(min)으로 겹치는 축만 고른다.
function buildReason(userVector: FlavorVector, whisky: Whisky): string {
  const topAxes = [...FLAVOR_AXES]
    .sort(
      (a, b) =>
        Math.min(userVector[b], whisky.flavor[b]) -
        Math.min(userVector[a], whisky.flavor[a])
    )
    .slice(0, 2);

  const userPhrase = topAxes.map((axis) => AXIS_LABEL[axis].user).join("과 ");
  const whiskyPhrase = topAxes.map((axis) => AXIS_LABEL[axis].whisky).join("·");

  return `${userPhrase}를 선호하는 당신의 취향은, ${whiskyPhrase}이 도드라지는 ${whisky.nameKr}와 잘 맞아요.`;
}

// 카탈로그의 위스키 개별 페이지용: 특정 위스키와 향미가 가장 비슷한 다른
// 위스키를 찾는다(사용자 취향과 무관하게, 위스키 벡터끼리의 거리만 비교).
export function getSimilarWhiskies(whisky: Whisky, count = 2): ScoredWhisky[] {
  return WHISKIES.filter((candidate) => candidate.id !== whisky.id)
    .map((candidate) => {
      const distance = weightedDistance(whisky.flavor, candidate.flavor);
      return { whisky: candidate, distance, matchRate: toMatchRate(distance) };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
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
