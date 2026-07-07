"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import { QuestionOption, StoredAnswer } from "@/types";

interface QuizScreenProps {
  onComplete: (answers: StoredAnswer[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 질문 순서에 맞춰 인덱스로 저장한다. 뒤로 가서 답을 바꿔도 이후 질문의
  // 답변은 그대로 유지되고, 해당 인덱스만 덮어쓴다.
  const [answers, setAnswers] = useState<(StoredAnswer | null)[]>(
    () => Array(QUESTIONS.length).fill(null)
  );

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const selectedOptionId = answers[currentIndex]?.optionId;

  function handleSelect(option: QuestionOption) {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = { questionId: question.id, optionId: option.id };
    setAnswers(nextAnswers);

    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(nextAnswers as StoredAnswer[]);
    }
  }

  function handleBack() {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-400">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-slate-400 transition-colors enabled:hover:bg-white/5 enabled:hover:text-amber-300 disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </button>
          <span className="text-amber-300">
            [ {currentIndex + 1} / {QUESTIONS.length} ]
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-8"
        >
          <p className="text-balance text-center text-lg font-bold leading-relaxed sm:text-xl">
            {question.text}
          </p>

          <div className="flex flex-col gap-3">
            {question.options.map((option, index) => {
              const isSelected = option.id === selectedOptionId;
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium leading-relaxed shadow-lg backdrop-blur-sm transition-all sm:text-base ${
                    isSelected
                      ? "border-amber-400/70 bg-amber-500/15 text-white ring-1 ring-inset ring-amber-400/40"
                      : "border-white/10 bg-white/5 text-slate-100 hover:border-amber-400/50 hover:bg-amber-500/10"
                  }`}
                >
                  <span
                    className={`mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full align-middle text-xs font-bold ${
                      isSelected
                        ? "bg-amber-400 text-[#0f0a06]"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {option.text}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
