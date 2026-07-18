"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import CatalogScreen from "@/components/CatalogScreen";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultScreen from "@/components/ResultScreen";
import WhiskyDetailScreen from "@/components/WhiskyDetailScreen";
import { getRecommendation } from "@/lib/scoring";
import { decodeAnswers, encodeAnswers } from "@/lib/shareLink";
import { QUIZ_RESULTS_TABLE, supabase } from "@/lib/supabase";
import { getWhiskyById } from "@/lib/whisky-data";
import { QuizRecommendation, Stage, StoredAnswer, Whisky } from "@/types";

export default function WhiskyTestApp() {
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<Stage>("home");
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);
  const [selectedWhisky, setSelectedWhisky] = useState<Whisky | null>(null);

  // 공유된 결과 링크(예: ?a=<encoded>)로 진입한 경우, URL에 인코딩된 답변으로
  // 결과를 다시 계산한다. 추천 알고리즘은 answers만으로 결정되는 순수 함수라서
  // DB 조회 없이도 항상 최초 결과와 동일하게 재현된다.
  useEffect(() => {
    const encoded = searchParams.get("a");
    if (!encoded) return;

    const answers = decodeAnswers(encoded);
    if (!answers) return;

    setRecommendation(getRecommendation(answers));
    setStage("result");
  }, [searchParams]);

  // 위스키 개별 링크(예: ?w=<whiskyId>)로 진입한 경우, 해당 위스키 상세 화면을
  // 바로 보여준다.
  useEffect(() => {
    const whiskyId = searchParams.get("w");
    if (!whiskyId) return;

    const whisky = getWhiskyById(whiskyId);
    if (!whisky) return;

    setSelectedWhisky(whisky);
    setStage("whiskyDetail");
  }, [searchParams]);

  const handleStart = useCallback(() => {
    setStage("quiz");
  }, []);

  const handleOpenCatalog = useCallback(() => {
    setStage("catalog");
  }, []);

  const handleCloseCatalog = useCallback(() => {
    setStage("home");
  }, []);

  const handleSelectWhisky = useCallback((whiskyId: string) => {
    const whisky = getWhiskyById(whiskyId);
    if (!whisky) return;

    setSelectedWhisky(whisky);
    setStage("whiskyDetail");

    const url = new URL(window.location.href);
    url.searchParams.set("w", whiskyId);
    window.history.replaceState({}, "", url);
  }, []);

  const handleBackToCatalog = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("w");
    window.history.replaceState({}, "", url);
    setSelectedWhisky(null);
    setStage("catalog");
  }, []);

  const handleQuizComplete = useCallback((answers: StoredAnswer[]) => {
    const result = getRecommendation(answers);
    setRecommendation(result);
    setStage("loading");

    // 공유 링크는 URL 자체에 답변을 담아 동기적으로 완성한다(DB 저장 성공
    // 여부와 무관하게 항상 유효한 링크가 된다).
    const url = new URL(window.location.href);
    url.searchParams.set("a", encodeAnswers(answers));
    window.history.replaceState({}, "", url);

    // Supabase 저장은 통계 집계용 부가 작업이라, 실패해도 공유 링크 동작에는
    // 영향이 없도록 결과를 기다리지 않는다.
    supabase
      .from(QUIZ_RESULTS_TABLE)
      .insert({
        answers,
        user_vector: result.userVector,
        recommended_whisky_id: result.recommended.whisky.id,
        similar_whisky_ids: result.similar.map((item) => item.whisky.id),
        match_rate: result.recommended.matchRate,
      })
      .then(({ error }) => {
        if (error) {
          console.error("[supabase] 결과 저장 실패:", error.message);
        }
      });
  }, []);

  const handleLoadingDone = useCallback(() => {
    setStage("result");
  }, []);

  const handleRestart = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url);
    setRecommendation(null);
    setSelectedWhisky(null);
    setStage("home");
  }, []);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {stage === "home" && (
            <HomeScreen
              key="home"
              onStart={handleStart}
              onOpenCatalog={handleOpenCatalog}
            />
          )}
          {stage === "quiz" && (
            <QuizScreen key="quiz" onComplete={handleQuizComplete} />
          )}
          {stage === "catalog" && (
            <CatalogScreen
              key="catalog"
              onBack={handleCloseCatalog}
              onSelectWhisky={handleSelectWhisky}
            />
          )}
          {stage === "whiskyDetail" && selectedWhisky && (
            <WhiskyDetailScreen
              key="whiskyDetail"
              whisky={selectedWhisky}
              onBack={handleBackToCatalog}
            />
          )}
          {stage === "loading" && (
            <LoadingScreen key="loading" onDone={handleLoadingDone} />
          )}
          {stage === "result" && recommendation && (
            <ResultScreen
              key="result"
              recommendation={recommendation}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
