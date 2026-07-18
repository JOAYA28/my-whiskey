"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Gauge,
  MapPin,
  Percent,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import FlavorRadarChart from "@/components/FlavorRadarChart";
import InfoBadge from "@/components/InfoBadge";
import { getSimilarWhiskies } from "@/lib/scoring";
import { Whisky } from "@/types";

interface WhiskyDetailScreenProps {
  whisky: Whisky;
  onBack: () => void;
}

// 결과 화면(ResultScreen)과 거의 동일한 레이아웃이지만, 사용자 취향 매칭과
// 관련된 요소(매치율 배지, "추천 이유" 문구)는 없다 — 여기서는 특정 사용자의
// 취향과 무관하게 위스키 자체의 정보를 보여준다.
export default function WhiskyDetailScreen({ whisky, onBack }: WhiskyDetailScreenProps) {
  const [copied, setCopied] = useState(false);
  const similar = getSimilarWhiskies(whisky, 2);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근이 막힌 환경(구형 브라우저 등)에 대한 조용한 폴백
      window.prompt("아래 링크를 복사하세요", window.location.href);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-md flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-1.5 text-sm font-black text-white shadow-lg shadow-sky-500/30"
        >
          <Wine className="h-4 w-4" />
          {whisky.type}
        </motion.span>
        <h1 className="text-2xl font-black leading-snug sm:text-3xl">
          {whisky.nameKr}
        </h1>
        <p className="text-xs text-slate-400">{whisky.name}</p>
        <p className="text-balance text-sm text-slate-300 sm:text-base">
          &ldquo;{whisky.oneLiner}&rdquo;
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 className="mb-2 text-sm font-bold text-sky-300">위스키 소개</h2>
        <p className="text-sm leading-relaxed text-slate-200">
          {whisky.description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <h2 className="text-sm font-bold text-sky-300">향미 프로파일</h2>
        <FlavorRadarChart vector={whisky.flavor} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoBadge icon={<Percent className="h-4 w-4" />} label="도수" value={`${whisky.abv}%`} />
        <InfoBadge icon={<MapPin className="h-4 w-4" />} label="국가" value={whisky.country} />
        <InfoBadge icon={<Gauge className="h-4 w-4" />} label="입문 난이도" value={whisky.difficulty} />
        <InfoBadge
          icon={<Wine className="h-4 w-4" />}
          label="가격대"
          value={`$${whisky.priceUsd.toLocaleString()}`}
          caption="면세점 기준"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-sky-300">
          <UtensilsCrossed className="h-4 w-4" />
          추천 안주
        </div>
        <div className="flex flex-wrap gap-2">
          {whisky.pairingFood.map((food) => (
            <span
              key={food}
              className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-inset ring-sky-400/20"
            >
              {food}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-sky-300">비슷한 위스키</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {similar.map(({ whisky: similarWhisky, matchRate: similarityRate }) => (
            <div
              key={similarWhisky.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-white">{similarWhisky.nameKr}</p>
                <span className="text-xs font-semibold text-sky-300">
                  향미 유사도 {similarityRate}%
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                {similarWhisky.oneLiner}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-slate-100 transition-all hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </motion.button>
        <motion.button
          onClick={handleCopyLink}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition-all hover:bg-sky-500"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              복사 완료!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              위스키 링크 복사하기
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
