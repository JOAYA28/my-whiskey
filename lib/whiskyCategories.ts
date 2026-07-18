import { Whisky } from "@/types";

export interface WhiskyCategory {
  key: string;
  label: string;
  match: (whisky: Whisky) => boolean;
}

// 위스키 타입(구조)과 향미 특징(피트/셰리/프루티)을 섞어 카테고리 필터로 노출한다.
// 한 위스키가 여러 카테고리에 동시에 속할 수 있다(예: 셰리 + 싱글몰트).
export const WHISKY_CATEGORIES: WhiskyCategory[] = [
  { key: "all", label: "전체", match: () => true },
  { key: "single-malt", label: "싱글몰트", match: (w) => w.type === "싱글몰트" },
  { key: "blended", label: "블렌디드", match: (w) => w.type === "블렌디드" },
  { key: "blended-malt", label: "블렌디드몰트", match: (w) => w.type === "블렌디드몰트" },
  { key: "bourbon", label: "버번", match: (w) => w.type === "버번" },
  { key: "peat", label: "피트/스모키", match: (w) => w.flavor.peat >= 3 },
  { key: "sherry", label: "쉐리", match: (w) => w.flavor.sherry >= 3 },
  { key: "fruity", label: "프루티", match: (w) => w.flavor.fruit >= 4 },
  { key: "highball", label: "하이볼 추천", match: (w) => w.highballFriendly },
];
