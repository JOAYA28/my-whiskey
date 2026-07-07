"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import HomeScreen from "@/components/HomeScreen";
import QuizScreen from "@/components/QuizScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultScreen from "@/components/ResultScreen";
import { getRecommendation } from "@/lib/scoring";
import { QUIZ_RESULTS_TABLE, supabase } from "@/lib/supabase";
import { useParticipantCount } from "@/lib/useParticipantCount";
import { QuizRecommendation, Stage, StoredAnswer } from "@/types";

export default function WhiskyTestApp() {
  const searchParams = useSearchParams();
  const { count } = useParticipantCount();

  const [stage, setStage] = useState<Stage>("home");
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);

  // 공유된 결과 링크(예: ?result=<uuid>)로 진입한 경우, 저장된 답변으로 결과를
  // 다시 계산한다. 추천 알고리즘은 answers만으로 결정되는 순수 함수이므로
  // 항상 최초 결과와 동일한 결과가 재현된다.
  useEffect(() => {
    const sharedId = searchParams.get("result");
    if (!sharedId) return;

    let isMounted = true;
    supabase
      .from(QUIZ_RESULTS_TABLE)
      .select("answers")
      .eq("id", sharedId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted || error || !data) return;
        const result = getRecommendation(data.answers as StoredAnswer[]);
        setRecommendation(result);
        setStage("result");
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handleStart = useCallback(() => {
    setStage("quiz");
  }, []);

  const handleQuizComplete = useCallback((answers: StoredAnswer[]) => {
    const result = getRecommendation(answers);
    setRecommendation(result);
    setStage("loading");

    supabase
      .from(QUIZ_RESULTS_TABLE)
      .insert({
        answers,
        user_vector: result.userVector,
        recommended_whisky_id: result.recommended.whisky.id,
        similar_whisky_ids: result.similar.map((item) => item.whisky.id),
        match_rate: result.recommended.matchRate,
      })
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("[supabase] 결과 저장 실패:", error.message);
          return;
        }
        if (data) {
          const url = new URL(window.location.href);
          url.searchParams.set("result", data.id);
          window.history.replaceState({}, "", url);
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
    setStage("home");
  }, []);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {stage === "home" && (
            <HomeScreen key="home" count={count} onStart={handleStart} />
          )}
          {stage === "quiz" && (
            <QuizScreen key="quiz" onComplete={handleQuizComplete} />
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
