export type FlavorAxis =
  | "peat"
  | "sweet"
  | "fruit"
  | "sherry"
  | "vanilla"
  | "spice"
  | "body";

export type FlavorVector = Record<FlavorAxis, number>;

export type ExperienceLevel = "초급" | "중급" | "상급";
export type ServingStyle = "하이볼" | "온더락" | "스트레이트" | "미정";
export type DifficultyLevel = "쉬움" | "중간" | "도전";

export interface MetaScores {
  experience?: ExperienceLevel;
  serving?: ServingStyle;
}

// 질문은 두 종류로 나뉜다.
// - flavor: 7개 향미 축(A~G) 점수를 쌓는 핵심 매칭 질문 (Q1~Q11)
// - meta: 경험수준/서빙방식 보정 질문 (Q12~Q13)
export type QuestionCategory = "flavor" | "meta";

export interface QuestionOption {
  id: string;
  text: string;
  axisScores?: Partial<Record<FlavorAxis, number>>;
  meta?: MetaScores;
}

export interface Question {
  id: number;
  category: QuestionCategory;
  axis?: FlavorAxis;
  text: string;
  options: QuestionOption[];
}

export interface StoredAnswer {
  questionId: number;
  optionId: string;
}

export interface Whisky {
  id: string;
  name: string;
  nameKr: string;
  country: string;
  type: string;
  abv: number;
  /** 국내 면세점(신라/롯데/신세계) 1병당 참고 가격(달러). 실제 가격은 매장/시기/재고에 따라 달라질 수 있다. */
  priceUsd: number;
  difficulty: DifficultyLevel;
  highballFriendly: boolean;
  flavor: FlavorVector;
  pairingFood: string[];
  description: string;
  oneLiner: string;
}

export interface ScoredWhisky {
  whisky: Whisky;
  distance: number;
  matchRate: number;
}

export interface QuizRecommendation {
  recommended: ScoredWhisky;
  similar: ScoredWhisky[];
  userVector: FlavorVector;
  meta: MetaScores;
  reason: string;
}

export type Stage = "home" | "quiz" | "loading" | "result";
