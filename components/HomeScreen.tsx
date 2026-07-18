"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";

interface HomeScreenProps {
  onStart: () => void;
  onOpenCatalog: () => void;
}

export default function HomeScreen({ onStart, onOpenCatalog }: HomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-md flex-col items-center gap-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300 ring-1 ring-inset ring-amber-400/30"
      >
        <Sparkles className="h-3.5 w-3.5" />
        향미 데이터 기반 위스키 매칭
      </motion.div>

      <h1 className="text-3xl font-black leading-snug sm:text-4xl">
        내 취향 한 잔,
        <br />
        <span className="text-gradient-brand animate-gradient-x">
          &lsquo;위스키&rsquo; 편
        </span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/30"
      >
        <Image
          src="/hero-find-my-whisky.png"
          alt="Find My Whisky - Discover your perfect dream"
          width={1264}
          height={848}
          priority
          className="h-auto w-full"
        />
      </motion.div>

      <p className="text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
        피트, 셰리, 과일향, 바닐라, 스파이스까지.
        <br className="hidden sm:block" />
        {QUESTIONS.length}개의 질문으로 내 입맛에 딱 맞는 위스키를 찾아보세요.
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-amber-600/30 transition-all hover:bg-amber-500"
      >
        내 위스키 찾으러 가기
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </motion.button>

      <motion.button
        onClick={onOpenCatalog}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-400/30 bg-sky-500/10 px-8 py-3.5 text-sm font-bold text-sky-200 transition-all hover:bg-sky-500/20"
      >
        <LayoutGrid className="h-4 w-4" />
        40종류 위스키 모음(기제)
      </motion.button>

      <p className="text-xs text-slate-500">
        {QUESTIONS.length}개의 질문 · 약 3분 소요 · 전문 지식 없이도 OK
      </p>
    </motion.div>
  );
}
