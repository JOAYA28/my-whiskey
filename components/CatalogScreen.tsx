"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Percent } from "lucide-react";
import { WHISKIES } from "@/lib/whisky-data";
import { WHISKY_CATEGORIES } from "@/lib/whiskyCategories";

interface CatalogScreenProps {
  onBack: () => void;
}

export default function CatalogScreen({ onBack }: CatalogScreenProps) {
  const [activeCategory, setActiveCategory] = useState(WHISKY_CATEGORIES[0].key);

  const category =
    WHISKY_CATEGORIES.find((c) => c.key === activeCategory) ?? WHISKY_CATEGORIES[0];
  const filtered = useMemo(() => WHISKIES.filter(category.match), [category]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-2xl flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </motion.button>
        <h1 className="text-lg font-bold text-white sm:text-xl">
          40종 위스키 모음
        </h1>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {WHISKY_CATEGORIES.map((c) => {
          const isActive = c.key === activeCategory;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCategory(c.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-sky-500 text-white"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400">총 {filtered.length}종</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((whisky) => (
          <div
            key={whisky.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white">{whisky.nameKr}</p>
                <p className="text-xs text-slate-400">{whisky.name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-300 ring-1 ring-inset ring-sky-400/20">
                {whisky.type}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {whisky.oneLiner}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {whisky.country}
              </span>
              <span className="flex items-center gap-1">
                <Percent className="h-3 w-3" />
                {whisky.abv}%
              </span>
              <span>{whisky.difficulty}</span>
              <span>${whisky.priceUsd}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
