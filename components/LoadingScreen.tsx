"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onDone: () => void;
}

const MESSAGES = [
  "답변을 분석하고 있어요...",
  "향미 취향 벡터를 계산하고 있어요...",
  "40종의 위스키와 비교하고 있어요...",
  "가장 잘 맞는 한 병을 고르고 있어요...",
];

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, 500);

    const doneTimer = setTimeout(() => {
      onDone();
    }, 2000);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-md flex-col items-center gap-6 text-center"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/30" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-orange-400/20" />
        <span className="relative h-14 w-14 animate-spin rounded-full border-4 border-amber-400/30 border-t-orange-300" />
      </div>
      <p className="text-lg font-bold text-slate-100">{MESSAGES[messageIndex]}</p>
      <p className="text-sm text-slate-400">잠시만 기다려주세요</p>
    </motion.div>
  );
}
