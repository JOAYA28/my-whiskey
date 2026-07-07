"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";

interface ParticipantBannerProps {
  count: number;
}

export default function ParticipantBanner({ count }: ParticipantBannerProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 shadow-lg shadow-amber-500/10 backdrop-blur-sm">
      <Users className="h-4 w-4 shrink-0 text-amber-300" />
      <span className="flex items-baseline gap-1">
        이미{" "}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-extrabold text-amber-300 tabular-nums"
          >
            {count.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        명이 나에게 맞는 위스키를 찾았어요!
      </span>
    </div>
  );
}
