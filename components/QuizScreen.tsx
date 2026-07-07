"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS } from "@/lib/questions";
import { QuestionOption, StoredAnswer } from "@/types";

interface QuizScreenProps {
  onComplete: (answers: StoredAnswer[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  function handleSelect(option: QuestionOption) {
    const nextAnswers: StoredAnswer[] = [
      ...answers,
      { questionId: question.id, optionId: option.id },
    ];

    if (currentIndex + 1 < QUESTIONS.length) {
      setAnswers(nextAnswers);
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(nextAnswers);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-400">
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
            {question.options.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm font-medium leading-relaxed text-slate-100 shadow-lg backdrop-blur-sm transition-all hover:border-amber-400/50 hover:bg-amber-500/10 sm:text-base"
              >
                <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 align-middle">
                  {index + 1}
                </span>
                {option.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
